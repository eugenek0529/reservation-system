import {
  monthExistsBackend,
  seedMonthBackend,
  getMonthlyMetricsBackend,
  getDailyReservationsBackend,
  getDailyScheduleBackend,
} from "./providers/supabase/reservationAvailabilityProvider";

export const ReservationAvailabilityAPI = {
  monthExists(monthStartISO) {
    return monthExistsBackend(monthStartISO);
  },

  ensureMonthAvailability(monthStartISO) {
    return seedMonthBackend(monthStartISO); // returns { created }
  },

  // Get monthly availability metrics for calendar display
  async getMonthlyMetrics(monthISO) {
    try {
      const data = await getMonthlyMetricsBackend(monthISO);
      return data;
    } catch (error) {
      throw new Error("Failed to fetch monthly metrics: " + error.message);
    }
  },

  // Get daily reservations for a specific date
  async getDailyReservations(dateISO) {
    try {
      // This function is now less useful for the timeline, but we'll keep it for now.
      const data = await getDailyReservationsBackend(dateISO);
      return data;
    } catch (error) {
      throw new Error("Failed to fetch daily reservations: " + error.message);
    }
  },

  // Get the full schedule for a day, including slots and reservations
  async getDailySchedule(dateISO) {
    try {
      return await getDailyScheduleBackend(dateISO);
    } catch (error) {
      throw new Error("Failed to fetch daily schedule: " + error.message);
    }
  },
};
