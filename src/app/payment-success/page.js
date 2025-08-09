import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function MyBookings({ searchParams }) {
  // You can get userId from searchParams or your auth/session logic
  const userId = searchParams.userId;

  if (!userId) {
    return <p>Please login to view your bookings.</p>;
  }

  const bookings = await prisma.payment.findMany({
    where: { userId },
    include: { therapist: true },
    orderBy: { createdAt: "desc" },
  });

  if (bookings.length === 0) {
    return <p>No bookings found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <li
            key={booking.id}
            className="border border-gray-300 rounded p-4 shadow-sm flex justify-between items-center"
          >
            <div>
              <p><strong>Therapist:</strong> {booking.therapist.name}</p>
              <p><strong>Amount Paid:</strong> ${(booking.amount / 100).toFixed(2)} {booking.currency.toUpperCase()}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Date:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
