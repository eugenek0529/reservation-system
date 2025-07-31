// sp-testing/admin-reservation.test.js
import "dotenv/config";
import {
  supabase,
  supabaseUrl,
  supabaseAnonKey,
} from "../../supabase/supabaseClient.js";
import { createClient } from "@supabase/supabase-js";

function logSection(title) {
  console.log(`\n=== ${title.toUpperCase()} ===`);
}
function logResult(status, data, error) {
  if (error) {
    console.error(`❌ ${status} FAILED:`, error.message);
  } else {
    console.log(`✅ ${status} SUCCESS.`, data);
  }
}

async function signInAdmin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.TEST_ADMIN,
    password: process.env.TEST_ADMIN_PASSWORD,
  });
  if (error) throw error;
  return data.session.access_token;
}

export async function testAdminReservation() {
  logSection("Signing in as admin");
  const token = await signInAdmin();
  logResult("Admin sign in", null, null);

  const adminClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  // =======================
  // 1. Create reservation type
  logSection("Creating reservation type");
  const { data: type, error: typeErr } = await adminClient
    .from("reservation_type")
    .insert({
      name: "test-weekend-dinner",
      description: "Test special weekend dinner menu",
      price_per_person: 50,
      is_active: true,
    })
    .select();
  logResult("Create reservation type", type, typeErr);
  if (typeErr) return;

  const reservationTypeId = type[0].id;

  // 2. Create time slot
  logSection("Creating time slot");
  const { data: timeslot, error: timeslotErr } = await adminClient
    .from("time_slots")
    .insert({
      start_time: "17:30",
      end_time: "20:00",
      day_of_week: 6,
    })
    .select();
  logResult("Create time slot", timeslot, timeslotErr);
  if (timeslotErr) return;

  const timeSlotId = timeslot[0].id;

  // 3. Create reservation slot
  logSection("Creating reservation slot");
  const { data: slot, error: slotErr } = await adminClient
    .from("reservation_slots")
    .insert({
      reservation_type_id: reservationTypeId,
      time_slot_id: timeSlotId,
      max_capacity: 12,
      is_active: true,
    })
    .select();
  logResult("Create reservation slot", slot, slotErr);
  if (slotErr) return;

  const reservationSlotId = slot[0].id;

  // 4. Create one reservation availability
  logSection("Creating one reservation availability");
  const today = new Date().toISOString().split("T")[0];
  const { data: avail, error: availErr } = await adminClient
    .from("reservation_availability")
    .insert({
      reservation_slot_id: reservationSlotId,
      available_date: today,
      current_capacity: 12,
    })
    .select();
  logResult("Create one availability", avail, availErr);
  if (availErr) return;

  // 5. Fetch all reservations
  logSection("Fetching all reservations");
  const { data: allReservations, error: resErr } = await adminClient
    .from("reservations")
    .select("*");
  logResult("Fetch all reservations", allReservations, resErr);

  // =======================
  // CLEANUP
  logSection("==== Cleaning up test data ====");

  // Delete availability
  const { data: delAvail, error: delAvailErr } = await adminClient
    .from("reservation_availability")
    .delete()
    .eq("reservation_slot_id", reservationSlotId)
    .select();
  logResult("Delete reservation_availability", delAvail, delAvailErr);

  // Delete reservation slot
  const { data: delSlot, error: delSlotErr } = await adminClient
    .from("reservation_slots")
    .delete()
    .eq("id", reservationSlotId)
    .select();
  logResult("Delete reservation_slots", delSlot, delSlotErr);

  // Delete time slot
  const { data: delTimeSlot, error: delTimeSlotErr } = await adminClient
    .from("time_slots")
    .delete()
    .eq("id", timeSlotId)
    .select();
  logResult("Delete time_slots", delTimeSlot, delTimeSlotErr);

  // Delete reservation type
  const { data: delType, error: delTypeErr } = await adminClient
    .from("reservation_type")
    .delete()
    .eq("id", reservationTypeId)
    .select();
  logResult("Delete reservation_type", delType, delTypeErr);
}

// Run test
testAdminReservation().catch((e) => {
  console.error("Admin reservation tests failed:", e.message);
});
