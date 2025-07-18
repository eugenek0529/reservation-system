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

- When building large component:
  - on top, comments what sub-component that large component has
  - implement the sub-comps under the main comp

## Next Steps

- Implement protected routes.
- Connect signup form to Supabase to store name and phone in the database after signup.
- Add error and success feedback for authentication actions.
- Implement the landing page.
- Start backend structure.
