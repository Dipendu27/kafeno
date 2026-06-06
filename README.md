# Kafeno Cafe & Bistro

Mirrored Kafeno frontend with a small Express backend for reservation, takeaway, and contact submissions.

## Run Locally

1. Install dependencies:
   `npm install`
2. Optional: copy `.env.example` to `.env` and set `ADMIN_API_KEY`.
3. Start the backend-enabled app:
   `npm run dev`

Open `http://localhost:3000/`.

## Backend

API endpoints:

- `POST /api/reservations`
- `POST /api/takeaway`
- `POST /api/contact`
- `GET /api/health`
- `GET /api/admin/submissions` with header `x-admin-key: <ADMIN_API_KEY>`

Submissions are stored locally in `.data/submissions.json`.

## Build

`npm run build`

Preview the built app through the same backend:

`npm run preview`
