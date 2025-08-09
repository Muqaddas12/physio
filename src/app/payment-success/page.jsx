import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export default async function PaymentSuccess({ searchParams }) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return <p className="p-6 text-center">Missing session ID</p>;
  }

  // Retrieve session info from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  // Extract metadata: you must have passed bookingId and paymentMethodId in metadata
  const { bookingId,  } = session.metadata;

  if (!bookingId) {
    return <p className="p-6 text-center">Missing booking or payment method info</p>;
  }


  

  return (
    <div className="max-w-lg mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4 text-emerald-700">Payment Successful!</h1>
      <p>Thank you for booking your appointment.</p>
      <p><strong>Amount Paid:</strong> €{(session.amount_total / 100).toFixed(2)}</p>
      <p><strong>Status:</strong> {session.payment_status}</p>
    </div>
  );
}
