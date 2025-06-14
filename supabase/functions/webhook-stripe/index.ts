import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'npm:stripe@14.21.0'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const signature = req.headers.get('stripe-signature')
    const body = await req.text()
    
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature!, webhookSecret!)
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message)
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: corsHeaders
      })
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('PaymentIntent was successful!', paymentIntent.id)
        
        // Update user credits or subscription status
        await supabase
          .from('user_credits')
          .upsert({
            user_id: paymentIntent.metadata?.user_id,
            credits: paymentIntent.amount / 100, // Convert cents to credits
            transaction_id: paymentIntent.id,
            status: 'completed'
          })
        
        break
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object
        console.log('Subscription updated:', subscription.id)
        
        // Update user subscription status
        await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: subscription.metadata?.user_id,
            subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000),
            current_period_end: new Date(subscription.current_period_end * 1000),
            plan_id: subscription.items.data[0]?.price.id
          })
        
        break
        
      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object
        console.log('Subscription cancelled:', deletedSubscription.id)
        
        // Update subscription status to cancelled
        await supabase
          .from('user_subscriptions')
          .update({ status: 'cancelled' })
          .eq('subscription_id', deletedSubscription.id)
        
        break
        
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})