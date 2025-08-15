import {
  monthExistsBackend,
  seedMonthBackend,
  getMonthlyMetricsBackend,
  getDailyReservationsBackend,
  getDailyScheduleBackend,
} from "./providers/supabase/reservationAvailabilityProvider";
import { supabase } from "../supabase/supabaseClient";

export const ReservationAvailabilityAPI = {
  monthExists(monthStartISO) {
    return monthExistsBackend(monthStartISO);
  },

  ensureMonthAvailability(monthStartISO) {
    return seedMonthBackend(monthStartISO); // returns { created }
  },

  // Get monthly availability metrics for calendar display
  async getMonthlyMetrics(monthStartISO) {
    try {
      const data = await getMonthlyMetricsBackend(monthStartISO);
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

  // Get available slots for a specific date
  async getAvailableSlots(dateISO) {
    try {
      const { data, error } = await supabase
        .from("reservation_availability")
        .select(`
          id,
          available_date,
          current_capacity,
          pending,
          reservation_slot:reservation_slot_id(
            id,
            max_capacity,
            is_active,
            reservation_type:reservation_type_id(
              name
            ),
            time_slot:time_slot_id(
              start_time
            )
          )
        `)
        .eq("available_date", dateISO)
        .eq("reservation_slot.is_active", true);

      if (error) throw error;

      return (data || []).map(item => ({
        id: item.id,
        reservation_slot_id: item.reservation_slot.id,
        startTime: item.reservation_slot.time_slot.start_time,
        reservationTypeName: item.reservation_slot.reservation_type.name,
        max_capacity: item.reservation_slot.max_capacity,
        current_capacity: item.current_capacity,
        available_capacity: item.reservation_slot.max_capacity - item.current_capacity
      }));
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      throw error;
    }
  },

  // Create a new reservation by the admin
  async createReservation(reservationData) {
    try {
      // 1. First create or find the customer
      let customerId;
      
      if (reservationData.customerEmail || reservationData.customerPhone) {
        // Check if customer already exists
        const { data: existingCustomer } = await supabase
          .from("customers")
          .select("id")
          .or(`email.eq.${reservationData.customerEmail},phone.eq.${reservationData.customerPhone}`)
          .single();

        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          // Create new customer
          const { data: newCustomer, error: customerError } = await supabase
            .from("customers")
            .insert({
              name: reservationData.customerName,
              email: reservationData.customerEmail,
              phone: reservationData.customerPhone
            })
            .select("id")
            .single();

          if (customerError) {
            throw new Error(`Failed to create customer: ${customerError.message}`);
          }
          customerId = newCustomer.id;
        }
      }

      // 2. Check if reservation_availability exists for the selected date and slot
      const { data: availability, error: availabilityError } = await supabase
        .from("reservation_availability")
        .select(`
          id,
          current_capacity,
          reservation_slot:reservation_slot_id(
            max_capacity,
            is_active
          )
        `)
        .eq("available_date", reservationData.date)
        .eq("reservation_slot_id", reservationData.reservationSlotId)
        .single();

      if (availabilityError || !availability) {
        throw new Error('No availability found for this date and slot');
      }

      if (!availability.reservation_slot.is_active) {
        throw new Error('This reservation slot is not active');
      }

      // 3. Validate guest count against available capacity
      const maxCapacity = availability.reservation_slot.max_capacity;
      const currentReserved = availability.current_capacity;
      const availableCapacity = maxCapacity - currentReserved;

      if (reservationData.guests > availableCapacity) {
        throw new Error(`Only ${availableCapacity} seats available (max: ${maxCapacity}, currently reserved: ${currentReserved})`);
      }

      // 4. Create the reservation
      const { data: newReservation, error: reservationError } = await supabase
        .from("reservations")
        .insert({
          user_id: reservationData.adminUserId, // Admin ID who created it
          customer_id: customerId, // Customer ID (can be NULL)
          guest_count: reservationData.guests,
          status: reservationData.status || "reserved",
          special_requirements: reservationData.specialRequirements || "",
          reservation_availability_id: availability.id
        })
        .select()
        .single();

      if (reservationError) {
        throw new Error(`Failed to create reservation: ${reservationError.message}`);
      }

      // 5. Database triggers will automatically update current_capacity
      console.log(`Reservation created successfully: ${reservationData.guests} guests for ${reservationData.date}`);
      
      return newReservation;
    } catch (error) {
      console.error('Reservation creation failed:', error);
      throw error;
    }
  },
};
