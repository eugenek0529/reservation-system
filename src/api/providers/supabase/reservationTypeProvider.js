import { supabase } from "../../../supabase/supabaseClient";
import { ApiError } from "../../errors";

export async function listReservationTypesBackend() {
  const { data, error } = await supabase
    .from("reservation_type")
    .select("*")
    .order("created_at", { ascending: false });
  if (error)
    throw new ApiError("listReservationTypes failed", {
      code: error.code,
      details: error,
    });
  return data;
}

export async function deleteReservationTypeBackend(id) {
  const { error } = await supabase
    .from("reservation_type")
    .delete()
    .eq("id", id);
  if (error)
    throw new ApiError("deleteReservationType failed", {
      code: error.code,
      details: error,
    });
  return { success: true };
}

export async function createReservationTypeWithScheduleBackend(params) {
  const { error } = await supabase.rpc(
    "create_reservation_type_with_schedule",
    params
  );

  if (error) {
    // You can add more specific error handling here if needed
    throw new ApiError("Failed to create reservation type with schedule", {
      code: error.code,
      details: error,
    });
  }

  return { success: true };
}
