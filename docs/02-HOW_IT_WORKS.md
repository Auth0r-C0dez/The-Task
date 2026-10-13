# How Agentic Dating works

This document explains **what the product is**, **how data moves through the system**, and **what each major piece of code does**.  
For install/start steps, see [01 — How to run](./01-HOW_TO_RUN.md).

---

## 1. The idea (assignment)

**Agentic Dating** means:

1. You find real people yourself (at least 25 for the demo).  
2. Each person is represented by **exactly two public sources**:
   - Official **LinkedIn**
   - Public **Instagram**  
3. An **agent** reads both sources and builds a profile (needs, hobbies, interests, qualities, persona).  
4. Agents **date each other** on people’s behalf (with a transcript you can watch).  
5. Every person gets a **ranking** of who fits them best.

Nothing else is used as a source of truth for a person — no Wikipedia, no paid people-data APIs, no private/logged-in scrapes.

---

## 2. Big picture (one diagram)

```text
┌────────────────────┐     ┌────────────────────┐
│  LinkedIn (public) │     │ Instagram (public) │
└─────────┬──────────┘     └──────────┬─────────┘
          │                           │
          └────────────┬──────────────┘
                       ▼
              ┌─────────────────┐
              │  Scraper        │  fetch HTML + Cheerio
              │  (OG / meta /   │
              │   body excerpt) │
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │  Analyzer agent │  OpenAI OR heuristics
              │  → profile      │
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │  Profile page   │  /people/[id]
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │  Dating agents  │  pairwise dates + transcript
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │  Rankings       │  /rankings
              └─────────────────┘
```

Website (Next.js) never does the heavy work alone. It calls the **Express API**, which owns scraping, analysis, dating, rankings, and storage.

---

## 3. Two apps, one product

| Layer | Folder | Stack | Responsibility |
|-------|--------|-------|----------------|
| Frontend | `frontend/` | Next.js 14, React, Tailwind | UI, forms, pages, calling API |
| Backend | `backend/` | Express, TypeScript, Cheerio, optional OpenAI | Business logic + JSON storage |

### Why split?

- Frontend can deploy on **Vercel**  
- Backend can deploy on **Hostinger Node**  
- Reviewers can hit a live API independently of the Next.js host  

---

## 4. End-to-end flows

### 4.1 Live path (paste your own links)

1. User submits LinkedIn + Instagram on Home.  
2. Frontend `POST /api/people`.  
3. Backend normalizes URLs.  
4. Status becomes `scraping` → fetches public HTML for both URLs.  
5. Status becomes `analyzing` → builds analysis object.  
6. Status becomes `ready` → profile is viewable.  
7. User runs **Run all agent dates** → `POST /api/dates/run-all`.  
8. Rankings update via `GET /api/rankings`.

### 4.2 Demo path (25 people)

1. User clicks **Load demo & open rankings**, or you run `npm run seed`.  
2. `POST /api/demo/load` inserts 25 pre-analyzed people (real public LinkedIn + IG URLs).  
3. `POST /api/demo/run-dating` creates all unique pairs  
   - Formula for 25 people: `25 × 24 / 2 = 300` dates.  
4. Rankings are available immediately.

### 4.3 Remove person path

1. On **People** → Manage roster → **Remove**.  
2. Frontend `DELETE /api/people/:id`.  
3. Backend deletes that person **and** every date involving them.  
4. Rankings recalculate from remaining dates.

---

## 5. What “agentic” means here (honest)

| It is | It is not |
|-------|-----------|
| Software agents that analyze a person from two sources | Separate bots logged into LinkedIn/Instagram |
| Pairwise agent-to-agent dating dialogues | A multi-agent orchestration framework like AutoGen as the core |
| Compatibility scores + transcripts + rankings | Real-world offline dating events |
| Optional OpenAI for richer language | Required paid API to function |

Without `OPENAI_API_KEY`, open-source **heuristics** + **template dialogues** still run the full product so demos never hard-depend on a paid key.

---

## 6. Scraping (LinkedIn + Instagram)

**File:** `backend/src/services/scraper.ts`

### Steps

1. Normalize URLs (accept `http`-less links, `@handle` for Instagram, strip query strings).  
2. `fetch` each page with a browser-like `User-Agent` (20s timeout).  
3. Parse HTML with **Cheerio**:
   - Open Graph title / description  
   - Meta description  
   - JSON-LD blocks (truncated)  
   - Body text excerpt (trimmed)  
