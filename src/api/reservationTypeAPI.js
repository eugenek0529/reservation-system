import { ApiError } from './errors';
import { toBackend, fromBackend } from './adapters/reservationTypeAdapter';
import { createReservationTypeBackend } from './providers/http/reservationTypeProvider';
import { listReservationTypesBackend, deleteReservationTypeBackend } from './providers/supabase/reservationTypeProvider';

/**
 * Facade — the only function your UI should call.
 * Validates, adapts, calls provider, adapts response back.
 */
export const ReservationTypeAPI = {
  async createReservationType(formData) {
    // Basic validation
    if (!formData?.name || typeof formData.name !== 'string') {
      throw new ApiError('Name is required');
    }
    // Optional defaults
    const normalized = {
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
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

  async listReservationTypes() {
    const rows = await listReservationTypesBackend();
    return rows.map(fromBackend);
  },

  async deleteReservationType(id) {
    await deleteReservationTypeBackend(id);
    return { success: true };
  },
};
 