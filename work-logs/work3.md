# Work3: Role-Based Route Protection

## Work Summary (2025-08-01)

Implemented 3-level role-based routing system to control access between different user types.

## 3 Levels of Protection

### Level 1: Non-Logged In Users
- Can only access landing page (`/`) with signup/login buttons
- Redirected to `/login` when trying to access protected routes

### Level 2: Regular Users (userRole = 'user')
- Can access landing page (`/`) with logout button + own profile page (`/profile`)
- Redirected to `/` when trying to access admin routes

### Level 3: Admin Users (userRole = 'admin')
- Can only access admin dashboard (`/admin`)
- Automatically redirected to `/admin` when trying to access any other route

## Implementation Strategy

### 1. AuthProvider
- Added `userRole` state to track user role from JWT claims
- Created helper function to extract role from session
- if user is not logged in, then no role is given
- Default role for logged in user is 'user' if no role specified

### 2. ProtectedRoute
- Enhanced existing component to handle role-based access control
- Added `allowedRoles` and `redirectTo` props
- Checks both authentication and role permissions

### 3. Main.jsx
- Landing page: No protection (accessible to all)
- User profile: Protected for regular users only
- Admin dashboard: Protected for admin users only
- Auth pages: No protection

### 4. Login Component
- Role-based redirection after successful login
- Admin users → `/admin`
- Regular users → `/`

### 5. LandingPage
- Admin redirect logic to prevent admin access to landing page
- Maintains admin-only access even after page refresh

## Key Features

- Admin refresh prevention (cannot stay on `/`)
- Role-based access control for all protected routes
- Persistent role management across page refreshes
- Clean separation between admin and user interfaces

## Next Steps

- Test role assignment in Supabase JWT claims
- Implement admin dashboard functionality
- Add user profile management features
