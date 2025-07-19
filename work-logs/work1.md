# Work 1 file is related to user authentication

# Work Summary (2025-07-17)

- Created the sign-in UI.
- Set up initial router and AuthContext.
- Researched authentication processes.

- Using React 19.1.0 & tailwind/vite

## Next Steps

- Implement protected routes.
- Configure AuthProvider with Supabase.
- Build the sign-up UI.

# Work Summary (2025-07-18)

- setup supabase and google cloud console for auth
- @supabase/supabase-js installed for supabase
- Updated AuthProvider with Supabase integration.
- Implemented signup UI (collects name, phone, email, password, confirm password).
- Added header conditional rendering for login/logout based on auth state.
- Tested OAuth (Google) authentication.
- Implemented protected routes.

- When building large component:
  - on top, comments what sub-component that large component has
  - implement the sub-comps under the main comp

## Next Steps

- Connect signup form to Supabase to store name and phone in the database after signup.
- Add error and success feedback for authentication actions.
- Implement the landing page.
- Start backend structure.

# Work Summary (2025-07-19)

- Integrated **Google OAuth** using Supabase Auth.
- Extended user onboarding to also create a corresponding record in the `user_profiles` table.
- Attempted to populate profile data (e.g., `name`, `email`, `phone`) upon user login.
- Set up `getSessionAndInsertProfile()` logic to insert new profile records based on authenticated user session data.

## 🐛 Issues Faced & 🔧 Solutions

### 1. `406 Not Acceptable` on Supabase `GET` Request

- **Problem:** Fetching from `user_profiles` returned a `406 Not Acceptable`.
- **Root Cause:** Table likely missing a **primary key** or no RLS `SELECT` policy.
- **Solution:**
  - Set `id` as the **primary key** in `user_profiles`.
  - Enabled **Row Level Security**.
  - Added `SELECT` policy:
    ```sql
    CREATE POLICY "Allow SELECT for authenticated users"
    ON user_profiles FOR SELECT
    TO authenticated
    USING (true);
    ```

---

### 2. `400 Bad Request` on `INSERT`

- **Problem:** Inserting into `user_profiles` failed with `Could not find the 'email' column...`.
- **Root Cause:** Tried inserting a field (`email`) that **doesn't exist** in the schema.
- **Solution:**
  - Added missing columns (like `email`) to the `user_profiles` table:
    ```sql
    ALTER TABLE user_profiles ADD COLUMN email text;
    ```
  - Matched insert fields with actual schema.

---

### 3. `insertError is not defined`

- **Problem:** Runtime JS error due to referencing an undefined variable.
- **Solution:**

  - Corrected `insertError` to be defined properly from the `insert()` call response:
    ```js
    const { error: insertError } = await supabase.from('user_profiles').insert(...);
    ```

  ## Next steps

- Populate the profile with only available fields (e.g., use `user.user_metadata.full_name`, skip phone if missing).
- Implement a check: only insert profile if it **doesn't already exist**.
- Add `UPDATE` support if profile already exists but missing data.
- Add UI feedback: show loading or error messages during profile creation.
- Secure sensitive logic by eventually moving it to a **custom Supabase Function or backend server**.
