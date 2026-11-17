# CampusLink - Demo Video Script (3 to 5 Minutes)

**FirstCommit '26 | Team EshWar (solo)**  
**Theme:** Campus & Student Life  
**Recording Recommendation:** OBS Studio or Loom at 1080p, 60fps.

---

## Script & Timeline Breakdown

### 0:00 - 0:30 &bull; Title & The Campus Problem
- **On Screen:** CampusLink Landing page hero (`http://localhost:3000`) with Dark Tech theme and radial glow.
- **What to Say:**  
  *"Hello judges! I am Lokeswar PJ representing Team EshWar. Every fresher and sophomore in college struggles to find good project teammates, hackathon partners, and verified upperclassmen mentors. Today, students rely on chaotic WhatsApp groups, where requests get drowned out, spam is rampant, and there's zero privacy. Today, we're introducing CampusLink &mdash; an intent-driven, privacy-preserving AI matching platform built specifically for campus student life."*

---

### 0:30 - 1:15 &bull; Log in as Fresher & Profile Setup
- **On Screen:** Click Login -> Click "Aarav Sharma (Year 1 Fresher)" -> Open `/profile`.
- **What to Say:**  
  *"Let's log in as Aarav, a Year 1 fresher. On the profile page, Aarav can configure his skills using interactive tags, his research interests, and his free availability slots across weekdays and weekends. Because Aarav is a Year 1 student, mentorship is appropriately locked until Year 3. Simple, fast, and verified."*

---

### 1:15 - 2:30 &bull; Intent-Based Request & The AI Match Card (The Judge Highlight)
- **On Screen:** Navigate to `/requests` -> Select "Senior Mentor" -> Click or paste:  
  *"Looking for a senior mentor in machine learning to guide my mini project"* -> Click "Run AI Matcher".
- **On Screen:** Redirects to `/requests/[id]` showing the 3 Match Cards.
- **What to Say:**  
  *"Now, Aarav wants a senior mentor in machine learning. He simply posts in plain English. The AI engine instantly tokenizes the request, performs concept enrichment, and evaluates availability and seniority. Look at the result: Ananya Roy, a Year 3 verified mentor, ranks #1 with a score of 92.5 out of 100!  
  Crucially, look at the algorithmic breakdown: our 4 transparent score bars show 100% semantic alignment, 100% concept graph coverage, 50% free slot overlap, and 100% senior fit. And right here is the deterministic reason: 'covers ml; verified year-3 mentor; 1 shared free slot'. This directly answers Round 1 feedback &mdash; the AI matching clearly works, explains itself, and is fully transparent."*

---

### 2:30 - 3:15 &bull; Privacy-Preserving Connection & Acceptance
- **On Screen:** On Ananya's card, click "Connect Request" -> Navigate to `/connections`.
- **What to Say:**  
  *"Aarav clicks 'Connect Request'. Notice under Outgoing Requests, Ananya's email is shielded with bullet points. We don't leak contacts until both parties agree.  
  Now, using our one-click role switcher in the navbar, let's switch to Ananya Roy, the senior mentor. In her Incoming inbox, she sees Aarav's request. She clicks 'Accept & Share Contact'. Boom &mdash; contact details are instantly unlocked for both students. Privacy guaranteed."*

---

### 3:15 - 3:45 &bull; Academic Notes Library
- **On Screen:** Click `/library` in the navbar -> Search `dbms` -> Click `Placements` filter pill.
- **What to Say:**  
  *"CampusLink also includes a verified Notes Library. Seniors graduate, but their knowledge stays. Students can search verified semester notes, filter by domain, or upload peer-reviewed problem sheets."*

---

### 3:45 - 4:30 &bull; Architecture & Evaluation Benchmark
- **On Screen:** Open `docs/evaluation.md` on GitHub or in VS Code.
- **What to Say:**  
  *"Under the hood, CampusLink pairs a Next.js 16 Dark Tech frontend with a high-performance FastAPI backend and Supabase PostgreSQL with Row Level Security. On our 9-request benchmark against a traditional keyword search baseline, CampusLink achieved 100% Hit@1 &mdash; a 28.5% improvement &mdash; and a 33.6% improvement in precision."*

---

### 4:30 - 5:00 &bull; Roadmap & Closing
- **On Screen:** Return to the landing page or GitHub repo.
- **What to Say:**  
  *"CampusLink turns fragmented campus communication into intelligent, privacy-first collaboration. Both the GitHub repository and live deployment links are in the submission. Thank you!"*