4. If fetch fails or content is thin, still continue using URL identity + warnings.

### Important limitation

LinkedIn and Instagram often show login walls for full profiles.  
The harness only uses **publicly visible** signals and surfaces **scrape warnings** on the profile page.  
The 25-person demo uses **pre-computed analyses** tied to real public URLs so grading still works when live fetch is blocked.

---

## 7. Analyzer agent (profile building)

**File:** `backend/src/services/analyzer.ts`  
**Pipeline:** `backend/src/services/personPipeline.ts`

### Output fields (shown on `/people/[id]`)

| Field | Meaning |
|-------|---------|
| `displayName` | Name shown in UI |
| `headline` | Short role/line |
| `needs` | What they need in connection |
| `hobbies` | Activities |
| `interests` | Topics / themes |
| `qualities` | Character traits |
| `personalitySummary` | Short paragraph |
| `datingPreferences` | What their agent seeks |
| `agentPersona` | How the dating agent speaks/behaves |

### Modes

1. **OpenAI mode** — if `OPENAI_API_KEY` is set, sends scraped text to `gpt-4o-mini` (configurable) and parses JSON.  
2. **Heuristic mode** — derives tags from titles/text and fills structured fields without an API call.

Person status lifecycle:

```text
pending → scraping → analyzing → ready
                              ↘ error
```

---

## 8. Dating agents

**File:** `backend/src/services/dating.ts`

### Pair rule

For people A and B (both `ready`), create **one** undirected date (A–B is the same as B–A).

### Each date result includes

| Field | Purpose |
|-------|---------|
| `compatibilityScore` | 0–100 style fit score |
| `summary` | Short outcome text |
| `highlights` | What worked |
| `concerns` | Friction points |
| `transcript` | Multi-turn dialogue between Agent A and Agent B |

### Modes

1. **OpenAI** — richer negotiation dialogue when key exists.  
2. **Template / heuristic** — score from shared interests/hobbies + scripted agent back-and-forth so transcripts are always watchable.

UI: `/dates` list and `/dates/[id]` transcript bubbles.

---

## 9. Rankings

**File:** `backend/src/services/rankings.ts`

For each ready person:

1. Find every date involving them.  
2. Collect the other person’s score.  
3. Sort **highest compatibility first**.  
4. Expose via `GET /api/rankings` and `/rankings` page.

Removing a person deletes their dates, so their row disappears and others’ lists lose that match.

---

## 10. Demo bundle (25 real people)

| Piece | Location |
|-------|----------|
| Seed identities + analyses | `backend/src/demo/seedPeople.ts` |
| Load + run dating helpers | `backend/src/demo/demoService.ts` |
| CLI seed script | `backend/src/scripts/seedDemo.ts` |

Each seed entry has:

- LinkedIn slug / Instagram handle (built into full URLs)  
- Pre-filled needs, hobbies, interests, qualities, persona  

Why pre-filled analyses?

- Reviewers get a reliable **finished example**  
- Live platform blocking doesn’t break the demo video / demo link  

---

## 11. Storage

**File:** `backend/src/store.ts`  
**Default file:** `backend/data/state.json`  
**Override folder:** `DATA_DIR` env var  

### State shape

```json
{
  "people": [ /* Person objects */ ],
  "dates": [ /* AgentDateResult objects */ ],
  "demoLoaded": true
}
```

No proprietary database. JSON is enough for the assignment and Hostinger Node hosting.

Note: `backend/data/state.json` is gitignored — use `npm run seed` or the demo button to recreate it.

---

## 12. Backend API map

Base URL (local): `http://localhost:4000`

