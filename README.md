<div align="center">
  
  # 🏛️ BrahmOS
  
  **AI-Powered Regulatory Change Management Platform**
  
  *From Regulatory Text to Operational Action in Minutes, not Months.*
  
  <br />

  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

</div>

---

## 🚀 The Problem & Solution

Financial institutions spend thousands of hours manually reading, interpreting, and delegating tasks from regulatory circulars (SEBI, RBI, IRDAI). 

**BrahmOS** bridges the gap between regulatory bodies and compliance operations. By leveraging artificial intelligence, it automatically parses complex regulatory PDFs, extracts actionable obligations, and translates them into a trackable workflow—enforced by a strict Human-in-the-Loop Trust Layer.

---

## ✨ Core Three-Step Workflow

BrahmOS operates on a proprietary three-engine architecture:

### 1. 🧠 UNDERSTAND (AI Extraction Engine)
Upload any regulatory PDF. BrahmOS's AI Engine instantly parses the document and extracts structured obligations. It identifies the **Rule ID**, **Priority**, **Deadline**, **Department**, and **Penalty**, backed by a Confidence Score and direct source citation (Page/Paragraph).

### 2. 🔍 IDENTIFY (Change Intelligence)
Before execution, BrahmOS compares new circulars against historical data. It instantly identifies regulatory delta—highlighting exactly what was *Added*, *Modified*, or *Removed* so your compliance team doesn't have to read the entire document again.

### 3. ⚡ ACT (Workflow Automation)
Approved obligations are automatically converted into operational tasks. BrahmOS routes tasks to the correct department (IT, Legal, Risk, Operations) and tracks progress via an interactive Kanban board and timeline calendar.

---

## 🛡️ Enterprise Trust Layer

AI cannot operate autonomously in highly regulated environments. BrahmOS enforces a strict **Human-in-the-Loop Trust Layer**:
- **Confidence Scores:** Every AI extraction is scored for accuracy.
- **Source Citations:** AI reasoning is linked directly to the source paragraph.
- **Mandatory Approval:** AI-generated obligations *cannot* become operational tasks until explicitly approved by a Compliance Officer.
- **Immutable Audit Logs:** Every approval, rejection, or edit is permanently logged.

---

## 🌟 Key Features

- **📊 Live Analytics Dashboard:** Track compliance health, upcoming deadlines, and departmental performance in real-time.
- **📅 Timeline & Calendar:** Interactive view of all regulatory deadlines and missed obligations.
- **🌙 Dark Mode:** Enterprise-grade aesthetic with full dark mode support.
- **📄 PDF Reporting:** Generate 1-click A4 PDF exports for executive summaries and compliance reports.
- **🔔 Notification Center:** Filterable in-app alerts for pending reviews and approaching deadlines.
- **⌨️ Global Search (Cmd+K):** Instantly search across circulars, obligations, tasks, and users.
- **👥 RBAC Support:** Granular roles for Admin, Compliance Officer, Manager, and Auditor.

---

## 💻 Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **Backend:** Next.js Server Actions, NextAuth.js
- **Database:** Prisma ORM, SQLite (Zero-config development)
- **UI Components:** shadcn/ui, Recharts, Lucide Icons, Framer Motion

---

## 🚦 Getting Started

BrahmOS is designed to run instantly out-of-the-box with Mock Authentication and a comprehensive demo database.

### 1. Clone & Install
```bash
git clone https://github.com/vishesh-017/RegAI.git
cd RegAI/frontend
npm install
```

### 2. Seed the Demo Database
We've included a robust seed script that populates the platform with 5 realistic SEBI Circulars, 46 obligations, 40 workflow tasks, and full audit logs.

```bash
npm run seed
```

### 3. Run the Platform
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Login Credentials
Select the pre-configured demo buttons on the Sign In page, or use:
- **Admin**: `admin@demo.com` / `admin123`
- **Compliance Officer**: `compliance@demo.com` / `demo123`
- **Manager**: `manager@demo.com` / `demo123`
- **Auditor**: `auditor@demo.com` / `demo123`

---

<div align="center">
  <p>Built for the modern compliance era. Designed for scale.</p>
</div>
