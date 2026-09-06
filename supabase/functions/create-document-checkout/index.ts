import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-user-token',
}

const PRODUCTS: Record<string, { title: string; priceGBP: number; renewalDiscountPct: number; available: boolean }> = {
  'ops-manual':        { title: 'UKAG Master Operations Manual 2026/27',   priceGBP: 145, renewalDiscountPct: 20, available: true },
  'coach-handbook':    { title: 'UKAG Coach Work Handbook v1.0',            priceGBP: 125, renewalDiscountPct: 20, available: true },
  'schools-compliance':{ title: 'UKAG Schools Compliance Pack 2026',        priceGBP: 95,  renewalDiscountPct: 20, available: true },
  'safeguarding-policy':     { title: 'UKAG Safeguarding & Child Protection Policy', priceGBP: 35, renewalDiscountPct: 20, available: false },
  'hs-policy':               { title: 'UKAG Health & Safety Policy',              priceGBP: 35, renewalDiscountPct: 20, available: false },
  'behaviour-policy':        { title: 'UKAG Behaviour Management Policy',         priceGBP: 35, renewalDiscountPct: 20, available: false },
  'equality-policy':         { title: 'UKAG Equality & Diversity Policy',         priceGBP: 35, renewalDiscountPct: 20, available: false },
  'complaints-policy':       { title: 'UKAG Complaints Policy & Procedure',       priceGBP: 35, renewalDiscountPct: 20, available: false },
  'data-protection-policy':  { title: 'UKAG Data Protection & GDPR Policy',       priceGBP: 35, renewalDiscountPct: 20, available: false },
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured')

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const body = await req.json()
    const { productId, userEmail } = body

    if (!productId) throw new Error('productId is required')

    const product = PRODUCTS[productId]
    if (!product) throw new Error(`Unknown product: ${productId}`)
    if (!product.available) throw new Error('This document is not yet available for purchase')

    // Resolve user from token
    let userId: string | null = null
    const token = req.headers.get('x-user-token')
    if (token) {
      const { data: { user } } = await createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: `Bearer ${token}` } } },
      ).auth.getUser()
      userId = user?.id ?? null
    }

    // Check for a previous paid purchase (renewal discount)
    let priceGBP = product.priceGBP
    let renewedFromId: string | null = null
    let isRenewal = false

    if (userId) {
      const { data: prev } = await supabase
        .from('document_purchases')
        .select('id, purchased_at')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .eq('status', 'paid')
        .order('purchased_at', { ascending: false })
        .limit(1)
        .single()

      if (prev) {
        isRenewal = true
        renewedFromId = prev.id
        priceGBP = Math.round(product.priceGBP * (1 - product.renewalDiscountPct / 100))
      }
    }

    const pricePence = priceGBP * 100

    // Create pending purchase record
    const { data: purchase, error: dbErr } = await supabase
      .from('document_purchases')
      .insert({
        user_id: userId,
        product_id: productId,
        price_paid_pence: pricePence,
        status: 'pending',
        renewed_from: renewedFromId,
      })
      .select()
      .single()

    if (dbErr || !purchase) throw new Error(`DB insert failed: ${dbErr?.message}`)

    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' })
    const origin = req.headers.get('origin') || 'https://ukacademiesofgymnastics.com'

    const description = isRenewal
      ? `Renewal — ${product.renewalDiscountPct}% discount applied`
      : 'Personalise with your club details after purchase'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: {
            name: product.title,
            description,
          },
          unit_amount: pricePence,
        },
        quantity: 1,
      }],
      mode: 'payment',
      customer_email: userEmail ?? undefined,
      success_url: `${origin}/documents/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/resources`,
      metadata: { purchase_id: purchase.id },
    })

    await supabase
      .from('document_purchases')
      .update({ stripe_session_id: session.id })
      .eq('id', purchase.id)

    return new Response(
      JSON.stringify({ url: session.url, isRenewal, priceGBP }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error('create-document-checkout error:', err)
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})
