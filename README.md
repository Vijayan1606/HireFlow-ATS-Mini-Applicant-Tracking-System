# HireFlow ATS — Modern Applicant Tracking System

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19.3-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=flat&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-indigo)

A lightweight, production-quality Applicant Tracking System (ATS) designed for recruitment teams, talent acquisition specialists, and hiring managers. Built as part of the Full Stack Developer Intern assignment at **EarlyJobs.ai**.

---

## 1. Project Overview & Problem Statement

Modern recruitment moves fast. High-growth organizations and agency recruiters often struggle with clunky legacy HR software that is slow, cluttered, and unintuitive. 

**HireFlow ATS** provides a streamlined, fast, and visually refined recruitment command center inspired by modern SaaS applications like Linear, Ashby, and Lever. It equips recruiters to:
* Track candidates across 5 recruitment lifecycle stages (*Applied*, *Screening*, *Interview*, *Offer*, *Hired*).
* Visualize talent pipeline metrics and application velocity with real-time interactive charts.
* Search and filter candidates by name, email, applied position, and skills.
* Move candidates seamlessly using an interactive Kanban board with drag-and-drop and instant stage updates.
* Record recruiter notes, review qualifications, and manage candidates persistently with PostgreSQL / Supabase.

---

## 2. Key Features

### 📊 Recruiter Dashboard
* **Dynamic Pipeline Metrics**: Real-time counts for Total Candidates, Applied, In Screening, Interviews, Offers, and Hired calculated directly from actual candidate database records (never hardcoded).
* **Interactive Recharts Visualizations**:
  * *Pipeline Stage Distribution*: Bar chart detailing candidate counts per stage with custom status colors.
  * *Application Intake & Velocity*: Area timeline chart tracking applicant intake dates.
* **Recent Candidates List**: Quick-glance view of newest applicants with position, experience, and stage indicators.
* **Recruitment Activity Feed**: Automatically synthesized timeline of recent hiring events and stage promotions.
* **Quick Global Actions**: Immediate access to add applicants, refresh data, or open the Kanban pipeline.

### 👥 Candidate Management
* **Comprehensive Directory Table**: Displays candidate name, email, phone, position, skills chips, experience years, application date, hiring stage, and actions.
* **Multi-Parameter Search**: Instant case-insensitive search across candidate names, email addresses, positions, and skill tags.
* **Dynamic Filtering**: Filter by hiring stage, position, and experience brackets (0–2 yrs, 3–5 yrs, 6+ yrs) with one-click filter reset.
* **Multi-Column Sorting**: Sort by candidate name (A-Z), application date (newest/oldest), experience years, or hiring stage.
* **Pagination & CSV Export**: Scalable table pagination and instant CSV export of filtered records for reporting.
* **Candidate Creation & Edit Modals**: Accessible modal forms with client-side & server-side validation using Zod and React Hook Form.
* **Delete Confirmation Dialog**: Protected deletion modal preventing accidental record removal.
* **Candidate Detail Profile**: Full profile modal and dedicated permalink route (`/candidates/[id]`) with contact links, experience, external resume URL, and recruiter notes.

### 📋 Hiring Pipeline (Kanban Board)
* **5 Standardized Stages**: `Applied` → `Screening` → `Interview` → `Offer` → `Hired`.
* **Intuitive Stage Transitions**: Move candidates via HTML5 native drag-and-drop or single-click stage advance controls on each card.
* **Real-time Synchronization**: Moving a candidate instantly updates the database, updates dashboard metrics, and recalculates column tallies.
* **Celebration Effects**: Confetti burst trigger powered by `canvas-confetti` when a candidate reaches the **Hired** milestone.
* **Pipeline Search & Filter**: Filter pipeline cards by candidate name or position.

### ⚙️ Settings & Environment Diagnostics
* **Live Connection Badge**: Real-time diagnostic pill indicating whether HireFlow is connected to a live Supabase PostgreSQL database or running in demo mode.
* **Sample Data Controls**: One-click actions to populate 15 realistic seed candidates or clear records to test empty states.
* **Recruiter Profile Demo**: Demonstration profile for active recruitment session.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | High-performance server/client hybrid architecture with Partial Prerendering (PPR) |
| **Language** | TypeScript 5 | Strict end-to-end type safety |
| **Styling** | Tailwind CSS v4 | Clean, minimal SaaS design system inspired by Linear & Ashby |
| **Icons** | Lucide React | Pixel-perfect icons |
| **Charts** | Recharts | Responsive SVG charts for pipeline distributions and intake velocity |
| **Validation** | Zod + React Hook Form | Schema validation for candidate records and API inputs |
| **Database** | Supabase (PostgreSQL) | Managed relational database with constraints, indexes, triggers, and Row Level Security |
| **DB Client** | `@supabase/supabase-js` | Official client for database queries |
| **Animation/FX** | `canvas-confetti` | Milestone celebration effects |
| **Deployment** | Vercel | Production deployment platform |

---

## 4. Architecture & Data Access

HireFlow ATS uses a layered architecture ensuring clean separation of concerns:

