# CampusLink

**FirstCommit '26 | Team EshWar (solo) | Theme: Campus & Student Life**

Matches a student's request ("need a React teammate", "ML mentor", "DBMS help") to the best students and verified senior mentors on campus, with explainable AI scoring breakdown and reasoning.

## Architecture

- **Frontend**: Next.js (App Router), Tailwind CSS, Lucide icons, Dark Tech Aesthetic
- **Backend**: FastAPI (Python), scikit-learn hybrid matching engine (4-part explainable score)
- **Database & Auth**: Supabase (Postgres, RLS policies, domain-restricted auth)

## Setup & Running Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Health check: http://localhost:8000/health

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Access at: http://localhost:3000

## Phases
See [PRD.md](PRD.md), [AGENT_RULES.md](AGENT_RULES.md), and [docs/api.md](docs/api.md) for full specs and implementation plan.
