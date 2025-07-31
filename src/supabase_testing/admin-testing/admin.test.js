///admin.test.js
import "dotenv/config";
import {
  supabase,
  supabaseUrl,
  supabaseAnonKey,
} from "../../supabase/supabaseClient.js";
import { createClient } from "@supabase/supabase-js";

export async function testAdmin() {
  // Sign in admin user
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: process.env.TEST_ADMIN,
      password: process.env.TEST_ADMIN_PASSWORD,
    });
  if (signInError) throw signInError;

  const token = signInData.session.access_token;
  console.log("Admin token:", token);

  // Create client with admin token
  const adminClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  // Query all user profiles (should bypass RLS if admin policies allow)
  const { data, error } = await adminClient.from("user_profiles").select("*");
  console.log("Admin sees:", data, error);
}

testAdmin().catch(console.error);
