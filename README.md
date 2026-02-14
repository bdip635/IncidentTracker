# Incident Tracker

Full-stack web app for creating, browsing, and managing production incidents. Built with **React (Vite + TypeScript)** and **Spring Boot (Java 17)**.

## Features

- **Create incidents** with validation (title, service, severity; optional owner/summary)
- **Paginated table** with server-side pagination (configurable page size)
- **Search, filter, sort** — debounced search; filters for status, severity, service; column sorting
- **View & edit** incident details and update status
- **Seed data** — ~200 incidents on first backend run (H2)

## Tech Stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, Vite, TypeScript, React Router |
| Backend  | Spring Boot 3.2, Java 17, Spring Data JPA, H2 |
| API      | REST (JSON), validation, indexed queries |

## Quick Start

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

API: `http://localhost:8080`. H2 console (optional): `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/incidents`).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173`. Vite proxies `/api` to the backend.

### Run both

1. Start the backend first (so the DB is created and seeded).
2. Start the frontend and open http://localhost:5173.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/incidents` | Create incident |
| GET    | `/api/incidents` | List with `page`, `size`, `sort`, `search`, `status`, `severity`, `service` |
| GET    | `/api/incidents/:id` | Get one |
| PATCH  | `/api/incidents/:id` | Update (full payload) |

Sort: `sort=createdAt,desc` or `sort=title,asc`, etc.

## Data Model

- **id** (UUID), **title**, **service**, **severity** (SEV1–SEV4), **status** (OPEN / MITIGATED / RESOLVED), **owner** (optional), **summary** (optional), **createdAt**, **updatedAt**

## Project Layout

```
IncidentTracker/
├── backend/          # Spring Boot API
├── frontend/         # React SPA
└── README.md
```
