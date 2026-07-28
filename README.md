# OMERO GYM — Full-Stack (Node.js + Express + MySQL)

A gym booking web app with real user accounts and a MySQL database.

- **Frontend:** static multi-page site in `public/` (HTML + CSS + one `app.js`)
- **Backend:** Node.js + Express JSON API (`server/`)
- **Database:** MySQL (schema + seed in `schema.sql`)
- **Auth:** passwords hashed with **bcrypt**, sessions via **JWT**

## Project structure

```
public/            frontend (served by the API server)
  login.html  register.html  classes.html  book.html  workouts.html
  common.css  + one css per page
  app.js            all frontend logic (calls the API)
server/
  server.js         Express app: API routes + serves /public
  db.js             MySQL connection pool + auto-creates schema on startup
schema.sql          database + tables + seed data
package.json        backend dependencies & scripts
.env.example        copy to .env and fill in your MySQL credentials
```

## Prerequisites

- **Node.js 18+**
- **MySQL 8** (or MariaDB) running locally

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create your environment file** — copy `.env.example` to `.env` and set your MySQL details:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=omero_gym
   JWT_SECRET=some-long-random-string
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   On startup the server automatically creates the `omero_gym` database, the
   tables, and seeds the session catalog (see `server/db.js` → `schema.sql`).
   You do **not** need to import the SQL by hand.

4. **Open the app**

   Visit **http://localhost:3000** — it redirects to the login page.
   Create an account, then browse classes, book a slot and view your dashboard.

> Run the app through `npm start` (not "Live Server"), because the pages now
> talk to the API on the same server.

## API reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | – | Create account `{name,email,phone,password}` → `{token,user}` |
| POST | `/api/auth/login` | – | `{email,password}` → `{token,user}` |
| GET  | `/api/sessions` | – | List the session catalog |
| GET  | `/api/bookings` | Bearer | Current user's bookings |
| POST | `/api/bookings` | Bearer | Create `{sessionId,date,time}` |
| DELETE | `/api/bookings/:id` | Bearer | Cancel a booking |

Send the JWT as `Authorization: Bearer <token>` on the authenticated routes.

## Notes

- Passwords are never stored in plain text — only their bcrypt hash.
- `.env` and `node_modules` are git-ignored; never commit real secrets.
- To reset the data, drop the `omero_gym` database and restart the server.
