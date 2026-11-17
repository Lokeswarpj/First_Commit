# CampusLink - AI Matching Engine Evaluation

**FirstCommit '26 | Team EshWar (solo)**  
**Benchmark Target:** FirstCommit Round 1 Judge Feedback &mdash; *"AI matching must clearly work, be explainable, and verifiably outperform keyword search."*

---

## 1. Matching Engine Architecture

The CampusLink AI matching engine employs a hybrid, multi-criteria scoring algorithm specifically structured for campus workflows (peer teammate finding and verified senior mentorship):

$$\text{Score} = 0.45 \cdot \text{Semantic} + 0.30 \cdot \text{Concept Coverage} + 0.15 \cdot \text{Availability} + 0.10 \cdot \text{Fit}$$

| Metric | Formulation | Purpose |
|---|---|---|
| **Semantic** (0.45) | TF-IDF (1-2 grams) cosine similarity on concept-enriched profile docs | Captures domain vocabulary, synonyms, and sub-specialty phrasing |
| **Concept Coverage** (0.30) | Jaccard-weighted concept match (1.0 for direct domain, 0.5 for related domain) | Prevents lexical misses (e.g. matching `NLP` to `RAG` or `Computer Vision` to `Machine Learning`) |
| **Availability** (0.15) | Free-slot Jaccard index: $\frac{\|S_{\text{req}} \cap S_{\text{cand}}\|}{\|S_{\text{req}} \cup S_{\text{cand}}\|}$ | Ensures matched students actually share mutually free timeslots |
| **Fit** (0.10) | Mentorship: $1.0$ if verified mentor AND $\text{year}_{\text{cand}} > \text{year}_{\text{req}}$, else $0.2$. Teammate: $1.0$ if $\|\Delta \text{year}\| \le 1$, else $0.6$ | Restricts mentorship to verified upperclassmen and teammate finding to cohort peers |

---

## 2. Quantitative Evaluation: 9 Labelled Benchmark Requests

We evaluated CampusLink's hybrid matcher against a standard **Keyword Baseline** (simulating current WhatsApp / Telegram campus chat searches that match exact tokens in student bios).

Ground-truth relevance labels were assigned to each student candidate across 9 realistic campus requests prior to test execution.

### Overall Performance Summary

| Metric | Keyword Baseline | CampusLink Hybrid Matcher | Relative Improvement |
|---|---|---|---|
| **Hit@1** (% top result relevant) | **77.8%** (7/9) | **100.0%** (9/9) | **+28.5%** |
| **Precision@3** (mean relevant in top 3) | **44.4%** | **59.3%** | **+33.6%** |
| **Recall@3** (mean relevant recalled in top 3) | **74.1%** | **94.4%** | **+27.4%** |

### Per-Request Benchmark Breakdown

| ID | Kind | Query Text | Relevant Ground Truth | Baseline Top 3 | Matcher Top 3 | Matcher Hit@1 | Matcher Recall@3 |
|---|---|---|---|---|---|:---:|:---:|
| **R1** | Teammate | "Need a frontend developer for a hackathon, comfortable with React" | P02, P10 | P10, P02, P01 | P10, P02, P06 | ✅ Yes | 100% |
| **R2** | Mentor | "Looking for a senior mentor in machine learning to guide my mini project" | P01, P07, P11 | P01, P06, P07 | P01, P07, P11 | ✅ Yes | 100% |
| **R3** | Teammate | "Need someone good at app UI design for our hackathon project" | P03, P10 | P03, P10, P15 | P03, P10, P15 | ✅ Yes | 100% |
| **R4** | Mentor | "Need help with DBMS and SQL for upcoming exams" | P05, P12 | P05, P01, P02 | P05, P02, P12 | ✅ Yes | 100% |
| **R5** | Teammate | "Want a teammate to build a chatbot using LLMs for an internship project" | P08, P11 | P01, P02, P03 *(missed both)* | P11, P01, P07 | ✅ Yes | 50% |
| **R6** | Mentor | "How do I prepare for placements and coding rounds? Need a senior to guide me" | P05, P13 | P13, P05, P12 | P13, P05, P12 | ✅ Yes | 100% |
| **R7** | Teammate | "Need a mobile app developer for a cross platform app" | P04 | P03, P04, P01 | P04, P03, P02 | ✅ Yes | 100% |
| **R8** | Teammate | "Looking for someone with computer vision and OpenCV for a vital signs project" | P07 | P07, P01, P02 | P07, P01, P15 | ✅ Yes | 100% |
| **R9** | Teammate | "Need a backend API developer, Python preferred" | P08, P12 | P08, P01, P09 | P08, P12, P02 | ✅ Yes | 100% |

---

## 3. Qualitative Evaluation: 5 Unseen Campus Queries

To ensure the matcher does not overfit to the 9 labelled tests, we executed 5 completely unseen queries against the newly expanded 30-student profile pool (`supabase/seed.sql`):

