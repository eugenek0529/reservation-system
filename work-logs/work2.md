# Work2: Testing User, Admin, and Reservation Scenarios

## 1. User Profile Testing

### Purpose

Validate that normal users can only:

- View their own profile.
- Update their own profile.

Admins should:

- View all user profiles.
- Have full control if needed.

### Test Steps

1. **Sign in as normal user** using email and password.
2. **Fetch user_profiles** table records → expect only self-profile visible.
3. **Update own profile row** → expect success.
4. **Try updating another user row** → expect failure.

### Expected Results

- Normal users can view and update only their own record.
- No access to other user profiles unless admin role.

---

## 2. Admin Role Testing

### Purpose

Validate that admins can:

- View all users.
- Perform unrestricted operations depending on policies.

### Test Steps

1. **Sign in as admin** using admin credentials.
2. **Fetch user_profiles** table records → expect all users visible.
3. **Perform updates** (optional) to confirm admin privileges.

### Expected Results

- Admins bypass normal user restrictions and can see all profiles.

---

## 3. Admin Reservation Management Testing

### Purpose

Verify admin capabilities for reservation-related tables:

- reservation_type
- time_slots
- reservation_slots
- reservation_availability

### Test Steps

1. **Create reservation_type** entry for testing.
2. **Create time_slot** entry.
3. **Create reservation_slot** entry linking type and time slot.
4. **Create reservation_availability** for the slot.
5. **Fetch all reservations** → confirm admin unrestricted access.
6. **Update test entries** (like description or time).
7. **Clean up** all created test data.

### Expected Results

- Admin can create, update, and fetch reservation entities without RLS restrictions.
- Cleanup removes test data successfully.

---

## Notes

- RLS policies are enforced for normal users and bypassed for admins using JWT role claim (`auth.jwt()->'app_metadata'->>'role' = 'admin'`).
- Cleanup order is critical due to foreign key dependencies:
  1. reservation_availability
  2. reservation_slots
  3. time_slots
  4. reservation_type
