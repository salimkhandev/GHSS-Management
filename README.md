## GHSS Luqman Banda — Official Higher Secondary School Website & Management System

This repository hosts the official website and management system for the Higher Secondary School of Luqman Banda. It provides administration, teacher, and student workflows including registration, attendance, performance dashboards, and exports.

### Overview
- **Frontend**: React 18 + Vite with modern UI libraries and PWA support.
- **Backend**: Node.js/Express with PostgreSQL, Redis caching, JWT auth, file uploads, and Supabase integration.
- **Deployments**: Vercel configurations for both frontend and backend.

### Key Features
- **Authentication & Roles**: Admin and Teacher logins with JWT cookies and role-based access.
- **Student Management**: Registration forms and CSV bulk upload.
- **Attendance**: Daily/monthly/overall attendance APIs and visual dashboards.
- **Performance Analytics**: Recharts-based dashboards (daily, monthly, overall, top performers, section performance).
- **Teacher Profile Photos**: Image upload and processing (multer + sharp).
- **Exports**: Excel export of tabular data.
- **PWA Ready**: Service worker and install prompt integrated in the frontend.

---

## Tech Stack

### Frontend
- **Framework/Build**: React 18, Vite
- **Routing**: `react-router-dom`
- **HTTP**: `axios`
- **UI Libraries**: Material UI (`@mui/material`, `@mui/icons-material`), Chakra UI, Ant Design
- **Styling/Effects**: Tailwind CSS, AOS (scroll animations), Framer Motion
- **Forms/Validation**: Formik, Yup
- **Charts**: Recharts
- **Media/UX**: react-slick/slick-carousel (gallery), react-dropzone, cropperjs/react-cropper/react-easy-crop, react-avatar-editor
- **Utils**: date-fns, file-saver, xlsx, jwt-decode, notistack

### Backend
- **Runtime/Server**: Node.js, Express
- **Database**: PostgreSQL via `pg`
- **Caching/Queues**: Redis (Upstash) via `ioredis`
- **Auth/Security**: `jsonwebtoken` (JWT), `cookie-parser`, `cors`, `express-rate-limit`, `dotenv`
- **File Uploads/Images**: `multer`, `sharp`, `form-data`
- **Data/Automation**: `csv-parser`, `node-cron`
- **Cloud**: Supabase SDK for storage/services

### Hosting / Deployment
- Vercel configs present for both apps: `frontend/vercel.json`, `backend/vercel.json`.

---

## Project Structure
```
GHSS-Management/
  frontend/            # React + Vite app (UI, PWA, dashboards)
    public/            # static assets, service worker, install prompt
    src/
      components/      # Admin, teacher, attendance, registration, charts
      config/api.js    # API base URL (env-driven)
    package.json       # dev/build scripts
    vercel.json        # Vercel rewrites

  backend/             # Node/Express API
    Configs/           # db (Postgres), redis, supabase clients
    Routes/            # auth, students, attendance, analytics, RBA
    index.js           # express app entry, route mounting, CORS
    package.json       # start/dev scripts
    vercel.json        # Vercel serverless config
```

---

## Environment Variables

### Frontend (`frontend/.env`)
```
VITE_BACKEND_URL=http://localhost:3000
VITE_BACKEND_URL_PROD=https://<your-backend-deployment>
```
`src/config/api.js` automatically selects one based on Vite `MODE`.

### Backend (`backend/.env`)
```
PORT=3000
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<db>
# (Recommended) JWT_SECRET=<your-strong-secret>
# (Recommended) REDIS_URL=... (if you externalize Redis config)
# (Recommended) SUPABASE_URL=... SUPABASE_ANON_KEY=...
```
Notes:
- Current code includes placeholder/hardcoded values for JWT, Redis, and Supabase. For production, move secrets to env vars.

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL database URL
- (Optional) Redis and Supabase if you intend to use those features locally

### 1) Backend
```bash
cd backend
npm install
cp .env.example .env  # if you have one; otherwise create .env with vars above
npm run dev           # starts Express on PORT (default 3000)
```

### 2) Frontend
```bash
cd frontend
npm install
cp .env.example .env  # set VITE_BACKEND_URL and VITE_BACKEND_URL_PROD
npm run dev           # starts Vite dev server (default http://localhost:5173)
```

Open the app at `http://localhost:5173`. The frontend will call the backend at `VITE_BACKEND_URL`.

---

## Build & Production

### Frontend
```bash
cd frontend
npm run build   # outputs to dist/
npm run preview # optional local preview
```

### Backend
```bash
cd backend
npm run start   # runs index.js on PORT
```

### Vercel
- The repository includes `vercel.json` in both `frontend/` and `backend/` to guide deployment.
- Set all environment variables in your Vercel project settings.

---

## API Highlights
Mounted in `backend/index.js`:
- Auth: `/teacherLogin`, `/admin-login`, `/admin-register`, `/logout`
- RBAC checks: `/verify-token-asAdmin`, `/verify-token-asTeacher`
- Students: `/` (routes for CRUD), `/students/bulk` (CSV bulk upload)
- Attendance: `/` (attendance routes), plus analytics endpoints:
  - `/dailyAttenPercentage`, `/monthlyAttenPercentage`, `/overallAttenPercentage`
  - `/attenBasedSectionsPerformance`, `/Top10StudentsAtten`
- Teachers: `/TeachersList`, profile photos via `TeacherProfilePic`

Note: See `backend/Routes/` for detailed route handlers.

---

## Security & Configuration Notes
- Replace placeholder secrets (JWT, Redis, Supabase) with environment variables before going live.
- Enable secure cookies and strict CORS origins in production.
- Consider database migrations and schema management for `teachers`, `students`, and attendance tables.

---

## Credits
Developed for GHSS Luqman Banda as the official higher secondary school website and management platform.


