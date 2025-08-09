### Alexandria — Product Overview and User Stories

Alexandria is a lightweight library management system showcasing a modern Rails 8 JSON API with a React frontend. It supports two personas: members and librarians. Members can discover and borrow books. Librarians manage the catalog and operations.

### Personas

- Member: browses and borrows books, monitors due dates
- Librarian: administers catalog and borrowing operations; can preview the member experience

### Key Features

- Authentication (JWT) with sign up / sign in
- Role-based access (member vs librarian) with UI view-lock for members
- Books: searchable, paginated listing; CRUD by librarians
- Borrowing: enforce copy availability and single active borrow per user/book
- Returns: librarians can mark borrows as returned
- Dashboards:
  - Member: active and overdue borrows
  - Librarian: catalog and circulation metrics + overdue member breakdown
- (Optional) Due soon email notifications (job present; schedule as needed)

### User Stories

#### Authentication

- As a visitor, I can create an account with email and password so I can log in as a member.
  - Given I submit valid email/password, when I sign up, then I receive a JWT token and become authenticated.
  - Error cases: duplicate email, invalid password → receive validation messages.

- As a user, I can log in with email and password so I can access protected features.
  - Given valid credentials, when I log in, then I receive a JWT token and my profile, including role.
  - Error cases: invalid credentials → 401/422 with friendly message.

#### Roles and view lock

- As a librarian, I can switch between “Librarian” and “Member” view modes in the UI so I can preview member experience.
  - Toggle available in header; switching updates the dashboard view accordingly.

- As a member, I can never access the librarian dashboard so my experience is limited to allowed actions.
  - When authenticated as member, the UI locks to member mode and disables any librarian view toggle.

#### Books

- As a user, I can search the catalog so I can find books by title, author, or genre.
  - Given a query `q`, when I list books, then I receive matching results with pagination metadata.

- As a user, I can paginate results so I can browse the catalog efficiently.
  - Given `page` and `per_page`, when I list books, then I receive that page and item count in `meta`.

- As a librarian, I can create books so new catalog entries are available.
  - Given valid book fields, when I submit, then the book is created and returned with 201.
  - Members attempting to create receive 403.

- As a librarian, I can update and delete books so the catalog stays correct.
  - Given permissions, when I edit or delete a book, then the changes persist with 200/204.
  - Members attempting to edit/delete receive 403.

#### Borrowing and returns

- As a member, I can borrow a book when copies are available so I can read it.
  - Given `book_id` and availability, when I post a borrow, then I receive a created borrow with due date.
  - If no copies remain, I receive 422 with an explanatory error.

- As a member, I cannot borrow the same book twice concurrently so rules are enforced.
  - If I already have an active borrow for that book, I receive 422.

- As a librarian, I can mark a borrow as returned so the copy becomes available again.
  - Given a borrow id, when I post return, then the borrow has `returned_at` set and availability updates.
  - Members attempting to mark returns receive 403.

#### Dashboards

- As a member, I can see my active and overdue borrows so I can manage returns on time.
  - Dashboard shows active borrows, and an overdue subset where `due_at` is in the past.

- As a librarian, I can view library metrics so I understand operations.
  - Metrics include total books, total borrowed (active), books due today, and a list of members with overdue borrows.

#### Notifications (optional scheduling)

- As the system, I can email members when borrows are due soon so they can return on time.
  - A background job exists to enqueue emails for borrows due in 3 days.
  - Scheduling/worker execution should be configured in the chosen environment (e.g., cron or a queue runner).

### Non-functional and constraints

- Security: stateless JWT, HTTPS-ready proxy (Caddy)
- Authorization: CanCanCan rules prevent unauthorized operations
- Pagination: Pagy metadata returned with each list
- CORS: configurable; not required when frontend is proxied through the same origin

### Out of scope / next steps

- Persistent JWT revoke/denylist
- Admin audit logs and richer reporting
- Reservations/holds and waitlists
- Advanced search and filtering facets
- Background worker container and job scheduler in production

