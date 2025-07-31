import "dotenv/config";
import {
  supabase,
  supabaseUrl,
  supabaseAnonKey,
} from "../../supabase/supabaseClient.js";
import { createClient } from "@supabase/supabase-js";

/**
 * Initialize a client for a given user email/password
 */
async function initClient(email, password) {
  const { data: signInData, error: signInError } =
    await supabase.auth.signInWithPassword({ email, password });

  if (signInError) throw signInError;

  const token = signInData.session.access_token;
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  return { client, userId: signInData.user.id };
}

/**
 * Test SELECT for the signed-in user
 */
async function testSelect(client) {
  const { data, error } = await client.from("user_profiles").select("*");
  console.log("Select result:", data, error);
}

/**
 * Test UPDATE for the signed-in user
 */
async function testUpdate(client, userId) {
  // Update own profile (change name)
  const { data: ownData, error: ownError } = await client
    .from("user_profiles")
    .update({ name: "normal user" })
    .eq("id", userId)
    .select();
  console.log("Update own row:", ownData, ownError);

  // Try updating another user's profile (should fail due to RLS)
  const { data: otherData, error: otherError } = await client
    .from("user_profiles")
    .update({ name: "Hack Attempt" })
    .neq("id", userId)
    .select();
  console.log("Update other row (should fail):", otherData, otherError);
}

async function main() {
  try {
    const { client, userId } = await initClient(
      process.env.TEST_USER1,
      process.env.TEST_USER1_PASSWORD
    );

    await testSelect(client);
    await testUpdate(client, userId);
  } catch (err) {
    console.error(err);
  }
}

main();
