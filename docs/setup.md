# Setup Guide

## Prerequisites

### 1. Node.js
- Version: **18 or higher** (project uses ES2020 features + top-level await types)
- Download: https://nodejs.org/en/download
- Verify: `node -v`

### 2. MongoDB
Two options — choose one:

#### Option A: MongoDB Atlas (Cloud — recommended)
1. Sign up at https://cloud.mongodb.com
2. Create a free **M0** cluster
3. Under **Database Access** → Add a user (username + password)
4. Under **Network Access** → Add your IP (or `0.0.0.0/0` for dev)
5. Click **Connect** → **Drivers** → Copy the connection string
6. Replace `<password>` and `<dbname>` in the string — use `expert-booking` as the dbname

#### Option B: MongoDB Local
1. Download: https://www.mongodb.com/try/download/community
2. Install and start the service: `mongod --dbpath /your/data/path`
3. Local URI: `mongodb://localhost:27017/expert-booking`

---

## Environment Variables

### Server (`server/.env`)
Create the file `server/.env` with the following:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/expert-booking
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
Create the file `client/.env` with the following:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Installation

From the **project root**:

```bash
npm run install:all
```

This installs dependencies for root + server + client in one command.

---

## Seed the Database

Populate experts and time slots (run once after MongoDB is connected):

```bash
npm run seed
```

---

## Running in Development

From the **project root**:

```bash
npm run dev
```

This starts both server (port 5000) and client (port 5173) concurrently.

| Service | URL |
|---|---|
| API | http://localhost:5000/api |
| Client | http://localhost:5173 |
| Health check | http://localhost:5000/health |
