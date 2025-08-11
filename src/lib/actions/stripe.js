'use server'

import { Prisma } from '@prisma/client'
import Stripe from 'stripe'
import { createBooking } from './booking'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  export async function createBookingAndPayment({
  patientId,
  physiotherapistId,
  clinicId,
  appointmentTime,
  totalAmount,
      currency,
  paymentMethodId,
  specialization,
    durationMinutes = 60,


      patientNotes='',
}) {
const now = new Date();
const appointmentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  try {
    // 1. Validate inputs
    if (
      !patientId ||
      !physiotherapistId ||
      !clinicId ||
      !appointmentTime ||
      !totalAmount ||
      !paymentMethodId
    ) {
      throw new Error('Missing required booking or payment details')
    }
const treatmentTypeId=null
    // 2. Create booking
    const booking = await createBooking({
      patientId,
      physiotherapistId,
      clinicId,
      appointmentDate,
      appointmentTime,
      durationMinutes,
      treatmentTypeId,
      patientNotes,
      totalAmount
    })

    if (!booking?.success) {
      throw new Error(booking.error || 'Booking creation failed')
    }
 const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency,
        product_data: {
          name: `Therapy with ${specialization || 'Physiotherapist'}`,
          description: `Booking Ref: ${booking.data.bookingReference}`,
        },
        unit_amount: Math.round(totalAmount * 100),
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.data.bookingReference}`,
  cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-cancel`,
  metadata: {
    bookingId: booking.data.id.toString(),
  },
});


    return {
      success: true,
      checkoutUrl: session.url,
      bookingId: booking.data.id,
      // paymentId: payment.id
    }
  } catch (error) {
    console.error('Booking & Payment error:', error)
    return { success: false, error: error.message }
  }
}
