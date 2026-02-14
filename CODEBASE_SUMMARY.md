# Incident Tracker — Codebase Summary

A full-stack web application for engineers to create, browse, filter, and manage production incidents. Two-tier architecture: **Spring Boot REST API** (Java 17) and **React SPA** (Vite + TypeScript).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend (React, port 5173)                                 │
│  • Incident list (paginated table, filters, search, sort)    │
│  • Incident detail (view + edit)                             │
│  • Create incident form                                      │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP /api/* (proxied by Vite)
┌──────────────────────────▼──────────────────────────────────┐
│  Backend (Spring Boot, port 8080)                            │
│  • REST controllers → Services → JPA Repository             │
│  • Validation, CORS, global exception handling               │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  H2 (file DB: ./data/incidents)                              │
│  • incidents table, indexes on status/severity/service/date  │
│  • ~200 rows seeded on first run                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Backend (`backend/`)

### Stack
- **Spring Boot 3.2**, Java 17  
- **Spring Web**, **Spring Data JPA**, **Spring Validation**  
- **H2** (embedded file database), no Lombok (plain Java)

### Source Layout

| Package / path | Purpose |
|---------------|---------|
| `IncidentTrackerApplication.java` | Boot entry point |
| `model/` | **Incident** entity (UUID id, title, service, severity, status, owner, summary, createdAt, updatedAt); enums **Severity** (SEV1–SEV4), **Status** (OPEN, MITIGATED, RESOLVED). JPA indexes on status, severity, service, createdAt. |
| `repository/IncidentRepository.java` | `JpaRepository<Incident, UUID>` + custom `@Query` for filtered list: optional search (title/service/summary/owner), status, severity, service; returns `Page<Incident>` with `Pageable` (sort, page, size). |
| `dto/` | **IncidentRequest** (create), **IncidentUpdateRequest** (update), **IncidentResponse** (read), **PageResponse&lt;T&gt;** (content, page, size, totalElements, totalPages, first, last). All with getters/setters; validation on request DTOs. |
| `service/IncidentService.java` | CRUD + list: `findAll` (delegates to repo with trimmed search/service), `findById`, `create` (default OPEN), `update`. Throws **ResourceNotFoundException** when incident not found. |
| `controller/IncidentController.java` | REST: `POST /api/incidents`, `GET /api/incidents` (page, size, sort, search, status, severity, service), `GET /api/incidents/{id}`, `PATCH /api/incidents/{id}`. CORS for `http://localhost:5173`. `@ExceptionHandler` for 404 → **ApiError** record. |
| `config/GlobalExceptionHandler.java` | `@RestControllerAdvice`: maps `MethodArgumentNotValidException` → 400 + message. |
| `config/DataSeeder.java` | `CommandLineRunner`: if table empty, inserts ~200 incidents (random title prefixes, services, severities, statuses, owners, summaries). |

### API Contract (summary)
- **POST /api/incidents** — body: IncidentRequest → 201 + IncidentResponse.  
- **GET /api/incidents** — query: `page`, `size`, `sort` (e.g. `createdAt,desc`), `search`, `status`, `severity`, `service` → 200 + PageResponse&lt;IncidentResponse&gt;.  
- **GET /api/incidents/{id}** → 200 + IncidentResponse or 404.  
- **PATCH /api/incidents/{id}** — body: IncidentUpdateRequest → 200 + IncidentResponse or 404.

### Configuration
- `application.yml`: H2 file URL, JPA `ddl-auto: create-drop`, server port 8080, Jackson dates as ISO-8601.

---

## Frontend (`frontend/`)

### Stack
- **React 18**, **TypeScript**, **Vite 5**, **React Router 6**  
- No state library (local `useState` / `useEffect`); CSS Modules for styles.

### Source Layout

| Path | Purpose |
|------|---------|
| `index.html`, `src/main.tsx`, `src/index.css` | Entry and global styles (dark theme). |
| `src/App.tsx` | **BrowserRouter**; header with “Incident Tracker” + links (Incidents, New Incident); **Routes**: `/` → list, `/incidents/new` → create, `/incidents/:id` → detail. |
| `src/types/incident.ts` | Types: **Incident**, **IncidentCreate**, **IncidentUpdate**, **PageResponse&lt;T&gt;**, **ListParams**, **Severity**, **Status**. |
| `src/api/client.ts` | Generic `request()` (fetch), **api.get/post/patch** with JSON and base `/api`. |
| `src/api/incidents.ts` | **incidentsApi**: `list(params)`, `getById(id)`, `create(body)`, `update(id, body)`; builds query string from ListParams. |
| `src/hooks/useDebounce.ts` | `useDebounce(value, delayMs)` for search input. |
| `src/pages/IncidentList.tsx` | State: page, size, sort, searchInput, status/severity/service filters. Debounced search (350 ms) → `incidentsApi.list()`. Renders: toolbar (title + “New Incident” link), filter row (search, status, severity, service, sort dropdown), error banner, **TableLoading** (skeleton) or table + **Pagination**. Table columns: title, service, severity, status, owner, created, “View” link. Sort dropdown and clickable column headers update `sort` and reset page. |
| `src/pages/IncidentDetail.tsx` | Loads incident by `id` from route; view mode (dl/dt/dd) or edit mode (form). Edit: title, service, severity, status, owner, summary; Save → PATCH, then exit edit; Cancel restores form from incident. |
| `src/pages/IncidentCreate.tsx` | Form: title, service, severity, owner, summary; submit → POST, then navigate to new incident’s detail page. |
| `src/components/Pagination.tsx` | “Showing X–Y of Z”, per-page size selector (5/10/20/50), First/Prev/Next/Last buttons. |
| `src/components/TableLoading.tsx` | Skeleton table (configurable rows/cols). |
| `src/styles/*.module.css` | Component-scoped styles: layout, forms, table, severity/status colors, responsive behavior. |

### Data Flow
- List: URL params (page, size, sort, search, filters) → `incidentsApi.list()` → set state → table + pagination.  
- Detail: `useParams().id` → `incidentsApi.getById(id)` → view or edit form → `incidentsApi.update(id, body)` on save.  
- Create: form → `incidentsApi.create(body)` → `navigate(\`/incidents/${created.id}\`)`.

### Build & Run
- **Vite** dev server on 5173; proxy `/api` → `http://localhost:8080`.  
- `npm run build`: TypeScript compile + Vite build.

---

## Data Model (shared)

| Field | Type | Notes |
|-------|------|--------|
| id | UUID | Generated by backend. |
| title | string | Required. |
| service | string | Required. |
| severity | SEV1 \| SEV2 \| SEV3 \| SEV4 | Required. |
| status | OPEN \| MITIGATED \| RESOLVED | Required on update; default OPEN on create. |
| owner | string? | Optional. |
| summary | string? | Optional. |
| createdAt | ISO-8601 | Set by backend. |
| updatedAt | ISO-8601 | Set/updated by backend. |

---

## Conventions & Practices

- **Backend:** No Lombok; plain getters/setters and constructors; DTOs for API boundary; validation on request bodies; single global exception handler for validation and 404.  
- **Frontend:** Functional components, TypeScript for API and domain types, CSS Modules, single API client with shared base URL.  
- **API:** REST, JSON, query params for list (pagination, sort, filters); CORS limited to dev frontend origin.

---

## File Count (source only)

- **Backend:** 14 Java files (1 app, 3 model, 4 dto, 1 repo, 2 service, 1 controller, 2 config).  
- **Frontend:** 18 source files (3 pages, 2 components, 2 api, 1 hook, 1 types, 9 CSS/TS/TSX).

This is the full picture of the Incident Tracker codebase as a whole.
