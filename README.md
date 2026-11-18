# CampusLink

**FirstCommit '26 | Team EshWar (solo) | Theme: Campus & Student Life**  
*Matches a student's request ("need a React teammate", "ML mentor", "DBMS help") to the best students and verified senior mentors on campus, with explainable AI scoring breakdown and reasoning.*

---

## 1. Problem & Pitch

Every fresher and college sophomore struggles to find reliable project teammates, hackathon partners, and verified upperclassmen mentors. Today, students are forced to spam unofficial WhatsApp and Telegram groups, leading to missed opportunities, noisy broadcast channels, and zero privacy.

**CampusLink** introduces an intent-driven, privacy-preserving AI matching engine. Students express what they need in plain English. The engine enriches the query with a concept graph, calculates multi-part explainable scores (semantic domain alignment, concept coverage, free timeslot availability, and senior fit), and securely connects verified peers.

---

## 2. Core Features

1. **Domain-Restricted Authentication**: College `.edu` verification with 1-click Demo Accounts for instant evaluation.
2. **Explainable AI Matching**: Displays candidate scores out of 100 with four transparent progress bars (`Semantic 45%`, `Coverage 30%`, `Availability 15%`, `Fit 10%`) and plain-English "Why this match" reasons.
3. **Privacy-Preserving Contact Exchange**: Contact details (email/phone) remain shielded by Zero-Trust Row Level Security until a recipient explicitly accepts the connection request.
4. **Verified Notes Library**: Curated, peer-reviewed subject notes, formula sheets, and placement preparation handbooks.
5. **Crisp Editorial Light Theme**: Ultra-clean white and soft off-white (`#f8fafc`) background, slate-900 typography, cobalt blue (`#2563eb`) and emerald green (`#16a34a`) accents, 1px light borders, zero-radius buttons, and monospace telemetry.

---

## 3. How the AI Matching Works

$$\text{Score} = 0.45 \cdot \text{Semantic} + 0.30 \cdot \text{Concept Coverage} + 0.15 \cdot \text{Availability} + 0.10 \cdot \text{Fit}$$

- **Semantic (45%)**: TF-IDF cosine similarity enriched with domain concept tags.
- **Concept Coverage (30%)**: Jaccard-weighted concept match (full credit for direct match, half credit for related domain strengths).
- **Availability (15%)**: Free timeslot Jaccard overlap across 4 weekly slots (`wkday_aft`, `wkday_eve`, `wkend_morn`, `wkend_aft`).
- **Fit (10%)**: Strict enforcement of upperclassmen seniority for mentors (`year >= 3` and verified badge) and cohort peer alignment for teammates.

### Benchmark Results (9 Labelled Requests)

| Metric | Keyword Baseline | CampusLink Matcher | Improvement |
|---|---|---|---|
| **Hit@1** | 77.8% | **100.0%** | **+28.5%** |
| **Precision@3** | 44.4% | **59.3%** | **+33.6%** |
| **Recall@3** | 74.1% | **94.4%** | **+27.4%** |

Full benchmark data and unseen queries: [docs/evaluation.md](docs/evaluation.md)

---

## 4. Architecture & Tech Stack

```
Browser (Next.js on Vercel)
   |  Supabase JS: auth, profile reads/writes, storage
   |  fetch -> FastAPI (Hugging Face Docker Space): POST /match
   v
FastAPI Backend
   |- loads profiles from Supabase (service key, server-side only)
   |- matcher.py: concepts -> similarity -> hybrid score -> reasons
   v
Supabase Postgres (users, requests, matches, connections, resources)
```

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide React
- **Backend**: FastAPI, Uvicorn, Scikit-learn, NumPy, PyJWT
- **Database & Auth**: Supabase PostgreSQL with strict Row Level Security (RLS) policies

---

## 5. Local Setup & Running

### Prerequisites
- Node.js 18+ & npm
- Python 3.10+

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- Health check: `http://localhost:8000/health` -> `{"ok": true}`
- Run tests: `python -m pytest -v` (7 passed)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Visit: `http://localhost:3000`

### Pre-Configured Demo Accounts
- **Demo Fresher**: Aarav Sharma (`aarav.cs27@college.edu`, Year 1)
- **Demo Senior Mentor**: Ananya Roy (`ananya.cs24@college.edu`, Year 3 Mentor)

---

## 6. Cloud Deployment Instructions

### 1. Supabase (Database & Auth)
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and execute `supabase/schema.sql` to establish tables and RLS policies.
3. Execute `supabase/seed.sql` to load 30 student profiles and 15 notes.
4. Copy `Project URL`, `anon public key`, and `service_role secret`.

### 2. Backend (Hugging Face Docker Space)
1. Create a new Space on [huggingface.co/spaces](https://huggingface.co/spaces) with SDK set to **Docker**.
2. Connect your GitHub repository (`campuslink/backend`).
3. Add Environment Secrets in the Space Settings:
   - `SUPABASE_URL`: Your Supabase Project URL
   - `SUPABASE_SERVICE_KEY`: Your Supabase Service Role Key
   - `SUPABASE_JWT_SECRET`: Your Supabase JWT Secret
   - `CORS_ORIGINS`: Your Vercel frontend URL
4. Verify `/health` on the Space URL.

### 3. Frontend (Vercel)
1. Import repository on [vercel.com](https://vercel.com) with root directory set to `frontend`.
2. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   - `NEXT_PUBLIC_API_URL`: Your Hugging Face Space URL
3. Deploy!

---

## 7. Author
**Team EshWar** &mdash; Lokeswar PJ  
FirstCommit '26 Hackathon
