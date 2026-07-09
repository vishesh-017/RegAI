# BrahmOS - AI-Powered Regulatory Change Management

BrahmOS is an enterprise-grade platform that converts complex regulatory text into operational action. It bridges the gap between regulatory bodies and compliance operations by leveraging artificial intelligence to parse, extract, and delegate obligations automatically.

## Core Features
- **AI Extraction Engine**: Automatically reads Circulars and extracts actionable obligations.
- **Workflow Planner**: Generates departments, tasks, and owners from regulatory rules.
- **Trust Layer**: Enforces Human-in-the-Loop review for every AI-generated extraction.
- **Audit Logs**: Immutable tracking of all edits, approvals, and rejections.
- **Global Search**: Command Palette (Ctrl+K) for instant navigation across the organization.
- **Analytics & Reports**: Visual compliance trends and instant A4 PDF exports.
- **Notification Center**: In-app alerts and simulated email dispatch for upcoming deadlines.

## Technology Stack
- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: SQLite (Dev)
- **UI Components**: shadcn/ui, Recharts, Lucide, Sonner

## Getting Started

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

The platform is designed to run instantly out-of-the-box with Mock Authentication.
