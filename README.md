# StudyNotion — EdTech Platform with AI Course Assistant

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A full-stack MERN ed-tech platform — course creation, enrollment, video-based learning, payments, and progress tracking — extended with an AI course assistant powered by Gemini with a Groq fallback.

The base platform follows the widely-used **StudyNotion** architecture (a well-known open full-stack ed-tech learning project); the AI assistant, course summarization, and dual-provider AI layer in `server/services/aiService.js` are original additions on top of it.

---

## Features

**Core platform**
- Student and instructor roles with JWT-based authentication and email OTP verification
- Course creation with sections/sub-sections, video lectures, and category browsing
- Cart, checkout, and payments via Razorpay
- Cloudinary-backed media uploads (course thumbnails, videos, profile images)
- Course progress tracking, ratings & reviews, and an instructor dashboard with revenue/enrollment charts (Chart.js)
- Password reset via email (Nodemailer)

**AI course assistant** (`server/routes/ai.js`)
- `POST /api/v1/ai/course-summary` — generates a concise, student-facing summary of a course from its description and learning outcomes
- `POST /api/v1/ai/chat` — a context-aware chat endpoint that answers student questions grounded in the specific course they're viewing
- Dual-provider fallback: tries Gemini (`gemini-2.5-flash`) first, falls back to Groq (`llama-3.1-8b-instant`) if the primary call fails, so the assistant stays available through a single-provider outage

---

## Tech Stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 18, Redux Toolkit, React Router, Tailwind CSS, Chart.js |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt, email OTP |
| Payments | Razorpay |
| Media storage | Cloudinary |
| Email | Nodemailer |
| AI | Google Gemini (`@google/genai`), Groq (`groq-sdk`) |

---

## Project Structure

```
├── src/                 # React client
│   ├── components/       # Common + core (course, dashboard, auth) components
│   ├── pages/             # Route-level pages (Home, Catalog, Dashboard, ViewCourse, ...)
│   ├── services/           # API connector + endpoint definitions
│   ├── slices/              # Redux Toolkit slices (auth, cart, course, profile)
│   └── reducer/
└── server/               # Express API
    ├── controllers/        # Auth, Course, Payments, Profile, AI, Admin, ...
    ├── models/               # Mongoose schemas
    ├── routes/                # Route definitions, incl. ai.js
    ├── services/aiService.js  # Gemini → Groq dual-provider AI layer
    ├── middleware/            # JWT auth guard
    └── config/                # DB, Cloudinary, Razorpay setup
```

---

## Getting Started

### Prerequisites
- Node.js 16 (see `.nvmrc`)
- A MongoDB database
- Cloudinary account (media storage)
- Razorpay account (payments)
- Gemini and/or Groq API key (for the AI assistant — optional, features degrade gracefully without it)

### Installation

```bash
git clone https://github.com/LakshyaAhlawat/studynotion-hosting.git
cd studynotion-hosting

# Install client + server dependencies
npm install
cd server && npm install && cd ..
```

### Environment setup

Create `server/.env`:

```env
MONGODB_URL=mongodb+srv://...
JWT_SECRET=your_jwt_secret

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

MAIL_HOST=smtp.example.com
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_app_password

# Optional — enables the AI course assistant
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

PORT=4000
```

### Run

```bash
# Runs client (CRA dev server) and server (nodemon) together
npm run dev
```

The client runs on [http://localhost:3000](http://localhost:3000) and the API on `http://localhost:4000`.

---

## License

This project is provided as-is for portfolio and learning purposes.
