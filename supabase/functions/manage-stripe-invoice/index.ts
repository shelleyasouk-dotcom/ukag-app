import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured')

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-06-20',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    const { action, record_id, stripe_invoice_id } = await req.json()

    if (action === 'delete') {
      // Just remove from our records — void in Stripe separately if needed
      const { error } = await supabase.from('stripe_invoices').delete().eq('id', record_id)
      if (error) throw new Error(error.message)
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'void') {
      if (!stripe_invoice_id) throw new Error('stripe_invoice_id required')
      const voided = await stripe.invoices.voidInvoice(stripe_invoice_id)
      await supabase.from('stripe_invoices').update({ status: 'void' }).eq('id', record_id)
      return new Response(JSON.stringify({ success: true, status: voided.status }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (action === 'resend') {
      if (!stripe_invoice_id) throw new Error('stripe_invoice_id required')
      await stripe.invoices.sendInvoice(stripe_invoice_id)
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    throw new Error(`Unknown action: ${action}`)

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
