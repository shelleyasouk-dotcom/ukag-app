import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    const sessionId = url.searchParams.get('session_id')
    if (!sessionId) {
      return new Response(JSON.stringify({ error: 'session_id required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { data: purchase, error } = await supabase
      .from('certificate_purchases')
      .select('id, status, pdf_path, child_name, pathway, level, download_token')
      .eq('stripe_session_id', sessionId)
      .maybeSingle()

    if (error || !purchase) {
      return new Response(
        JSON.stringify({ status: 'not_found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    let downloadUrl: string | null = null
    if (purchase.status === 'emailed' && purchase.pdf_path) {
      // Generate a signed URL valid for 1 hour
      const { data: signedData } = await supabase.storage
        .from('certificates')
        .createSignedUrl(purchase.pdf_path, 3600)
      downloadUrl = signedData?.signedUrl ?? null
    }

    return new Response(
      JSON.stringify({
        status: purchase.status,
        ready: purchase.status === 'emailed',
        downloadUrl,
        childName: purchase.child_name,
        pathway: purchase.pathway,
        level: purchase.level,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('get-certificate-status error:', err)
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
