'use server';

import Stripe from 'stripe';
import { Prisma } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession({
  therapistId,
  userId,
  amount,
  bookingId, // This should be created before payment
  paymentMethodId,
  currency = 'EUR',
  therapistName,
  slot
}) {
 
  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency.toLowerCase(), // Stripe expects lowercase
          product_data: {
            name: `Appointment with ${therapistName}`,
            description: `Time slot: ${slot}`,
          },
          unit_amount: Math.round(amount * 100), // Convert to cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/find-therapist?canceled=true`,
    metadata: {
      bookingId: bookingId.toString(),
      therapistId: therapistId.toString(),
      userId: userId.toString(),
      slot,
    },
  });



  return {
    id: session.id,
    url: session.url,

  };
}