# Deployment Report — SanityFlow

**Project:** SanityFlow (Water Quality and Distribution Management System)  
**Repo type:** Multi-app repository
- Backend: `backend` (Node.js + Express + TypeScript + MongoDB)
- Frontend: `frontend` (React + Vite + TypeScript)

**Date:** April 2026

---

## 1. Overview

This report documents how SanityFlow is deployed, the platform configuration for this repository structure, required environment variables, and deployment verification steps.

Recommended deployment:
- **Backend:** Render (Node Web Service)
- **Frontend:** Vercel (Vite/React)
- **Database:** MongoDB Atlas

---

## 2. Live Deployment (Current)

Update this section with the currently active deployment URLs:
- Backend (Render): `https://sanityflow.onrender.com`
- Frontend (Vercel): `https://sanityflow.vercel.app/`

If URLs change after re-deploy, also update:
- `FRONTEND_APP_ORIGIN` (backend)
- `BACKEND_APP_ORIGIN` (backend)
- `VITE_API_BASE_URL` (frontend)

---

## 3. Backend Deployment (Render)

### 3.1 Create the Render service

1. Render -> **New** -> **Web Service**
2. Connect the GitHub repository
3. Configure service settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

Important:
- `npm start` runs `node dist/server.js`
- If build is skipped, Render will fail with: `Cannot find module .../dist/server.js`

### 3.2 Backend environment variables

Set these in Render Environment (do not commit secrets):

**Startup-required in current code (app fails to boot if missing):**
- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_APP_ORIGIN` (your Vercel frontend URL, e.g. `https://your-app.vercel.app`)
- `BACKEND_APP_ORIGIN` (your public backend base origin, e.g. `https://your-service.onrender.com`)
- `GROQ_API_KEY`
- `EMAIL_API_KEY`
- `ALERT_EMAIL`
- `OPENWEATHER_API_KEY`

**Startup-optional in current code:**
- `BARCODE_API_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_PUBLIC_BASE_URL`

**Have defaults (safe to omit):**
- `NODE_ENV` (default: `development`)
- `PORT` (default: `3000`; Render also injects `PORT`)
- `BLOG_IMAGE_MAX_MB` (default: `5`)
- `BLOG_IMAGE_MAX_WIDTH` (default: `1600`)
- `BLOG_IMAGE_WEBP_QUALITY` (default: `80`)

**Feature-level notes:**
- AWS variables are optional for boot, but required for S3 blog image upload features.
- `BARCODE_API_KEY` is optional; barcode flow can still use other fallback sources.
- Even if some APIs are feature-specific, `GROQ_API_KEY`, `EMAIL_API_KEY`, and `OPENWEATHER_API_KEY` are currently startup-required by the environment schema.

### 3.3 Backend verification steps

1. Open Render logs and confirm startup message appears without crash
2. Call one public backend endpoint from Postman/browser and confirm non-5xx response
3. Confirm frontend requests to backend succeed from deployed Vercel app

---

## 4. Frontend Deployment (Vercel)

### 4.1 Create the Vercel project

1. Vercel -> **New Project** -> import GitHub repo
2. Configure project settings:
   - **Root Directory:** `frontend`
   - Framework preset: **Vite** (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 4.2 Frontend environment variables

**Required:**
- `VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api/v1`

Notes:
- Must include `/api/v1` because frontend API slices are built on that base
- Must be HTTPS in production

### 4.3 Frontend verification steps

1. Load deployed Vercel URL
2. Test login/API-backed pages
3. Check browser console for CORS/network errors
4. Verify backend requests point to `VITE_API_BASE_URL`

---

## 5. CORS and Cross-Origin Alignment

SanityFlow backend CORS is configured with:

```ts
cors({ origin: env.FRONTEND_APP_ORIGIN, credentials: true })
```

For this to work in production:
- `FRONTEND_APP_ORIGIN` must exactly match the deployed frontend origin
- Do not include trailing slash path segments (use origin only)

Examples:
- Correct: `https://sanityflow.vercel.app`
- Incorrect: `https://sanityflow.vercel.app/`
- Incorrect: `https://sanityflow.vercel.app/dashboard`

---

## 6. Deployment Evidence Checklist

Capture screenshots or links for submission:
- Render: successful deploy screen
- Render: environment variables page (names only, no secret values)
- Vercel: deployment ready screen
- Live frontend URL loaded in browser
- Render logs showing backend started successfully
- Network/API request from frontend to backend returning successful response

---

## 7. Common Failure and Fix

### Error
`Cannot find module '/opt/render/project/src/backend/dist/server.js'`

### Cause
`npm start` ran before `npm run build`, so `dist/server.js` was not created.

### Fix
- Render Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

---

## 8. Quick Deployment Commands (Local Validation)

Backend:
```bash
cd backend
npm install
npm run build
npm start
```

Frontend:
```bash
cd frontend
npm install
npm run build
npm run preview
```
