'use client';

import React, { useState, useTransition } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { useRouter } from 'next/navigation'
import { createBookingAndPayment } from "@/lib/actions/stripe";
import { getCurrentUser } from "@/lib/auth";
export default function TherapistCard({ therapist }) {
  const router=useRouter()
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [error, setError] = useState(null);
  
  const clinic = therapist.clinics?.[0];


async function handleBook() {

  try {

    const priceNumber = Number(therapist.price.replace(/[^\d.]/g, ""));
    const amountCents = Math.round(priceNumber * 100);

    const user = await getCurrentUser();

 
    if (!user) {
      if (confirm("Login First. Do you want to go to the login page?")) {
        router.push("/login");
      }
      return; 
    }


    if (!selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    setLoading(true);
    setError(null);

    startTransition(async () => {
      try {
        const session = await createBookingAndPayment({
          patientId: user.id, 
          physiotherapistId: therapist.id,
          clinicId: therapist.clinics?.[0]?.id || 1, 
          appointmentTime: selectedSlot,
          totalAmount: priceNumber,
          currency: "EUR",
          paymentMethodId: 'card',
          specialization:therapist.specialization,
        });

        if (session?.checkoutUrl) {
          window.location.href = session.checkoutUrl;
        } else {
          throw new Error("Failed to create payment session");
        }
      } catch (error) {
        console.error("Booking error:", error);
        setError(error.message || "Failed to book appointment");
      } finally {
        setLoading(false);
      }
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    setError("Something went wrong, please try again later.");
  }
}








  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setError(null);
  };

  return (
    <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-md space-y-4 w-full max-w-lg mx-auto">
      {/* Header Row */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <img
            src={therapist.image}
            alt={therapist.name}
            className="w-14 h-14 rounded-full object-cover border border-gray-200"
          />
          <div>
            <h3 className="text-lg font-bold text-gray-900">{therapist.name}</h3>
            <p className="text-sm text-emerald-600 font-medium">{therapist.specialization}</p>
            {clinic?.city && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MapPin className="w-4 h-4" />
                <span>{clinic.city}</span>
              </div>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-emerald-600 text-lg font-semibold">{therapist.price}</p>
          <p className="text-xs text-gray-400">per session</p>
        </div>
      </div>

      {/* Rating + Experience */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>
          ⭐ {therapist.rating} ({therapist.reviews} reviews)
        </span>
        <span>•</span>
        <span>{therapist.experience} years</span>
      </div>

      {/* Qualifications */}
      <div className="space-x-2 flex flex-wrap">
        {therapist.qualifications?.length ? (
          therapist.qualifications.map((q, i) => (
            <span
              key={i}
              className="bg-emerald-50 text-emerald-600 text-xs font-medium px-2 py-1 rounded-full"
            >
              {q}
            </span>
          ))
        ) : (
          <span className="bg-emerald-50 text-emerald-600 text-xs font-medium px-2 py-1 rounded-full">
            BSc Physiotherapy, Sports Massage Specialist
          </span>
        )}
      </div>

      {/* Available Slots */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-1">Available Slots</p>
        <div className="flex flex-wrap gap-2">
          {(therapist.availableSlots || ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"]).map((slot, i) => (
            <button
              key={i}
              onClick={() => handleSlotSelect(slot)}
              className={`border text-sm px-3 py-1 rounded-md ${
                selectedSlot === slot 
                  ? 'bg-emerald-500 text-white border-emerald-500' 
                  : 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
              }`}
              type="button"
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={handleBook}
          disabled={loading || isPending}
          className={`flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2 rounded-md ${
            (loading || isPending) ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {loading || isPending ? "Processing..." : "Book Appointment"}
        </button>

        {therapist.phone && (
          <a
            href={`tel:${therapist.phone}`}
            className="border border-emerald-500 text-emerald-500 p-2 rounded-md hover:bg-emerald-50"
            title={`Call ${therapist.name}`}
          >
            <Phone size={18} />
          </a>
        )}

        {therapist.email && (
          <a
            href={`mailto:${therapist.email}`}
            className="border border-emerald-500 text-emerald-500 p-2 rounded-md hover:bg-emerald-50"
            title={`Email ${therapist.name}`}
          >
            <Mail size={18} />
          </a>
        )}
      </div>
    </div>
  );
}