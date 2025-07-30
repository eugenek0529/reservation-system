// sp-testing/userTest.js
import "dotenv/config";
import {
  supabase,
  supabaseUrl,
  supabaseAnonKey,
} from "../../supabase/supabaseClient.js";
import { createClient } from "@supabase/supabase-js";

export async function testUser() {
  // Sign in normal user
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({
      email: process.env.TEST_USER1,
      password: process.env.TEST_USER1_PASSWORD,
    });
  if (signInError) throw signInError;

  const token = signInData.session.access_token;
  console.log("User token:", token);

  // Create client with user token
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await userClient.from("user_profiles").select("*");
  console.log("Normal user sees:", data, error);
}

testUser().catch(console.error);
