/**
 * Transforms raw reservation data from Supabase into the shape
 * the admin UI components expect.
 */
export function fromBackend(reservation) {
  if (!reservation) return null;

  return {
    id: reservation.id,
    guestName: reservation.user_profile?.name || "Unknown",
    guestCount: reservation.guest_count || 0,
    note: reservation.special_requirements || "",
    reservationTime:
      reservation.reservation_availability?.reservation_slot?.time_slot
        ?.start_time || "",
    status: reservation.status || "pending",
    reservationType: "Unknown", // This can be enhanced later if needed
  };
}

/**
 * (Optional) Transforms frontend data to the format Supabase expects.
 * Not needed for reads, but useful for creates/updates.
 */
export function toBackend(data) {}
