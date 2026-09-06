import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore — fflate works in Deno via esm.sh
import { unzipSync, zipSync, strToU8, strFromU8 } from 'https://esm.sh/fflate@0.8.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-token',
}

const FILE_KEYS: Record<string, string> = {
  'ops-manual':         'UKAG_Master_Operations_Manual_2026_27.docx',
  'coach-handbook':     'UKAG_Coach_Work_Handbook_v1_0.docx',
  'schools-compliance': 'UKAG_Schools_Compliance_Pack_2026.docx',
}

const PLACEHOLDER_MAP: Record<string, string> = {
  '[Club Name]': 'clubName',
  '[Your Organisation Name]': 'clubName',
  '[Organisation Name]': 'clubName',
  '[Club Address]': 'clubAddress',
  '[Club Website]': 'clubWebsite',
  '[club email]': 'clubEmail',
  '[club email address]': 'clubEmail',
  '[Club Contact Email]': 'clubEmail',
  '[safeguarding email]': 'dslEmail',
  '[Club DSL Name]': 'dslName',
  '[Club DSL]': 'dslName',
  '[DSL Name]': 'dslName',
  '[DSL Role]': 'dslRole',
  '[DSL Contact]': 'dslPhone',
  '[Deputy DSL Name]': 'deputyDslName',
  '[Club Lead Coach Name]': 'clubLeadCoach',
  '[Club Lead Coach]': 'clubLeadCoach',
  '[Lead Coach]': 'clubLeadCoach',
  '[Club Manager]': 'clubManager',
  '[Club Manager/Owner]': 'clubManager',
  '[Club Owner/Director]': 'clubManager',
  '[Club Manager / Owner]': 'clubManager',
  '[your accountant/bookkeeper]': 'clubManager',
  '[payroll cut-off date per your contract]': 'payrollCutoffDate',
  '[payroll cut-off date]': 'payrollCutoffDate',
  '[Payroll cut-off date — see contract]': 'payrollCutoffDate',
  '[payment date per your contract]': 'paymentDate',
  '[Payment date — see contract]': 'paymentDate',
  '[club accounts email]': 'clubEmail',
  '[accounts email]': 'clubEmail',
  '[Operations Manager — see internal contact list]': 'clubManager',
  '[insert phone/email]': 'clubPhone',
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Verify user owns this purchase
    const token = req.headers.get('x-user-token')
    if (!token) throw new Error('Authentication required')

    const { data: { user } } = await createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: `Bearer ${token}` } } },
    ).auth.getUser()
    if (!user) throw new Error('Invalid session')

    const body = await req.json()
    const { purchaseId, fields } = body as { purchaseId: string; fields: Record<string, string> }

    if (!purchaseId) throw new Error('purchaseId is required')
    if (!fields || typeof fields !== 'object') throw new Error('fields is required')

    // Verify ownership
    const { data: purchase } = await supabase
      .from('document_purchases')
      .select('*')
      .eq('id', purchaseId)
      .eq('user_id', user.id)
      .eq('status', 'paid')
      .single()

    if (!purchase) throw new Error('Purchase not found or not paid')

    const fileKey = FILE_KEYS[purchase.product_id]
    if (!fileKey) throw new Error('No file available for this product yet')

    // Fetch template from app's public URL
    const siteUrl = Deno.env.get('SITE_URL') || 'https://ukacademiesofgymnastics.com'
    const templateUrl = `${siteUrl}/docs/${fileKey}`

    const fetchRes = await fetch(templateUrl)
    if (!fetchRes.ok) throw new Error(`Failed to fetch template: ${fetchRes.status}`)
    const templateBytes = new Uint8Array(await fetchRes.arrayBuffer())

    // Unzip DOCX
    const unzipped = unzipSync(templateBytes)

    // Process word/document.xml — replace placeholders
    const docXmlKey = 'word/document.xml'
    if (!unzipped[docXmlKey]) throw new Error('Invalid DOCX — missing word/document.xml')

    let xml = strFromU8(unzipped[docXmlKey])

    for (const [placeholder, fieldKey] of Object.entries(PLACEHOLDER_MAP)) {
      const value = fields[fieldKey]
      if (value && value.trim()) {
        xml = xml.replaceAll(placeholder, escapeXml(value.trim()))
      }
    }

    unzipped[docXmlKey] = strToU8(xml)

    // Also replace in footer/header if present
    for (const key of Object.keys(unzipped)) {
      if ((key.startsWith('word/footer') || key.startsWith('word/header')) && key.endsWith('.xml')) {
        let partXml = strFromU8(unzipped[key])
        for (const [placeholder, fieldKey] of Object.entries(PLACEHOLDER_MAP)) {
          const value = fields[fieldKey]
          if (value && value.trim()) {
            partXml = partXml.replaceAll(placeholder, escapeXml(value.trim()))
          }
        }
        unzipped[key] = strToU8(partXml)
      }
    }

    // Rezip
    const personalised = zipSync(unzipped)

    // Store personalisation data on purchase record
    await supabase
      .from('document_purchases')
      .update({ personalisation: fields })
      .eq('id', purchaseId)

    // Return the personalised DOCX
    const filename = fileKey.replace('.docx', `_${(fields.clubName || 'Personalised').replace(/[^a-zA-Z0-9]/g, '_')}.docx`)

    return new Response(personalised, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('personalise-document error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
