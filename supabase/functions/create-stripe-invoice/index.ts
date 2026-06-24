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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { school_name, contact_name, contact_email, line_items, currency = 'gbp', notes, days_until_due = 14 } = await req.json()

    if (!contact_email || !line_items?.length) {
      throw new Error('contact_email and at least one line item are required')
    }

    // Find or create Stripe customer
    const existing = await stripe.customers.list({ email: contact_email, limit: 1 })
    const customer = existing.data.length > 0
      ? existing.data[0]
      : await stripe.customers.create({
          email: contact_email,
          name: contact_name || school_name,
          metadata: { school_name: school_name || '' },
        })

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      currency,
      collection_method: 'send_invoice',
      days_until_due,
      description: notes || `UKAG Training — ${school_name || contact_name}`,
      metadata: { school_name: school_name || '' },
    })

    // Add line items
    for (const item of line_items) {
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        description: item.description,
        quantity: item.quantity ?? 1,
        unit_amount: Math.round(Number(item.unit_price) * 100),
        currency,
      })
    }

    // Finalise and send
    const finalised = await stripe.invoices.finalizeInvoice(invoice.id)
    const sent = await stripe.invoices.sendInvoice(finalised.id)

    const total = (sent.amount_due ?? 0) / 100

    // Save to stripe_invoices table
    const { error: insertError } = await supabase.from('stripe_invoices').insert({
      school_name: school_name || null,
      contact_name: contact_name || null,
      contact_email,
      line_items,
      total_amount: total,
      currency,
      stripe_invoice_id: sent.id,
      stripe_invoice_url: sent.hosted_invoice_url,
      status: sent.status ?? 'open',
      notes: notes || null,
    })

    if (insertError) {
      console.error('Supabase insert error:', insertError)
    }

    return new Response(JSON.stringify({
      success: true,
      invoice_id: sent.id,
      invoice_url: sent.hosted_invoice_url,
      total,
      save_error: insertError?.message || null,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
