import { supabase } from '../../../supabase/supabaseClient';
import { ApiError } from '../../errors';

export async function createReservationTypeBackend(body) {
  // body is snake_case from the adapter: { name, description, is_active, price_per_person }
  const { data, error } = await supabase
    .from('reservation_type')
    .insert([body])
    .select('*')
    .single();

  if (error) {
    throw new ApiError('createReservationType failed', { code: error.code, details: error });
  }
  return data; // adapter will map snake_case -> camelCase for UI
}
