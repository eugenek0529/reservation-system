


import { supabase } from '../../supabase/supabaseClient';

/** Returns the current access token (JWT with role claim). */
export async function getAccessToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error('Auth session error');
  const token = data?.session?.access_token;
  if (!token) throw new Error('Missing access token');
  return token;
}