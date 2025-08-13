import { ApiError } from "./errors";
import { toBackend, fromBackend } from "./adapters/reservationTypeAdapter";
import { createReservationTypeBackend } from "./providers/http/reservationTypeProvider";
import {
  listReservationTypesBackend,
  deleteReservationTypeBackend,
  createReservationTypeWithScheduleBackend,
} from "./providers/supabase/reservationTypeProvider";

/**
 * Facade — the only function your UI should call.
 * Validates, adapts, calls provider, adapts response back.
 */
export const ReservationTypeAPI = {
  async createReservationType(formData) {
    // Basic validation
    if (!formData?.name || typeof formData.name !== "string") {
      throw new ApiError("Name is required");
    }
    // Optional defaults
    const normalized = {
      name: formData.name.trim(),
      description: formData.description?.trim() || "",
      isActive: !!formData.isActive,
      pricePerPerson: formData.pricePerPerson ?? 0,
    };

    const backendBody = toBackend(normalized);
    const res = await createReservationTypeBackend(backendBody);

    // Some backends return nothing on 204; return minimal success shape
    if (!res) return { success: true };

    // If backend returns created row, adapt it
    if (res && (res.id || res.created_at)) {
      return fromBackend(res);
    }
    return res;
  },

  async createReservationTypeWithSchedule(formData) {
    // --- Validation for the new complex form data ---
    if (!formData?.name) throw new ApiError("Name is required");
    if (!formData?.maxCapacity || formData.maxCapacity <= 0) {
      throw new ApiError("Max capacity must be a positive number");
    }
    if (!formData?.timeSlot?.startTime)
      throw new ApiError("Start time is required");
    if (!formData?.timeSlot?.endTime)
      throw new ApiError("End time is required");
    if (
      !formData?.timeSlot?.daysOfWeek ||
      formData.timeSlot.daysOfWeek.length === 0
    ) {
      throw new ApiError("At least one day of the week must be selected");
    }

    if (formData.pricePerPerson != null && formData.pricePerPerson < 0) {
      throw new ApiError("Price per person cannot be negative");
    }

    // --- Prepare parameters for the RPC call ---
    const rpcParams = {
      p_name: formData.name.trim(),
      p_description: formData.description?.trim() || "",
      p_price_per_person: formData.pricePerPerson ?? 0,
      p_is_active: !!formData.isActive,
      p_max_capacity: formData.maxCapacity,
      p_start_time: formData.timeSlot.startTime,
      p_end_time: formData.timeSlot.endTime,
      p_days_of_week: formData.timeSlot.daysOfWeek,
    };

    // Call the provider function that invokes the RPC
    return await createReservationTypeWithScheduleBackend(rpcParams);
  },

  async listReservationTypes() {
    const rows = await listReservationTypesBackend();
    return rows.map(fromBackend);
  },

  async deleteReservationType(id) {
    await deleteReservationTypeBackend(id);
    return { success: true };
  },
};
