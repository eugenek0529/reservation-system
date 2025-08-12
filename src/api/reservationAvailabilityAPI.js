import { 
  monthExistsBackend, 
  seedMonthBackend, 
  getMonthlyMetricsBackend, 
  getDailyReservationsBackend 
} from './providers/supabase/reservationAvailabilityProvider';

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
      return data; // No adapter needed for now, return raw data
    } catch (error) {
      throw new Error('Failed to fetch monthly metrics: ' + error.message);
    }
  },

  // Get daily reservations for a specific date
  async getDailyReservations(dateISO) {
    try {
      const data = await getDailyReservationsBackend(dateISO);
      return data; // No adapter needed for now, return raw data
    } catch (error) {
      throw new Error('Failed to fetch daily reservations: ' + error.message);
    }
  }
};