| Method | Path | What it does |
|--------|------|----------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/people` | List people |
| `GET` | `/api/people/:id` | One person |
| `POST` | `/api/people` | Scrape + analyze new person |
| `DELETE` | `/api/people/:id` | Remove person + their dates |
| `GET` | `/api/dates` | List dates |
| `GET` | `/api/dates/:id` | One transcript |
| `POST` | `/api/dates/run-pair` | Date one pair |
| `POST` | `/api/dates/run-all` | Date all ready pairs |
| `GET` | `/api/rankings` | Per-person rankings |
| `GET` | `/api/demo/status` | Counts / demo flag |
| `POST` | `/api/demo/load` | Load 25 demo people |
| `POST` | `/api/demo/run-dating` | Run demo dates |
| `POST` | `/api/admin/reset` | Wipe state (only if `ALLOW_RESET=true`) |

CORS allows `FRONTEND_URL`, localhost:3000, and optionally all origins when `CORS_ALLOW_ALL=true`.

---

## 13. Frontend structure

| Path | Role |
|------|------|
| `frontend/app/page.tsx` | Home hero, demo, add person, people preview |
| `frontend/app/people/page.tsx` | Roster + manage/remove section |
| `frontend/app/people/[id]/page.tsx` | Full analysis + top dates |
| `frontend/app/dates/page.tsx` | Date list |
| `frontend/app/dates/[id]/page.tsx` | Transcript |
| `frontend/app/rankings/page.tsx` | Match leaderboards |
| `frontend/app/how-it-works/page.tsx` | In-app explanation |
| `frontend/lib/api.ts` | Typed API client |
| `frontend/components/DemoLoader.tsx` | One-click demo |
| `frontend/components/AddPersonForm.tsx` | Live intake + progress steps |
| `frontend/components/ManagePeople.tsx` | Search + remove people |
| `frontend/components/RunDatingButton.tsx` | Run all pairs |
| `frontend/components/Reveal.tsx` | Scroll-in animations |
| `frontend/components/SiteHeader.tsx` | Sticky nav |
| `frontend/app/globals.css` | Theme, buttons, motion |

The browser never talks to LinkedIn/Instagram directly. All source fetching is server-side in the API.

---

## 14. Backend file map

| Path | Role |
|------|------|
| `src/index.ts` | Express app, CORS, listen |
| `src/routes/api.ts` | All REST routes |
| `src/store.ts` | Read/write JSON state |
| `src/types.ts` | Shared TypeScript types |
| `src/services/scraper.ts` | Fetch + Cheerio extract |
| `src/services/analyzer.ts` | Profile analysis |
| `src/services/dating.ts` | Agent dates |
| `src/services/rankings.ts` | Ranking builder |
| `src/services/personPipeline.ts` | Create/process person |
| `src/demo/*` | 25-person demo |
| `src/scripts/seedDemo.ts` | CLI seed |

---

## 15. UI journey (what graders should see)

Ideal click path for the video / review:

1. **Home** — brand + “25 agents ready · 300 dates”  
2. **People → profile** — needs / hobbies / interests / qualities  
3. **Watch agents date** — multi-turn transcript  
4. **Rankings** — best matches first with scores  
5. Optional: paste two new links or remove someone from Manage roster  

---

## 16. Environment variables (behavior impact)

### Backend

| Variable | Effect |
|----------|--------|
| `PORT` | Listen port |
| `FRONTEND_URL` | CORS allowlist entry |
| `OPENAI_API_KEY` | Enables LLM analysis + richer dating |
| `OPENAI_MODEL` | Which model (default `gpt-4o-mini`) |
| `DATA_DIR` | Where state JSON lives |
| `CORS_ALLOW_ALL` | Loosen CORS for previews |
| `ALLOW_RESET` | Enable wipe endpoint |

### Frontend

| Variable | Effect |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | Where the browser/server components call the API |

---

## 17. Security & ethics notes (for reviewers)

- Only **public** profile pages are requested.  
- No password capture, no Instagram/LinkedIn login automation.  
- Demo uses well-known public figures with public profile URLs.  
- Live “add person” may return thinner analysis if platforms gate HTML — warnings are shown.  
- OpenAI key is optional and should never be committed (`.env` is gitignored).

---

## 18. Assignment deliverables mapping

| Hand-in item | How this project covers it |
|--------------|----------------------------|
| Working site | Frontend + API end-to-end |
| ≥25 real people | Demo seed + demo button |
| Profile analysis | `/people/[id]` |
| Agents dating | `/dates/[id]` transcripts |
| Rankings | `/rankings` |
| Demo link | Seeded deploy + Load demo |
| Live try | Add person form |
| GitHub | https://github.com/Amirm143/The-Task |
| Tech explanation | This doc + `SUBMISSION.md` blurbs |

---

## 19. Related docs

- [01 — How to run](./01-HOW_TO_RUN.md)  
- [Main README](../README.md)  
- [Submission template](../SUBMISSION.md)  
- [Hostinger deploy](../backend/DEPLOY.md)
