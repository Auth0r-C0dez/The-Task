# Agentic Dating

**A working dating product where AI agents represent real people.**  
Each person is found via two public links only — **LinkedIn** + **Instagram**. Their agent reads both, builds a profile, dates other agents, and produces a personal match ranking.

This guide is written so someone with **little or no coding experience** can unzip the project, install what’s needed, run it on a computer, and understand every feature.

### Detailed separate documentation

| Doc | Contents |
|-----|----------|
| **[docs/README.md](./docs/README.md)** | Index of all detailed guides |
| **[docs/01-HOW_TO_RUN.md](./docs/01-HOW_TO_RUN.md)** | Full install, run, use, deploy, troubleshooting |
| **[docs/02-HOW_IT_WORKS.md](./docs/02-HOW_IT_WORKS.md)** | How the product, agents, API, and data flow work |

---

## Table of contents

1. [What this product does](#1-what-this-product-does)
2. [Who this is for](#2-who-this-is-for)
3. [What you need before starting](#3-what-you-need-before-starting)
4. [Project folders (what’s inside)](#4-project-folders-whats-inside)
5. [How the system works (simple)](#5-how-the-system-works-simple)
6. [All features](#6-all-features)
7. [Run on your computer (step by step)](#7-run-on-your-computer-step-by-step)
8. [Using the website after it starts](#8-using-the-website-after-it-starts)
9. [Optional: smarter AI with OpenAI](#9-optional-smarter-ai-with-openai)
10. [Demo of 25 people (already prepared)](#10-demo-of-25-people-already-prepared)
11. [Deploy online (Vercel + Hostinger)](#11-deploy-online-vercel--hostinger)
12. [Hand-in checklist (assignment)](#12-hand-in-checklist-assignment)
13. [Video script suggestion (≤3 minutes)](#13-video-script-suggestion-3-minutes)
14. [Troubleshooting](#14-troubleshooting)
15. [Tech stack (for the technical form)](#15-tech-stack-for-the-technical-form)
16. [API reference (for developers)](#16-api-reference-for-developers)
17. [License](#17-license)

---

## 1. What this product does

| Step | What happens |
|------|----------------|
| 1 | You (or the demo) provide a person’s **official LinkedIn** and **public Instagram** |
| 2 | The system fetches **public page information only** (no login, no private data) |
| 3 | An **agent** analyzes the person: needs, hobbies, interests, qualities, persona |
| 4 | You open a **profile page** and review that analysis |
| 5 | Agents **date each other** on people’s behalf (with a written transcript you can read) |
| 6 | Every person gets a **ranking** of who fits them best |

**Rule of the product:** for every person, there are **exactly two sources** — LinkedIn + Instagram. Nothing else.

**Overall explanation (≤200 characters):**  
> Agents scrape public LinkedIn/Instagram, analyze each person, simulate agent-to-agent dates, and rank best matches—Next.js on Vercel, Node API on Hostinger.

---

## 2. Who this is for

- Someone who received a **ZIP** of this project and needs to run it  
- Reviewers / graders who need a working demo  
- Developers who will deploy frontend (Vercel) and backend (Hostinger)

You do **not** need to understand React or Express to follow the “run on your computer” section.

---

## 3. What you need before starting

Install these once on the computer (Windows is fine):

| Tool | Why | Where to get it |
|------|-----|-----------------|
| **Node.js 18 or newer** | Runs the website and the API | https://nodejs.org (choose **LTS**) |
| **A code editor (optional)** | Easier to edit `.env` files | https://code.visualstudio.com |
| **Internet connection** | First install downloads packages; live scrape needs web access |

After installing Node.js, open a **new** terminal (PowerShell or Command Prompt) and check:

```bash
node -v
npm -v
```

You should see version numbers (e.g. `v20.x.x` and `10.x.x`). If the command is “not recognized”, restart the computer and try again.

**Unzip tip:** Prefer a short path such as `C:\Projects\The-Task`. Very long OneDrive paths can sometimes cause install issues.

**Public GitHub:** https://github.com/Amirm143/The-Task

---

## 4. Project folders (what’s inside)

```
The-Task/
├── frontend/          → The website (Next.js). Users open this in the browser.
├── backend/           → The brain / API (Express). Scraping, agents, dates, rankings.
├── README.md          → This guide
├── SUBMISSION.md      → Form fields for YouTube / demo / GitHub / short explanations
├── LICENSE            → MIT license
└── .gitignore         → Files not committed to Git
```

| Folder | Deploy target | Port when running locally |
|--------|---------------|---------------------------|
| `frontend/` | Vercel | http://localhost:3000 |
| `backend/` | Hostinger Node | http://localhost:4000 |

**Important:** You must run **both** parts. The website alone cannot scrape or date without the API.

More Hostinger detail: see [`backend/DEPLOY.md`](backend/DEPLOY.md).

---

## 5. How the system works (simple)

```
LinkedIn (public)  +  Instagram (public)
              ↓
     Scrape public HTML (titles, descriptions, visible text)
              ↓
     Agent analyzes the person
              ↓
     Profile page (needs · hobbies · interests · qualities)
              ↓
     Agents date each other (score + transcript)
              ↓
     Rankings (best matches per person)
```

**Honest note on “agentic”:**  
This is not a swarm of robots logged into LinkedIn/Instagram.  
It **is** software agents: one analyzer per person, then pairwise agent-to-agent dating dialogues, then rankings. With an OpenAI key the dialogue/analysis is richer; without it, open-source heuristics + template dialogues still run end-to-end.

**Honest note on scraping:**  
LinkedIn and Instagram often hide full pages behind login. The app uses **public signals** (Open Graph tags, meta description, visible excerpt) and may show **warnings** on a profile if a fetch was limited. The **25-person demo** includes pre-built analyses tied to real public URLs so grading still works when platforms block live fetch.

---

## 6. All features

### Core assignment features

| Feature | What you see |
|---------|----------------|
| Two-source intake | Form: LinkedIn URL + Instagram URL only |
| Public scrape | Cheerio parsing of OG/meta/body from both links |
| Agent analysis | Needs, hobbies, interests, qualities, summary, dating preferences, agent persona |
| Profile pages | `/people` list and `/people/[id]` detail |
| Agent dating | Pairwise dates with compatibility score, summary, highlights, concerns |
| Date transcripts | Multi-turn agent dialogue at `/dates` and `/dates/[id]` |
| Rankings | Per-person sorted matches at `/rankings` |
| 25-person demo | Real public figures (Simon Sinek, Gary Vee, Tony Robbins, and more) |
| 300 agent dates | All unique pairs among 25 people (demo) |
| Live path | Paste your own two links → analyze → run dates → rankings |
| How it works page | In-app explanation at `/how-it-works` |

### Extra product features

| Feature | Purpose |
|---------|---------|
| Step-by-step progress UI | Home form and demo show scrape → analyze → date → rank steps |
| Demo loader button | One click: load 25 people + run dating → open rankings |
| Demo status on home | Shows how many people/dates are ready |
| Run all agent dates | Button on People to compute remaining pairs |
| Top dates on profile | Profile page links to that person’s best agent dates |
| Scrape warnings | Profile shows when public HTML was limited |
| Duplicate link handling | Re-adding the same links opens the existing person |
| JSON file storage | No paid database; state in `backend/data/state.json` |
| Optional OpenAI | Richer analysis & dialogues when `OPENAI_API_KEY` is set |
| Offline / no-key mode | Heuristics + scripted dialogues so the product still works |
| CORS + `FRONTEND_URL` | Safe browser calls from the website to the API |
| Seed script | `npm run seed` pre-fills demo for reviewers on a server |
| Deploy docs | `backend/DEPLOY.md` for Hostinger |
| Submission template | `SUBMISSION.md` for YouTube / links / 200 & 500 char fields |

### Website pages

| URL (local) | Purpose |
|-------------|---------|
| http://localhost:3000 | Home: pitch, demo button, add person, recent people |
| /people | All people / agents |
| /people/[id] | Full analysis profile + related dates |
| /dates | All agent dates |
| /dates/[id] | One date: score + full transcript |
| /rankings | Best matches for each person |
| /how-it-works | Product explanation |

---

## 7. Run on your computer (step by step)

You will open **two terminals** (two windows):

- Terminal A = **backend** (API on port 4000)  
- Terminal B = **frontend** (website on port 3000)

### Step A — Backend (API)

1. Open a terminal in the unzipped project folder (the folder that contains `frontend` and `backend`).
2. Go into backend:

```bash
cd backend
```

3. Create your environment file from the example:

**Windows (Command Prompt):**
```bat
copy .env.example .env
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Mac / Linux:**
```bash
cp .env.example .env
```

4. (Optional) Open `backend/.env` in Notepad. Defaults for local use:

```
PORT=4000
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DATA_DIR=./data
CORS_ALLOW_ALL=false
ALLOW_RESET=false
```

5. Install packages (first time only; may take a few minutes):

```bash
npm install
```

6. Start the API:

```bash
npm run dev
```

Leave this window **open**. You should see something like: `Agentic Dating API listening on port 4000`.

**Optional — pre-load the 25-person demo into the API** (another terminal, while API is stopped or after install):

```bash
cd backend
npm run seed
```

This creates 25 people + 300 agent dates in `backend/data/state.json`.

### Step B — Frontend (website)

1. Open a **second** terminal in the project folder.
2. Go into frontend:

```bash
cd frontend
```

3. Create env file:

**Windows (Command Prompt):**
```bat
copy .env.example .env.local
```

**Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.local
```

**Mac / Linux:**
```bash
cp .env.example .env.local
```

4. Confirm `frontend/.env.local` contains exactly:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

(No trailing slash.)

5. Install packages:

```bash
npm install
```

6. Start the website:

```bash
npm run dev
```

7. Open a browser and go to:

**http://localhost:3000**

If the home page says the backend is unreachable, check that Terminal A is still running and that `NEXT_PUBLIC_API_URL` is exactly `http://localhost:4000`.

---

## 8. Using the website after it starts

### Option 1 — Fastest (recommended for demos & grading)

1. On the home page, click **Load demo & open rankings**.  
2. Watch the progress steps (load people → analyses → 300 dates → rankings).  
3. Browse:
   - **People** → open any profile → read needs / hobbies / interests / qualities  
   - On a profile → **Watch agents date** for a transcript  
   - **Dates** → open any date conversation  
   - **Rankings** → see who fits whom best  

### Option 2 — Add your own person

1. On home, paste:
   - a real **LinkedIn** profile URL  
   - a matching **public Instagram** URL  
2. Submit → watch scrape → analyze steps.  
3. Open the new **profile page**.  
4. From **People**, click **Run all agent dates & view rankings**.  
5. Open **Rankings** and a date transcript.

### What “pass” looks like (assignment)

- Profile page shows real analysis (not an empty shell)  
- You can open a date and **watch agents date** (transcript)  
- Rankings exist per person  
- Live site accepts new LinkedIn + Instagram pairs  

---

## 9. Optional: smarter AI with OpenAI

Without a key, everything still works (heuristics + template dialogues).

With a key:

1. Get an API key from OpenAI.  
2. Put it in `backend/.env`:

```
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
```

3. Restart the backend (`Ctrl+C`, then `npm run dev` again).

Analysis and agent-date dialogue quality improve when the key is present.

---

## 10. Demo of 25 people (already prepared)

The repo includes a curated bundle of **25 real public figures**, each with:

- Official LinkedIn URL  
- Public Instagram URL  
- Pre-built analysis fields for reliable demos  

**On a server after deploy**, run once from `backend/`:

```bash
npm run seed
```

This writes demo state (25 people + 300 pairwise agent dates) so reviewers can open the demo link without typing.

**Locally**, the home **Demo** button calls:

- `POST /api/demo/load`  
- `POST /api/demo/run-dating`  

---

## 11. Deploy online (Vercel + Hostinger)

### Frontend → Vercel

1. Import the GitHub repo: https://github.com/Amirm143/The-Task  
2. Set **Root Directory** to `frontend`.  
3. Environment variable:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-HOSTINGER-API-URL` (no trailing slash) |

4. Deploy. Your live site URL becomes the **Live website** / **Demo link** base.

### Backend → Hostinger (Node)

See also [`backend/DEPLOY.md`](backend/DEPLOY.md).

1. Create a Node.js app (Node **18+**).  
2. Use the `backend/` folder as the app root.  
3. Build: `npm install && npm run build`  
4. Start: `npm start`  
5. Environment variables:

| Variable | Meaning |
|----------|---------|
| `PORT` | Usually set by Hostinger |
| `FRONTEND_URL` | Your Vercel URL, e.g. `https://your-app.vercel.app` |
| `CORS_ALLOW_ALL` | `true` if preview URLs hit CORS issues |
| `OPENAI_API_KEY` | Optional |
| `DATA_DIR` | Persistent folder for `state.json` |

6. After first deploy, run:

```bash
npm run seed
```

7. Put the API’s public HTTPS URL into Vercel’s `NEXT_PUBLIC_API_URL`, then redeploy the frontend if needed.

---

## 12. Hand-in checklist (assignment)

| Deliverable | What to submit | Where in this repo |
|-------------|----------------|--------------------|
| YouTube (≤3 min) | Profile analysis → agents dating → rankings; show 25-person example | Fill in `SUBMISSION.md` |
| Demo link | Finished example already run (seeded site) | `SUBMISSION.md` |
| Live website | Site graders can open and paste their own links | `SUBMISSION.md` |
| GitHub | Public repository | https://github.com/Amirm143/The-Task |
| Overall explanation | ≤200 characters | `SUBMISSION.md` (already drafted) |
| Technical section | ≤500 characters on scrape stack | `SUBMISSION.md` (already drafted) |

### Ready-to-paste blurbs

**Overall explanation (≤200 chars):**  
> Agents scrape public LinkedIn/Instagram, analyze each person, simulate agent-to-agent dates, and rank best matches—Next.js on Vercel, Node API on Hostinger.

**Technical section (≤500 chars):**  
> We fetch public profile pages with Node `fetch`, parse Open Graph tags, meta descriptions, JSON-LD, and text excerpts using Cheerio (MIT). No paid scrapers. Profile understanding and agent date dialogues use the OpenAI Node SDK (`gpt-4o-mini`) when `OPENAI_API_KEY` is set; otherwise open-source heuristics and template agent transcripts keep the site fully functional offline. State is persisted in JSON on the Hostinger Node backend. Frontend is Next.js 14 on Vercel calling the REST API with CORS.

---

## 13. Video script suggestion (≤3 minutes)

Grading cares about the **video** most. Suggested order:

| Time | Show |
|------|------|
| 0:00–0:20 | Home page + one-sentence idea (two sources → agents → rankings) |
| 0:20–0:50 | Open one **profile**: needs, hobbies, interests, qualities |
| 0:50–1:40 | Open one **agent date transcript** — agents actually dating |
| 1:40–2:20 | **Rankings** for that person / demo of 25 |
| 2:20–2:50 | Paste flow or “Load demo” + mention live site works |
| 2:50–3:00 | End on rankings / demo link |

Tip: show **one live scrape** (if it works) **plus** the seeded demo rankings so the video never depends only on LinkedIn/Instagram blocking fetch.

---

## 14. Troubleshooting

| Problem | What to try |
|---------|-------------|
| `node` / `npm` not recognized | Reinstall Node LTS, restart PC, open a **new** terminal |
| Website says backend unreachable | Start `backend` first; check `NEXT_PUBLIC_API_URL=http://localhost:4000` |
| Port 3000 or 4000 in use | Close other apps using those ports, or change `PORT` in `backend/.env` |
| `npm install` fails | Delete the `node_modules` folder, run `npm install` again; check internet/proxy |
| Live “add person” looks thin | Platforms blocked full HTML — check scrape warnings; use demo for full grading path |
| Rankings empty | Run demo dating or “Run all agent dates” after people exist |
| CORS errors after deploy | Set `FRONTEND_URL` to your Vercel URL; try `CORS_ALLOW_ALL=true` |
| Demo empty on server | SSH into backend and run `npm run seed` |
| Changes to `.env.local` ignored | Restart `npm run dev` in frontend after editing env |
| Duplicate person error | That link pair already exists — the app should open the existing profile |

---

## 15. Tech stack (for the technical form)

| Layer | Technology |
|-------|------------|
| HTTP fetch | Native Node `fetch` + browser-like User-Agent |
| HTML parsing | Cheerio (Open Graph, meta, JSON-LD, body excerpt) |
| Analysis & agent dates | OpenAI (`gpt-4o-mini`) if key set; else heuristics + template dialogues |
| Storage | JSON file (`backend/data/state.json`) |
| Frontend | Next.js 14 + React + Tailwind CSS |
| Backend | Express + TypeScript |
| Frontend host | Vercel |
| Backend host | Hostinger Node |

---

## 16. API reference (for developers)

Base URL locally: `http://localhost:4000`

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/people` | Body: `{ linkedinUrl, instagramUrl }` → scrape + analyze |
| `GET` | `/api/people` | List people |
| `GET` | `/api/people/:id` | One profile analysis |
| `POST` | `/api/demo/load` | Load 25 demo people |
| `POST` | `/api/demo/run-dating` | Run all pairwise agent dates |
| `GET` | `/api/demo/status` | Demo / counts status |
| `GET` | `/api/rankings` | Sorted matches per person |
| `GET` | `/api/dates` | List dates |
| `GET` | `/api/dates/:id` | One transcript |
| `POST` | `/api/dates/run-all` | Date every ready pair |
| `POST` | `/api/dates/run-pair` | Date one pair |

---

## 17. License

MIT — see [LICENSE](LICENSE).

---

## Quick start (cheat sheet)

```bash
# Terminal 1 — API
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev

# Terminal 2 — Website
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Open **http://localhost:3000** → **Load demo & open rankings** (or browse People / Dates / Rankings if you already ran `npm run seed`).
