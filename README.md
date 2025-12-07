# Vehicle Rental System

Backend API for vehicle rentals with user authentication and booking management.

**Live URL:** `https://your-deployment-url.com`

## Features

- User signup/login with JWT tokens
- Admin and customer roles
- Vehicle CRUD operations
- Booking system with price calculation
- Automatic availability tracking

## Tech Stack

Node.js, TypeScript, Express, PostgreSQL, JWT, bcrypt

## Setup

Clone the repo:
```bash
git clone https://github.com/NafisRaihan/B6A2Assignment.git
cd B6A2Assignment
npm install
```

Create database:
```bash
psql -U postgres
CREATE DATABASE vehicle_rental;
\q
psql -U postgres -d vehicle_rental -f database/schema.sql
```

Add `.env` file:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=vehicle_rental
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=10
```

Run the app:
```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Routes

**Auth**
- POST `/api/v1/auth/signup` - Register
- POST `/api/v1/auth/signin` - Login

**Vehicles**
- POST `/api/v1/vehicles` - Add vehicle (Admin)
- GET `/api/v1/vehicles` - View all
- GET `/api/v1/vehicles/:id` - View one
- PUT `/api/v1/vehicles/:id` - Update (Admin)
- DELETE `/api/v1/vehicles/:id` - Delete (Admin)

**Users**
- GET `/api/v1/users` - View all (Admin)
- PUT `/api/v1/users/:id` - Update profile
- DELETE `/api/v1/users/:id` - Delete (Admin)

**Bookings**
- POST `/api/v1/bookings` - Create booking
- GET `/api/v1/bookings` - View bookings
- PUT `/api/v1/bookings/:id` - Update status

## Auth

Add token to protected routes:
```
Authorization: Bearer <token>
```

## Project Structure

```
src/
├── config/          # Database & config
├── middleware/      # Auth middleware
├── modules/         # Features (auth, users, vehicles, bookings)
├── types/           # TypeScript types
├── utils/           # Helper functions
└── server.ts        # Entry point
```
