# Project rules - CampusLink

- Stack: Next.js + Tailwind + shadcn/ui; FastAPI; Supabase. Do not add other frameworks.
- Matching logic lives in backend/app/matcher.py. Do not change scoring weights or logic without being asked; add tests when you do.
- Never commit secrets. Use .env and keep .env.example up to date.
- API shapes must match docs/api.md exactly. If a change is needed, update the doc first.
- Every table has Row Level Security. Contact info is visible only after a connection is accepted.
- Keep code simple and readable; no unused dependencies; type everything in TypeScript.
- Work in the phases defined in the implementation plan. Do ONLY the current phase.
- At the end of every phase, STOP and post a Phase Report in this exact format, then wait for the user to say "go":
    PHASE REPORT - Phase <n>: <name>
    1. Built  2. Files changed  3. How I tested it (paste real command output)
    4. Works (exact steps to try it)  5. Not done / known issues  6. Risks for next phase
    7. Decision needed from you
- Never claim something works unless you ran it. If you could not test something, say so.
- Prefer small commits with clear messages.

