### Alexandria — Library Management System

Alexandria is a small full‑stack library management system built for evaluation purposes. It demonstrates a modern Rails 8 JSON API with JWT authentication and a React + Vite frontend.

- Backend: Ruby on Rails 8 (API‑only), Devise + JWT, CanCanCan, Pagy, PostgreSQL 16
- Frontend: React 18, Vite, styled‑components, React Router

### Features

- **Authentication (JWT)**: sign up, sign in, sign out
- **Roles**: `member` and `librarian` with fine‑grained authorization (CanCanCan)
- **Books**: CRUD (librarian), searchable and paginated list (all users)
- **Borrows**: members can borrow when copies are available; librarians can manage and mark returns
- **Dashboards**: member view (active/overdue borrows) and librarian metrics view

### Requirements

Choose one of the following setups.

- **Using Docker (recommended)**
  - Docker Desktop 4.x+
  - Docker Compose v2

- **Running locally (without Docker)**
  - Ruby 3.3 (and Bundler)
  - Node.js 20 + npm
  - PostgreSQL 16

### Quickstart with Docker

1) From the project root, start the stack:

```bash
docker compose up --build
```

This will:
- Start PostgreSQL on port 5432
- Start the Rails API on `http://localhost:3000`
- Start the React app on `http://localhost:5173`

2) Seed sample data (run in another terminal):

```bash
docker compose exec backend bash -lc "bundle exec rails db:seed"
```

3) Test the API is up:

```bash
curl -s http://localhost:3000/up | cat
```

Notes:
- If you don’t have a Rails master key, ensure the API can boot by exporting secrets before `docker compose up`, for example:

```bash
export SECRET_KEY_BASE=$(ruby -rsecurerandom -e 'puts SecureRandom.hex(64)')
export DEVISE_JWT_SECRET_KEY=$(ruby -rsecurerandom -e 'puts SecureRandom.hex(64)')
docker compose up --build
```

Alternatively, set these in your shell env before running Compose. The app’s JWT config prefers `DEVISE_JWT_SECRET_KEY`. If unset, it attempts to read `secret_key_base` from Rails credentials.

### Running locally (without Docker)

1) Backend (Rails API)

```bash
cd backend
bundle install

# Configure environment (if you don’t have config/master.key)
export SECRET_KEY_BASE=$(ruby -rsecurerandom -e 'puts SecureRandom.hex(64)')
export DEVISE_JWT_SECRET_KEY=$(ruby -rsecurerandom -e 'puts SecureRandom.hex(64)')

# Database (ensure Postgres is running and accessible)
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/app_development
bundle exec rails db:prepare
bundle exec rails db:seed

# Run server
bundle exec rails s
```

API will be available at `http://localhost:3000`.

2) Frontend (React)

```bash
cd frontend
npm install

# Configure API base URL
echo "VITE_API_BASE=http://localhost:3000" > .env

npm run dev
```

Frontend will be available at `http://localhost:5173`.

### Default seed data

- Librarian user: `librarian@example.com` / `password`
- 50 random books across common genres

### Testing

Run the backend test suite (RSpec):

```bash
docker compose exec backend bash -lc "bundle exec rspec"  # with Docker
# or locally
cd backend && bundle exec rspec
```

### Authentication and headers

- All API endpoints are JSON. Use headers:
  - `Content-Type: application/json`
  - `Accept: application/json`
  - `Authorization: Bearer <JWT>` for authenticated endpoints
- A token is returned by sign up and sign in.

### API reference and cURL examples

See the complete endpoint reference with ready‑to‑run cURL snippets in [`docs/API.md`](docs/API.md).

### Architecture notes

- Authorization is defined in `backend/app/models/ability.rb`.
- Full‑text search for books uses a PostgreSQL tsvector column (`search_vector`) and `plainto_tsquery`.
- Pagination is handled by Pagy; responses include `meta` with page info.
- CORS is configured via `config/initializers/cors.rb` and can be scoped with `CORS_ORIGINS`.

### Project structure

- `backend/` Rails 8 API (Devise JWT, CanCanCan, Pagy)
- `frontend/` React 18 + Vite app
- `docs/` Additional documentation

### Troubleshooting

- Postgres connection errors: verify `DATABASE_URL` and that the DB is running.
- 401 Unauthorized: ensure `Authorization: Bearer <token>` header is set.
- 403 Forbidden: your role may not permit the action; log in as a librarian for admin endpoints.
- Credentials: if you don’t have `config/master.key`, set `SECRET_KEY_BASE` and `DEVISE_JWT_SECRET_KEY` in your environment.

