# BrahmOS Compliance Change Intelligence Engine

BrahmOS is an agentic compliance platform designed for the SEBI Securities Market ecosystem. It automates the ingestion of circular regulations and translates them into operational compliance tasks through dynamic gap analysis.

---

## Technical Stack
- **Frontend**: Next.js, React, TailwindCSS, Prisma (SQLite)
- **Backend Service**: FastAPI, LangChain, LangGraph, Gemini API

---

## Getting Started

### 1. Backend Service Setup

Navigate to the `backend` directory:
```bash
cd backend
```

Create a Virtual Environment:
```bash
python -m venv .venv
source .venv/Scripts/activate  # On Windows PowerShell
# On macOS/Linux: source .venv/bin/activate
```

Install Dependencies:
```bash
pip install -r requirements.txt
```

Set Environment Variables:
Copy `.env.example` to `.env` and fill in your **Gemini API Key**:
```env
GOOGLE_API_KEY=AIzaSy...
```

Run FastAPI Backend Service:
```bash
uvicorn main:app --reload --port 8000
```

---

### 2. Frontend Next.js Dashboard Setup

Navigate to the `frontend` directory:
```bash
cd ../frontend
```

Install packages:
```bash
npm install
```

Prisma SQLite setup & seeding:
```bash
npx prisma db push --accept-data-loss
npm run seed
```

Run Dev server:
```bash
npm run dev
```

Open `http://localhost:3000` and sign in with the seeded credentials:
- **Admin**: `admin@demo.com` / `admin123`
- **Compliance Officer**: `compliance@demo.com` / `demo123`
- **Manager**: `manager@demo.com` / `demo123`
- **Auditor**: `auditor@demo.com` / `demo123`
