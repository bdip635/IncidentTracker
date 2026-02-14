# Incident Tracker – Implemented

## Backend (Spring Boot, `backend/`)

- **Entity Incident:** id (UUID), title, service, severity (SEV1–SEV4), status (OPEN/MITIGATED/RESOLVED), owner, summary, createdAt, updatedAt, with indexes on status, severity, service, createdAt.

### REST API

- **POST** `/api/incidents` – create (validation, default status OPEN).
- **GET** `/api/incidents` – list with server-side pagination (`page`, `size`), filtering (`search`, `status`, `severity`, `service`), sorting (`sort=prop,asc|desc`).
- **GET** `/api/incidents/:id` – get one.
- **PATCH** `/api/incidents/:id` – full update with validation.

- **Validation:** Jakarta validation on request DTOs; global handler returns 400 with message.
- **Seeding:** DataSeeder inserts ~200 incidents on first run (only if table is empty). H2 file DB at `./data/incidents`.
- **CORS:** Allowed origin `http://localhost:5173` for the frontend.

## Frontend (React + Vite + TypeScript, `frontend/`)

- **Paginated table:** Server-side pagination, “Showing X–Y of Z”, page size 5/10/20/50, First/Prev/Next/Last.
- **Loading:** Skeleton table while list is loading.
- **Sorting:** Dropdown (e.g. Newest first, Title A–Z) plus clickable column headers (title, service, severity, status, created) that toggle asc/desc.
- **Filters:** Status and severity dropdowns, optional service text filter.
- **Search:** Single search input with 350ms debounce, searches title, service, summary, owner on the server.
- **Detail page:** View incident; Edit toggles form; save updates via PATCH with error handling.
- **Create flow:** “New Incident” form (title, service, severity, optional owner/summary); on success, redirect to the new incident’s detail page.
- **Responsive:** Layout and table scroll on small screens; dark theme.

## How to run

**Backend (from repo root):**

```bash
cd backend && mvn spring-boot:run
```

If you don’t have Maven, install it or run: `mvn -N wrapper:wrapper` once to generate `./mvnw`, then use `./mvnw spring-boot:run`.

**Frontend:**

```bash
cd frontend && npm install && npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` to `http://localhost:8080`.

Start the backend first so the DB is created and the ~200 seed records are loaded, then use the app to list, search, filter, sort, create, and edit incidents.

If you share wireframes or want different fields/UX, we can adjust the UI and API to match.
