import { PrismaClient } from '@prisma/client'
import Stripe from 'stripe'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
})

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req) {
  const sig = req.headers.get('stripe-signature')

  let event
  try {
    const bodyBuffer = Buffer.from(await req.arrayBuffer())
    event = stripe.webhooks.constructEvent(bodyBuffer, sig, endpointSecret)
  } catch (err) {
    console.error('❌ Webhook signature verification failed.', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const bookingId = session.metadata?.bookingId
        const paymentIntentId = session.payment_intent

        if (!bookingId) {
          console.warn('⚠️ Missing bookingId in metadata')
          break
        }

        await prisma.payment.updateMany({
          where: {
            bookingId: Number(bookingId),
          },
          data: {
            stripePaymentIntentId: paymentIntentId,
            status: 'completed',
            processedAt: new Date(),
          },
        })

        console.log(`✅ Payment completed for booking ${bookingId}`)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object

        await prisma.payment.updateMany({
          where: {
            stripePaymentIntentId: paymentIntent.id,
          },
          data: {
            status: 'failed',
            processedAt: new Date(),
          },
        })

        console.log(`❌ Payment failed for intent ${paymentIntent.id}`)
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error('❌ Webhook processing error:', err)
    return new Response('Internal Server Error', { status: 500 })
  }
}
