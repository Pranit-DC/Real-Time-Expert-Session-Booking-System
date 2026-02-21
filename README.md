<div align="center">

```
  ______                     __  ____              __  
 / ____/  _  ______  ___  __/ /_/ __ )____  ____  / /__
/ __/ | |/_/ __ \ \/ / '_ \ __/ __  / __ \/ __ \/ //_/
/ /___>  </ /_/ />  </ /_/ / /_/ /_/ / /_/ / /_/ / ,<  
\____/_/|_/ .___/_/\_\ .__/\__/_____/\____/\____/_/|_| 
         /_/         /_/                                
```

### Book one-on-one sessions with tech experts

<br/>

[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-235a97?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47a248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)

<br/>

**[Features](#features)** · **[Tech Stack](#tech-stack)** · **[Architecture](#architecture)** · **[Quick Start](#quick-start)** · **[API Reference](#api-reference)**

</div>

<br/>

---

<br/>

## Overview

ExpertBook is a full-stack platform for discovering tech experts and booking real-time one-on-one sessions with them. It supports category filtering, availability-based slot selection, and booking management — all wrapped in a polished, accessible UI with dark mode support.

<table>
<tr>
<td width="60%">

**Key Highlights**

- Real-time slot availability per expert
- Category and search-based expert discovery
- Booking lookup by email with status tracking
- Animated dark / light theme with circle reveal transition
- Floating frosted-glass navbar
- Skeleton loading, page transitions, micro-interactions

</td>
<td width="40%">

**Deployment**

| Layer | Platform |
|-------|----------|
| Frontend | Vercel |
| Backend | Railway |
| Database | MongoDB Atlas |

</td>
</tr>
</table>

<br/>

---

<br/>

## Features

<table>
<thead>
<tr>
<th width="33%">Discovery</th>
<th width="33%">Booking</th>
<th width="33%">UI / UX</th>
</tr>
</thead>
<tbody>
<tr>
<td>

- Search by name or expertise
- Filter by category
- Paginated expert listings
- Star ratings and experience
- Expert bio and profile

</td>
<td>

- Date and time slot selection
- Form validation with constraints
- Booking confirmation flow
- Email-based booking lookup
- Status badges (Pending / Confirmed / Completed)

</td>
<td>

- Dark and light theme
- Animated theme toggle (circle reveal)
- Floating navbar with blur
- Skeleton loading states
- Animated page transitions
- Mobile-responsive layout

</td>
</tr>
</tbody>
</table>

<br/>

---

<br/>

## Tech Stack

<table>
<tr>
<td><strong>Category</strong></td>
<td><strong>Technologies</strong></td>
</tr>
<tr>
<td>Frontend</td>
<td>

`React 19` `TypeScript` `Vite` `Tailwind CSS v4` `React Router v7`

</td>
</tr>
<tr>
<td>Data Fetching</td>
<td>

`TanStack Query v5` — server state, caching, background refetch

</td>
</tr>
<tr>
<td>Animation</td>
<td>

`Motion (Framer Motion)` — page transitions, layout animations, micro-interactions

</td>
</tr>
<tr>
<td>Backend</td>
<td>

`Node.js` `Express 5` `TypeScript` `Zod` — request validation

</td>
</tr>
<tr>
<td>Database</td>
<td>

`MongoDB` `Mongoose` — hosted on MongoDB Atlas

</td>
</tr>
</table>

<br/>

---

<br/>

## Architecture

```
                          ┌─────────────────────────────────┐
                          │          CLIENT LAYER           │
                          │   React 19  ·  Vite  ·  TypeScript│
                          │   TanStack Query  ·  Motion      │
                          └────────────────┬────────────────┘
                                           │  REST (JSON)
                                           ▼
                          ┌─────────────────────────────────┐
                          │          API LAYER              │
                          │        Express 5 + Zod          │
                          │                                 │
                          │  GET  /api/experts              │
                          │  GET  /api/experts/:id          │
                          │  POST /api/bookings             │
                          │  GET  /api/bookings?email=      │
                          └────────────────┬────────────────┘
                                           │  Mongoose ODM
                                           ▼
                          ┌─────────────────────────────────┐
                          │         DATA LAYER              │
                          │        MongoDB Atlas            │
                          │                                 │
                          │  experts   ·   bookings         │
                          └─────────────────────────────────┘
```

<br/>

---

<br/>

## Quick Start

### Prerequisites

| Requirement | Version |
|:------------|:--------|
| Node.js | 18.x or higher |
| npm | Latest |
| MongoDB | Atlas cluster or local instance |

<br/>

### Installation

```bash
# Clone the repository
git clone https://github.com/Pranit-DC/Real-Time-Expert-Session-Booking-System.git
cd Real-Time-Expert-Session-Booking-System

# Install all dependencies (root + client + server)
npm run install:all
```

<br/>

### Environment Variables

Create a `.env` file in `server/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_ORIGIN=http://localhost:5173
```

<br/>

### Development

```bash
# Run frontend and backend concurrently
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

<br/>

### Seed Database

```bash
npm run seed
```

Populates MongoDB with sample experts and availability slots.

<br/>

---

<br/>

## Project Structure

```
/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── Layout/        # Navbar, page shell
│       │   └── ui/            # Badge, Skeleton, Pagination, ThemeToggle
│       ├── hooks/             # useExperts, useBookings, useTheme
│       ├── pages/             # ExpertListing, ExpertDetail, BookingPage, MyBookings
│       ├── types/             # Shared TypeScript types
│       └── utils/             # format helpers
│
├── server/                    # Express backend
│   └── src/
│       ├── controllers/       # Route handler logic
│       ├── models/            # Mongoose schemas
│       ├── routes/            # Express routers
│       └── validators/        # Zod schemas
│
└── package.json               # Root workspace scripts
```

<br/>

---

<br/>

## API Reference

### Experts

| Method | Endpoint | Description |
|:-------|:--------:|:------------|
| `GET` | `/api/experts` | List experts — supports `page`, `category`, `search` query params |
| `GET` | `/api/experts/:id` | Get expert profile with availability slots |

### Bookings

| Method | Endpoint | Description |
|:-------|:--------:|:------------|
| `POST` | `/api/bookings` | Create a new booking |
| `GET` | `/api/bookings?email=` | Get all bookings for an email address |

<br/>

---

<br/>

## Available Scripts

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start frontend and backend concurrently |
| `npm run install:all` | Install dependencies for root, client, and server |
| `npm run seed` | Seed the database with sample data |

<br/>

---

<br/>

## License

This project is licensed under the ISC License. See [LICENSE](LICENSE) for details.

<br/>

---

<br/>

<div align="center">

**ExpertBook** — Built for engineers who want to learn from the best

<br/>

[Report Bug](https://github.com/Pranit-DC/Real-Time-Expert-Session-Booking-System/issues) · [Request Feature](https://github.com/Pranit-DC/Real-Time-Expert-Session-Booking-System/issues)

</div>
