import { supabase } from "../../../supabase/supabaseClient";
import { ApiError } from "../../errors";

export async function monthExistsBackend(monthStartISO) {
  // This function checks if the month of reservation availability is already seeded
  const { data, error } = await supabase.rpc("month_availability_exists", {
    p_month: monthStartISO,
  });
  if (error)
    throw new ApiError("monthExistsBackend failed", {
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

export async function getMonthlyMetricsBackend(monthStartISO) {
  // console.log('getMonthlyMetricsBackend called with monthStartISO:', monthStartISO);
  // console.log('getNextMonth result:', getNextMonth(monthStartISO));
  
  const { data, error } = await supabase
    .from("reservation_availability")
    .select("available_date, current_capacity, reservation_slot_id")
    .gte("available_date", monthStartISO)
    .lt("available_date", getNextMonth(monthStartISO));

  // console.log('Supabase query result - data:', data);
  // console.log('Supabase query result - error:', error);

  if (error)
    throw new ApiError("getMonthlyMetrics failed", {
      code: error.code,
      details: error,
    });
  
  // Now fetch the max_capacity for each slot
  const enrichedData = await Promise.all(
    (data || []).map(async (item) => {
      const { data: slotData } = await supabase
        .from("reservation_slots")
        .select("max_capacity")
        .eq("id", item.reservation_slot_id)
        .single();
      
      return {
        ...item,
        max_capacity: slotData?.max_capacity || 100
      };
    })
  );
  
  // console.log('getMonthlyMetricsBackend data:', enrichedData);
  return enrichedData;
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
      customer:customer_id(name),
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

export async function getDailyScheduleBackend(dateISO) {
  const { data, error } = await supabase.rpc("get_daily_schedule", {
    p_date: dateISO,
  });



  if (error) {
    throw new ApiError("getDailySchedule failed", {
      code: error.code,
      details: error,
    });
  }
  // The data is already in a great JSON format, so we can return it directly.
  return data;
}

function getNextMonth(monthISO) {
  const date = new Date(monthISO);
  // Get the year and month, then create a new date for the first day of next month
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed (0=Jan, 1=Feb, etc.)
  const nextMonth = new Date(year, month + 2, 1);
  return nextMonth.toISOString().slice(0, 10);
}