### Query 1 (Teammate - DevOps / Backend)
> *"Looking for someone to help me learn Docker and deploy my first containerized backend"*
- **1. Vikram Singh (Year 2, Score: 90.0)** &mdash; `covers backend, devops; year 2; 1 shared free slot(s)`
- **2. Priya Menon (Year 3, Score: 62.8)** &mdash; `covers devops; related strength in devops; year 3; 2 shared free slot(s)`
- **3. Rohit Verma (Year 4, Score: 61.4)** &mdash; `covers backend, devops; year 4; 1 shared free slot(s)`
- **Observation:** Accurately surfaced containerized backend developers and appropriately favored cohort peer Vikram for a teammate role.

### Query 2 (Mentor - Competitive Programming / Placement Drive)
> *"Need a senior mentor in competitive programming and dynamic programming for upcoming campus drive"*
- **1. Karthik Bhat (Year 4, Score: 100.0)** &mdash; `covers placement; verified year-4 mentor; 2 shared free slot(s)`
- **2. Lavanya Sundaram (Year 3, Score: 86.3)** &mdash; `covers placement; verified year-3 mentor; 1 shared free slot(s)`
- **3. Siddharth Roy (Year 3, Score: 61.0)** &mdash; `covers placement; verified year-3 mentor; 2 shared free slot(s)`
- **Observation:** Strict enforcement of verified senior mentors (`is_mentor = True` and `year > 2`). Junior students with C++ skills were filtered out.

### Query 3 (Teammate - Hardware & IoT)
> *"Building an IoT weather station with Arduino and sensors, need a collaborator"*
- **1. Pooja Hegde (Year 1, Score: 100.0)** &mdash; `covers iot; year 1; 2 shared free slot(s)`
- **2. Siddharth Roy (Year 3, Score: 66.7)** &mdash; `covers iot; year 3; no shared slot yet`
- **3. Sneha Kulkarni (Year 2, Score: 25.0)** &mdash; `year 2; 2 shared free slot(s)`
- **Observation:** Cohort alignment correctly rewarded Year 1 student Pooja over Year 3 senior Siddharth for a teammate role.

### Query 4 (Teammate - UI/UX & Mobile Design)
> *"Need a UI/UX designer to create mobile app wireframes and Figma prototype for a healthcare hackathon"*
- **1. Riya Sen (Year 2, Score: 100.0)** &mdash; `covers design, mobile; year 2; 2 shared free slot(s)`
- **2. Sneha Kulkarni (Year 2, Score: 88.8)** &mdash; `covers design, mobile; year 2; 1 shared free slot(s)`
- **3. Yash Singhania (Year 2, Score: 58.6)** &mdash; `covers mobile; year 2; 1 shared free slot(s)`
- **Observation:** Both Figma designers were ranked top with shared slots, and cross-discipline candidate Yash followed.

### Query 5 (Mentor - NLP & Generative AI)
> *"Looking for an NLP mentor to guide me through fine-tuning BERT and RAG pipelines"*
- **1. Nisha Gupta (Year 4, Score: 100.0)** &mdash; `covers nlp_llm; verified year-4 mentor; 2 shared free slot(s)`
- **2. Tanvi Pillai (Year 4, Score: 92.5)** &mdash; `covers nlp_llm; verified year-4 mentor; 2 shared free slot(s)`
- **3. Ananya Roy (Year 3, Score: 77.6)** &mdash; `covers nlp_llm; verified year-3 mentor; 2 shared free slot(s)`
- **Observation:** Flawless retrieval of verified Year 4 NLP mentors with identical free time availability.

---

## 4. Embeddings Signal Analysis (MiniLM vs. TF-IDF + Concept Layer)

In accordance with Phase 3 guidelines, we analyzed augmenting TF-IDF with `all-MiniLM-L6-v2` dense embeddings:

- **Hit@1 Comparison:** The TF-IDF + Concept Graph layer already reaches **100% Hit@1** on the benchmark. Dense embeddings yielded an identical 100% Hit@1.
- **Latency & Cold Start:** `SentenceTransformer` introduces a ~1.8-second model load overhead on cold starts and requires ~400MB additional memory footprint.
- **Explainability:** TF-IDF + Concept Layer provides 100% deterministic, inspectable token and concept attribution (`covers ml`, `verified senior mentor`, `2 shared slots`).
- **Conclusion:** We keep the lighter, explainable TF-IDF + Concept Graph engine as primary, with the embedding upgrade isolated as an optional drop-in module.

---

## 5. Honest Limitations & Edge Cases

1. **Synthetic Evaluation Scale:** While the 9 labelled queries and 30 profiles test core campus domains, validation on a 1,000+ student body with noisy, colloquial slang will require continuous concept dictionary expansion.
2. **Vocabulary Dependence:** Queries containing brand-new frameworks not yet cataloged in `CONCEPTS` (e.g. `Bun.js` or `Mojo`) fall back to pure character/word n-gram TF-IDF similarity without concept coverage credit.
3. **Discrete Time Slot Granularity:** The availability score relies on 4 coarse bucket slots (`wkday_aft`, `wkday_eve`, `wkend_morn`, `wkend_aft`). Real-world student schedules may have intra-slot conflicts unless integrated with Google Calendar or college timetables.
4. **Subjective Soft Factors:** The engine scores technical capabilities and availability, but cannot measure student personality compatibility, communication style, or past reliability.
