import { supabase } from "../../../supabase/supabaseClient";
import { ApiError } from "../../errors";

export async function monthExistsBackend(monthStartISO) {
  const { data, error } = await supabase.rpc("month_availability_exists", {
    p_month: monthStartISO,
  });
  if (error)
    throw new ApiError("monthAvailabilityExists failed", {
      code: error.code,
      details: error,
    });
  return Boolean(data);
}

export async function seedMonthBackend(monthStartISO) {
  const { data, error } = await supabase.rpc("seed_month_availability", {
    p_month: monthStartISO,
  });
  if (error)
    throw new ApiError("seedMonthAvailability failed", {
      code: error.code,
      details: error,
    });
  return { created: Number(data) || 0 };
}

export async function getMonthlyMetricsBackend(monthISO) {
  const { data, error } = await supabase
    .from("reservation_availability")
    .select(
      `
      available_date,
      current_capacity,
      pending,
      reservation_slot:reservation_slot_id(max_capacity)
    `
    )
    .gte("available_date", monthISO)
    .lt("available_date", getNextMonth(monthISO))
    .eq("reservation_slot.is_active", true);

  if (error)
    throw new ApiError("getMonthlyMetrics failed", {
      code: error.code,
      details: error,
    });
  return data;
}

export async function getDailyReservationsBackend(dateISO) {
  // Get reservations for the specific date with all the data we need
  const { data, error } = await supabase
    .from("reservations")
    .select(
      `
      id,
      guest_count,
      special_requirements,
      status,
      user_profile:user_id(name),
      reservation_availability:reservation_availability_id(
        available_date,
        reservation_slot:reservation_slot_id(
          max_capacity,
          time_slot:time_slot_id(start_time)
        )
      )
    `
    )
    .eq("reservation_availability.available_date", dateISO);

  if (error)
    throw new ApiError("getDailyReservations failed", {
      code: error.code,
      details: error,
    });
  return data || [];
}

function getNextMonth(monthISO) {
  const date = new Date(monthISO);
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
}