```
├── app/
│   ├── api/
│   │   ├── candidates/          # GET (list/filter/search), POST (create)
│   │   │   └── [id]/            # GET (single), PATCH (update/stage), DELETE
│   │   ├── stats/               # GET (calculated pipeline metrics)
│   │   └── seed/                # POST (load sample data), DELETE (clear records)
│   ├── dashboard/page.tsx       # Recruiter dashboard
│   ├── candidates/              # Candidate table directory
│   │   └── [id]/page.tsx        # Dedicated candidate permalink page
│   ├── pipeline/page.tsx        # Kanban board
│   ├── settings/page.tsx        # DB diagnostics & seed actions
│   ├── layout.tsx               # Root layout & Geist typography
│   └── globals.css              # Global tokens & clean scrollbars
├── components/
│   ├── layout/                  # Sidebar, Header, AppShell provider
│   ├── dashboard/               # MetricsCards, HiringCharts, RecentCandidates, RecentActivity
│   ├── candidates/              # CandidatesTable, CandidateFormModal, CandidateDetailModal, DeleteConfirmModal
│   ├── pipeline/                # KanbanBoard, KanbanColumn, KanbanCard
│   └── ui/                      # Button, Input, Select, Badge, Modal, Toast
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Client-side Supabase client & config detector
│   │   ├── server.ts            # Server-side Supabase client
│   │   ├── service.ts           # Unified data service (Supabase + fallback)
│   │   └── sample-data.ts       # 15 realistic fictional candidates
│   ├── validations/
│   │   └── candidate.ts         # Zod schemas for candidate inputs
│   └── utils/
│       ├── formatters.ts        # Date, relative time, and initials formatting
│       └── cn.ts                # Tailwind class merging utility
├── types/
│   └── candidate.ts             # TypeScript definitions
└── supabase/
    ├── schema.sql               # PostgreSQL DDL, indexes, triggers, and RLS
    └── seed.sql                 # SQL seed data with 15 candidates
```

---

## 5. Database Schema Design

The `candidates` table is defined in `supabase/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS public.candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    position TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}'::TEXT[],
    experience_years NUMERIC DEFAULT 0 CHECK (experience_years >= 0),
    resume_url TEXT,
    stage TEXT NOT NULL DEFAULT 'Applied' CHECK (stage IN ('Applied', 'Screening', 'Interview', 'Offer', 'Hired')),
    notes TEXT,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Performance & Query Indexes
CREATE INDEX idx_candidates_stage ON public.candidates(stage);
CREATE INDEX idx_candidates_position ON public.candidates(position);
CREATE INDEX idx_candidates_email ON public.candidates(email);
CREATE INDEX idx_candidates_applied_at ON public.candidates(applied_at DESC);
CREATE INDEX idx_candidates_created_at ON public.candidates(created_at DESC);
CREATE INDEX idx_candidates_experience ON public.candidates(experience_years);
CREATE INDEX idx_candidates_skills ON public.candidates USING GIN(skills);
```

### Row Level Security (RLS)
RLS is enabled on the `candidates` table to ensure safe access rules:
```sql
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to candidates" ON public.candidates FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to candidates" ON public.candidates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to candidates" ON public.candidates FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete access to candidates" ON public.candidates FOR DELETE USING (true);
```

---

## 6. Local Installation & Setup

### Prerequisites
* **Node.js**: v18.18 or higher (v20+ recommended)
* **npm**: v9 or higher

### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/hireflow-ats.git
cd "Mini Applicant Tracking System (ATS)"
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Open `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

> **Note**: If you run HireFlow without configuring Supabase immediately, the application starts in **Interactive Demo Mode**, seamlessly handling all CRUD operations and analytics via an in-memory development store pre-populated with 15 candidate records.

### Step 4: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Supabase Database Setup

1. Create a free account and new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase project dashboard.
3. Open `supabase/schema.sql` from this repository, paste the contents into the SQL Editor, and click **Run**.
4. To load sample data, open `supabase/seed.sql`, paste the contents into the SQL Editor, and click **Run** (or click the **Load 15 Sample Candidates** button in the app's Settings page).
5. Copy your **Project URL** and **anon public API key** from **Project Settings > API** into `.env.local`.

---

## 8. Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js development server on `localhost:3000` |
| `npm run build` | Compiles the production build with TypeScript checking |
| `npm run start` | Runs the compiled Next.js production server |
| `npm run lint` | Runs ESLint to check for code quality and style |

---

## 9. Verification & Testing

To run the automated E2E test suite covering candidate creation, retrieval, stage progression, metric recalculation, and deletion:
```bash
# Ensure the application is built and running
npm run build
npm run start

# In another terminal window:
node scratch/test-e2e.js
```

All 8 integration test scenarios verify:
* ✅ Accurate dashboard counts across all 5 stages
* ✅ Case-insensitive search
* ✅ Candidate creation via POST with Zod validation
* ✅ Profile retrieval by UUID
* ✅ Stage update via PATCH (e.g. Applied → Interview)
* ✅ Live recalculation of interview metrics
* ✅ Safe record deletion with confirmation
* ✅ Persistence across page reloads

---

## 10. Deployment to Vercel

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   * `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
5. Click **Deploy**. Vercel will automatically build and deploy your production application.

---

## 11. Responsive Design Breakdown

The application is thoroughly optimized across viewports:
* **Desktop (1440px+)**: Multi-column dashboard with high-density metrics, split charts, full data tables, and expanded 5-column Kanban board.
* **Laptop / Tablet (768px – 1024px)**: Collapsible sidebar, adaptive 2-column metrics cards, horizontal scrollable Kanban with snap scrolling.
* **Mobile (375px – 640px)**: Slide-out drawer navigation, compact metric tiles, stacked candidate card controls, and touch-friendly action targets.

---

## 12. Known Limitations & Future Enhancements

* **Multi-tenant Auth**: The current release focuses on a streamlined single-recruiter workflow for fast evaluation. Multi-user RBAC (Hiring Manager vs. Recruiter) can be enabled with Supabase Auth.
* **File Uploads**: Resumes are linked via external URLs (e.g. LinkedIn, Google Drive, portfolio sites). Direct PDF upload can be integrated via Supabase Storage buckets.
* **Automated Email Notifications**: Candidate stage updates can be wired to Resend or SendGrid webhooks for automated candidate rejection or interview invite emails.

---

## 13. License

Distributed under the MIT License. Built for the EarlyJobs.ai Full Stack Developer Intern assignment.
