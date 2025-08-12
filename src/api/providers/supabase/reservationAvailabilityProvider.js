import { supabase } from '../../../supabase/supabaseClient';
import { ApiError } from '../../errors';

export async function monthExistsBackend(monthStartISO) {
  const { data, error } = await supabase
    .rpc('month_availability_exists', { p_month: monthStartISO });
  if (error) throw new ApiError('monthAvailabilityExists failed', { code: error.code, details: error });
  return Boolean(data);
}

export async function seedMonthBackend(monthStartISO) {
  const { data, error } = await supabase
    .rpc('seed_month_availability', { p_month: monthStartISO });
  if (error) throw new ApiError('seedMonthAvailability failed', { code: error.code, details: error });
  return { created: Number(data) || 0 };
}
