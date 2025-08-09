### API Reference and cURL Examples

Base URL: `http://localhost:3000`

Headers for JSON requests:

```
Accept: application/json
Content-Type: application/json
Authorization: Bearer <JWT>
```

Replace `<JWT>` with the token returned by sign up or sign in.

### Health

- GET `/up`

```bash
curl -i http://localhost:3000/up
```

### Authentication

- POST `/users` — Sign up

Request:

```bash
curl -i -X POST http://localhost:3000/users \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user": {
      "email": "new@example.com",
      "password": "password",
      "password_confirmation": "password",
      "role": "member"  
    }
  }'
```

Response 201:

```
{ "user": { ... }, "token": "<JWT>" }
```

- POST `/users/sign_in` — Sign in

```bash
curl -i -X POST http://localhost:3000/users/sign_in \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "user": {
      "email": "librarian@example.com",
      "password": "password"
    }
  }'
```

Response 200:

```
{ "user": { ... }, "token": "<JWT>" }
```

- DELETE `/users/sign_out` — Sign out

```bash
curl -i -X DELETE http://localhost:3000/users/sign_out \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <JWT>'
```

Response 204 No Content

### Books

All book endpoints require authentication.

- GET `/books` — List (search + pagination)

Query params:
- `q`: search query (optional)
- `page`: page number (optional)
- `per_page`: items per page (optional)

```bash
curl -s "http://localhost:3000/books?q=clean&page=1&per_page=5" \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <JWT>' | jq
```

Response 200:

```
{ "data": [ { ...book }, ... ], "meta": { "page": 1, "pages": N, "vars": { "items": 5 } } }
```

- GET `/books/:id` — Show

```bash
curl -s http://localhost:3000/books/1 \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <JWT>' | jq
```

- POST `/books` — Create (librarian only)

```bash
curl -i -X POST http://localhost:3000/books \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <JWT>' \
  -d '{
    "book": {
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "genre": "Nonfiction",
      "isbn": "9780132350884",
      "total_copies": 5,
      "description": "A Handbook of Agile Software Craftsmanship."
    }
  }'
```

- PATCH `/books/:id` — Update (librarian only)

```bash
curl -i -X PATCH http://localhost:3000/books/1 \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <JWT>' \
  -d '{ "book": { "title": "New Title" } }'
```

- DELETE `/books/:id` — Destroy (librarian only)

```bash
curl -i -X DELETE http://localhost:3000/books/1 \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <JWT>'
```

### Borrows

All borrow endpoints require authentication.

- GET `/borrows` — List borrows
  - Members: returns only their borrows
  - Librarians: returns all borrows; filter by `user_id` when provided

```bash
curl -s "http://localhost:3000/borrows" \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <JWT>' | jq

curl -s "http://localhost:3000/borrows?user_id=123" \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <JWT>' | jq  # librarian
```

- POST `/borrows` — Create borrow (member)

```bash
curl -i -X POST http://localhost:3000/borrows \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <JWT>' \
  -d '{ "book_id": 1 }'
```

Responses:
- 201 Created with borrow payload
- 422 Unprocessable Entity if already borrowed or no copies available

- POST `/borrows/:id/return_book` — Mark as returned (librarian)

```bash
curl -i -X POST http://localhost:3000/borrows/1/return_book \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <JWT>'
```

### Dashboard

- GET `/dashboard` — Member view by default; if the requester is librarian, returns member‑style summary unless forced

```bash
curl -s http://localhost:3000/dashboard \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <JWT>' | jq
```

- GET `/dashboard?librarian=true` — Force librarian dashboard (only effective for librarian role)

```bash
curl -s "http://localhost:3000/dashboard?librarian=true" \
  -H 'Accept: application/json' \
  -H 'Authorization: Bearer <JWT>' | jq
```

Librarian response example fields: `total_books`, `total_borrowed_books`, `books_due_today`, `overdue_members`.

### Error formats

- 401 Unauthorized: missing/invalid token
- 403 Forbidden: not permitted by role/ability
- 422 Unprocessable Entity: validation/business rule errors in the shape `{ "errors": ["message", ...] }` or `{ "errors": [ ... ] }` for model errors

