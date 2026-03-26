# Argus

A visual builder for Gherkin/BDD feature files. Create, edit, and export `.feature` files through a drag-and-drop interface with step autocomplete and real-time Gherkin preview.

## Features

- **Drag-and-drop step builder** — drag keyword chips (Given/When/Then) into scenarios, reorder with drag-and-drop
- **Step autocomplete** — full-text search across existing steps for reuse across scenarios
- **Real-time Gherkin preview** — see formatted `.feature` output as you build
- **Export** — download features as `.feature` files ready for Cucumber or any BDD framework
- **And/But keyword aliasing** — And/But steps automatically inherit the preceding keyword type

## Tech Stack

| Layer    | Technology                                          |
|----------|-----------------------------------------------------|
| Frontend | React 19, TypeScript, Vite, TanStack Query, dnd-kit |
| Backend  | Spring Boot 3.4, Java 21, Spring Data JPA, Flyway   |
| Database | PostgreSQL 17 (pg_trgm for text search)              |
| Infra    | Docker, Nginx, Docker Compose                        |

## Project Structure

```
argus/
├── backend/                # Spring Boot REST API
│   ├── src/main/java/com/argus/
│   │   ├── controller/     # REST endpoints
│   │   ├── service/        # Business logic + Gherkin export
│   │   ├── entity/         # JPA entities (Feature, Scenario, StepDefinition, ScenarioStep)
│   │   ├── repository/     # Data access
│   │   ├── dto/            # Request/response objects
│   │   └── mapper/         # Entity ↔ DTO conversion
│   └── src/main/resources/
│       └── db/migration/   # Flyway SQL migrations
├── frontend/               # React SPA
│   └── src/
│       ├── pages/          # HomePage, FeatureEditorPage
│       ├── components/     # Layout, scenario, step, and preview components
│       ├── hooks/          # React Query hooks
│       ├── api/            # Axios client
│       └── types/          # TypeScript types
├── db/
│   └── init.sql            # PostgreSQL init (pg_trgm extension)
└── docker-compose.yml
```

## Getting Started

### With Docker Compose (recommended)

```bash
docker-compose up
```

This starts:
- **Frontend** at http://localhost:3000
- **Backend** at http://localhost:8080
- **PostgreSQL** at localhost:5432

### Local Development

**Prerequisites:** Java 21, Maven, Node.js 22+, pnpm, PostgreSQL 17

**Database:**

Create a PostgreSQL database named `argus` (user: `argus`, password: `argus`) and enable the `pg_trgm` extension:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

**Backend:**

```bash
cd backend
mvn spring-boot:run
```

Runs on http://localhost:8080. Flyway applies migrations automatically on startup.

**Frontend:**

```bash
cd frontend
pnpm install
pnpm dev
```

Runs on http://localhost:5173 and proxies `/api` requests to the backend.

## API

| Method | Endpoint                    | Description              |
|--------|-----------------------------|--------------------------|
| GET    | `/api/features`             | List all features        |
| GET    | `/api/features/{id}`        | Get feature with details |
| POST   | `/api/features`             | Create feature           |
| PUT    | `/api/features/{id}`        | Update feature           |
| DELETE | `/api/features/{id}`        | Delete feature           |
| GET    | `/api/features/{id}/export` | Export as Gherkin text   |
| GET    | `/api/steps`                | List all step definitions|
| GET    | `/api/steps/search`         | Search steps (autocomplete) |

## Environment Variables

| Variable  | Default     | Description         |
|-----------|-------------|---------------------|
| `DB_HOST` | `localhost` | PostgreSQL host     |
| `DB_PORT` | `5432`      | PostgreSQL port     |
| `DB_NAME` | `argus`     | Database name       |
| `DB_USER` | `argus`     | Database user       |
| `DB_PASS` | `argus`     | Database password   |

## Testing

```bash
cd backend
mvn test
```

Runs Cucumber BDD tests defined in `backend/src/test/resources/features/`.
