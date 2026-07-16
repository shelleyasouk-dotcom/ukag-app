import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured')

    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (!resendKey) throw new Error('RESEND_API_KEY not configured')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const body = await req.json()
    const { childName, pathway, level, school, dateAchieved, coachName, parentEmail } = body

    // Validate required fields
    if (!childName?.trim()) throw new Error('Child name is required')
    if (!['gymnastics', 'trampolining'].includes(pathway)) throw new Error('Invalid pathway')
    if (!level || level < 1 || level > 6) throw new Error('Level must be 1–6')
    if (!parentEmail?.includes('@')) throw new Error('Valid parent email required')

    // Store pending purchase record
    const { data: purchase, error: dbErr } = await supabase
      .from('certificate_purchases')
      .insert({
        child_name: childName.trim(),
        pathway,
        level: Number(level),
        school: school?.trim() || null,
        date_achieved: dateAchieved?.trim() || null,
        coach_name: coachName?.trim() || null,
        parent_email: parentEmail.trim().toLowerCase(),
        status: 'pending',
      })
      .select()
      .single()

    if (dbErr || !purchase) throw new Error(`DB insert failed: ${dbErr?.message}`)

    // Build Stripe Checkout session
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })

    const pathwayLabel = pathway === 'gymnastics' ? 'Gymnastics' : 'Trampolining'
    const levelWords   = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']
    const levelLabel   = levelWords[level - 1] ?? String(level)

    const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || 'https://ukacademiesofgymnastics.com'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `UKAG ${pathwayLabel} Level ${levelLabel} Certificate`,
            description: `Award certificate for ${childName}`,
            images: [],
          },
          unit_amount: 299, // £2.99
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: parentEmail.trim().toLowerCase(),
      success_url: `${origin}/certificates/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/certificates`,
      metadata: {
        purchase_id: purchase.id,
      },
    })

    // Store session ID against the purchase
    await supabase
      .from('certificate_purchases')
      .update({ stripe_session_id: session.id })
      .eq('id', purchase.id)

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('create-certificate-checkout error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
