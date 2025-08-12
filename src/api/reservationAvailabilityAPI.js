import { monthExistsBackend, seedMonthBackend } from './providers/supabase/reservationAvailabilityProvider';

export const ReservationAvailabilityAPI = {
  monthExists(monthStartISO) {
    return monthExistsBackend(monthStartISO);
  },
  ensureMonthAvailability(monthStartISO) {
    return seedMonthBackend(monthStartISO); // returns { created }
    
  },

  
};
