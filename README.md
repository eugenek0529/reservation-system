# 🍣 Restaurant Reservation System (not an official reservation)

A web-based reservation system built for **Sushi Yuen**, allowing customers to book dining sessions and admins to manage reservations with ease. This project is admin based logic. 

## 🔧 Tech Stack

- **Frontend**: React, Tailwind CSS
- **Authentication & DB**: Supabase, OAuth
- **DB Communication**: Facade structure to communicate with DB 

## 🧠 Features

### 🧍 Customer

- Sign up / Log in
- Browse available time slots
- Book a reservation
- View existing bookings
- Create new reservation type
- Manage useres

### 🧑‍💼 Admin

- Log in with elevated access
- Open reservation window by month
- View, update, and cancel reservations
- Modify session availability

## 📅 Reservation Rules

- **Sessions Per Day**:

  - Lunch: 12:00 PM (12 seats)
  - Dinner 1: 5:30 PM (12 seats)
  - Dinner 2: 8:00 PM (12 seats)

- **Saturday**: No lunch session (12:00 PM unavailable)

## 🗂️ Database Overview

### Tables:

- `users`: customer/admin info (via Supabase Auth)
- `reservations`: links user, session, date, and guest count
- `sessions`: fixed session times and capacities
- `reservation_types`: rules per weekday/weekend (e.g., pricing, limits)

## ✅ TODO

- [x] Set up Supabase project and tables
- [x] Basic auth + role management
- [ ] Customer booking flow
- [ ] Admin dashboard
- [ ] DB and backend logic for admin logic

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```
