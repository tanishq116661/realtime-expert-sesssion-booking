# realtime-expert-sesssion-booking
# Real-Time Expert Session Booking

A full-stack booking platform where users can browse experts, view live slot availability, book sessions, and check their bookings by email.

## Features

- Browse experts with search, category filters, and pagination
- View detailed expert profiles and available time slots
- Book sessions with real-time slot updates using Socket.IO
- Prevent double-booking of the same expert slot
- Track bookings by customer email
- Update booking status through the backend API

## Tech Stack

- Frontend: React, Vite, React Router, Socket.IO Client
- Backend: Node.js, Express, Socket.IO
- Database: MongoDB with Mongoose

## Project Structure

```text
.
|-- backend
|   |-- config
|   |-- controllers
|   |-- middleware
|   |-- models
|   |-- routes
|   |-- seeder.js
|   `-- server.js
|-- frontend
|   |-- src
|   |   |-- components
|   |   `-- services
|   `-- vite.config.js
`-- README.md
```

## How It Works

Users can search experts by name, filter by category, and open an expert profile to see available slots. When one user books a slot, the backend emits a Socket.IO event so other connected users immediately see that slot become unavailable.

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd realtimeexpert-sessionbooking
```

### 2. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

## Environment Variables

Create `backend/.env` with:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

## Seed Sample Data

From the `backend` folder:

```bash
npm run seed
```

This inserts sample experts and their available session slots into MongoDB.

## Run the Project

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` and backend runs on `http://localhost:5000`.

## API Endpoints

### Experts

- `GET /api/experts` - List experts with optional `page`, `limit`, `search`, and `category` query params
- `GET /api/experts/:id` - Get a single expert with computed slot availability

### Bookings

- `POST /api/bookings` - Create a booking
- `GET /api/bookings?email=user@example.com` - Fetch bookings for a customer email
- `PATCH /api/bookings/:id/status` - Update booking status to `Pending`, `Confirmed`, or `Completed`

## Sample Booking Payload

```json
{
  "expertId": "EXPERT_ID",
  "customerName": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "date": "2026-05-09",
  "timeSlot": "10:00"
}
```

## Real-Time Behavior

- Clients join an expert-specific Socket.IO room
- When a slot is booked, the backend emits a `slotBooked` event
- Connected users viewing that expert see the slot marked as booked instantly

## Available Categories

- Career Coaching
- Data Science
- Startup Mentorship

## Future Improvements

- Authentication for users and experts
- Admin dashboard for managing experts and bookings
- Payment integration
- Calendar sync and reminders
- Booking cancellation and rescheduling

## Author

Built as a real-time full-stack session booking project using React, Express, MongoDB, and Socket.IO.
