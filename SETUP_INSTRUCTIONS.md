# SanityFlow

A full-stack application for sustainable water quality management and distribution.

## Project Structure

```
sanityflow/
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── constants/      # Application constants
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/      # Auth, rate limiting middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── validations/     # Request validation schemas
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Entry point
│   └── package.json
└── frontend/         # React + Vite + TypeScript SPA
    ├── src/
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB (Atlas or local instance)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=3000
   FRONTEND_APP_ORIGIN=http://localhost:5173
   BACKEND_APP_ORIGIN=http://localhost
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   GROQ_API_KEY=<your_groq_api_key>
   EMAIL_API_KEY=<your_resend_api_key>
   ALERT_EMAIL=<your_alert_email>
   OPENWEATHER_API_KEY=<your_openweather_api_key>
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build and run for production:
   ```bash
   npm run build
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend runs at `http://localhost:5173` by default.

4. Build for production:
   ```bash
   npm run build
   npm run preview
   ```

## Tech Stack

### Backend
- Node.js + Express 5
- TypeScript
- MongoDB + Mongoose
- JWT Authentication (bcryptjs)
- Zod validation
- Helmet, CORS, Rate Limiting
- Winston logging + Morgan
- Groq SDK (AI summarization)
- Resend (email alerts)
- OpenWeather API

### Frontend
- React 19 + Vite
- TypeScript
- Redux Toolkit (RTK Query)
- React Router v7
- Tailwind CSS v4
- shadcn/ui + Radix UI
- React Hook Form + Zod
- Recharts
