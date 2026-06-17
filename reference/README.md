# Bootcamp Backend

Node.js + Express + MySQL backend with Google OAuth login. Admins can upload
photos, videos, and text messages to a "bootcamp" feed; anyone can read the feed.

Tested end-to-end while building this (real MySQL database, real file upload,
admin vs. non-admin permissions) — it works. You just need to plug in your own
MySQL credentials and Google OAuth keys below.

## 1. Prerequisites

- Node.js installed (v18+)
- MySQL installed and running locally (or a remote MySQL you can connect to)
- A Google account (to create OAuth credentials)

## 2. Install dependencies

```bash
npm install
```

## 3. Create the database

Open a MySQL shell and run:

```sql
CREATE DATABASE bootcamp_db;
```

You don't need to create any tables — the app creates them automatically on
first run (via `sequelize.sync()` in `server.js`).

## 4. Set up Google OAuth credentials

1. Go to https://console.cloud.google.com/ and create a project (or use an existing one).
2. Go to "APIs & Services" → "OAuth consent screen" and set it up (External, fill in app name/email).
3. Go to "APIs & Services" → "Credentials" → "Create Credentials" → "OAuth client ID".
4. Application type: **Web application**.
5. Under "Authorized redirect URIs" add:
   `http://localhost:5000/auth/google/callback`
6. Copy the generated **Client ID** and **Client Secret**.

## 5. Configure environment variables

Copy the example file and fill in your real values:

```bash
cp .env.example .env
```

Open `.env` and fill in: your MySQL password, your Google Client ID/Secret,
a random `JWT_SECRET`, and your own email under `ADMIN_EMAILS` (this is what
makes you an admin when you log in — anyone else who logs in just becomes a
regular "user" with read-only access).

## 6. Run the server

```bash
npm start
```

or, for auto-restart while you're developing:

```bash
npm run dev
```

You should see:
```
Database connected and synced
Server running on port 5000
```

## 7. How the login flow works (no frontend needed)

1. Open this URL in a browser: `http://localhost:5000/auth/google`
2. Log in with Google and approve access.
3. You'll be redirected back and shown a JSON response containing a `token`.
4. Copy that token — you'll use it as a Bearer token for every admin action.

```
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "...", "email": "...", "role": "admin" }
}
```

## 8. API reference (test with Postman or curl)

| Method | Endpoint                  | Who          | Description                          |
|--------|----------------------------|--------------|---------------------------------------|
| GET    | `/auth/google`              | anyone       | Start Google login                    |
| GET    | `/auth/me`                  | logged in    | Check your token / see your role      |
| GET    | `/api/bootcamp`              | anyone       | List all posts (`?type=photo/video/message` to filter) |
| GET    | `/api/bootcamp/:id`          | anyone       | Get one post                          |
| POST   | `/api/bootcamp/photo`        | admin        | Upload a photo (`form-data`, field `photo`, optional `title`) |
| POST   | `/api/bootcamp/video`        | admin        | Upload a video (`form-data`, field `video`, optional `title`) |
| POST   | `/api/bootcamp/message`      | admin        | Post a message (JSON: `title`, `content`) |
| PUT    | `/api/bootcamp/:id`          | admin        | Edit a post's title/content           |
| DELETE | `/api/bootcamp/:id`          | admin        | Delete a post (and its file, if any)  |

For admin-only routes, add this header in Postman:
```
Authorization: Bearer <your token from step 7>
```

Uploaded files are served back at, e.g.:
`http://localhost:5000/uploads/photos/<filename>.jpg`

## Project structure

```
bootcamp-backend/
├── server.js                  # entry point — start here to follow the flow
├── config/
│   ├── db.js                  # MySQL connection (Sequelize)
│   └── passport.js            # Google OAuth strategy
├── models/
│   ├── User.js
│   ├── BootcampPost.js        # photos/videos/messages all live here
│   └── index.js                # wires up model relationships
├── middleware/
│   ├── auth.js                 # checks the JWT Bearer token
│   ├── isAdmin.js              # blocks non-admins
│   └── upload.js               # multer config for photo/video files
├── controllers/
│   ├── authController.js
│   └── bootcampController.js
├── routes/
│   ├── authRoutes.js
│   └── bootcampRoutes.js
└── uploads/
    ├── photos/                 # uploaded photos land here
    └── videos/                 # uploaded videos land here
```

## Notes / things you may want to change later

- **File storage**: currently saves files to the local `uploads/` folder.
  Fine for one server; if you ever deploy to something like Heroku/Render
  where the filesystem isn't permanent, you'd switch to S3/Cloudinary instead.
- **Video size limit**: capped at 200MB in `middleware/upload.js` — adjust if needed.
- **Who can read the feed**: currently public (no login required to view).
  If you want only logged-in users to see it, add the `authenticate` middleware
  to the `GET` routes in `routes/bootcampRoutes.js`.
