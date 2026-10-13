# Agentic Dating

Agents read **only** a person’s public LinkedIn and Instagram, build a profile (needs, hobbies, interests, qualities), date other agents on their behalf, and produce **per-person match rankings**.

## Overall explanation (≤200 chars)

Agents scrape public LinkedIn/Instagram, analyze each person, simulate agent-to-agent dates, and rank best matches—Next.js on Vercel, Node API on Hostinger.

## Tech stack (LinkedIn / Instagram)

| Layer | Open-source stack |
|--------|-------------------|
| HTTP fetch | Native `fetch` with browser User-Agent |
| HTML parsing | [Cheerio](https://github.com/cheeriojs/cheerio) — Open Graph, meta description, JSON-LD, body excerpt |
| Analysis & agent dates | [OpenAI API](https://github.com/openai/openai-node) (`gpt-4o-mini`) when `OPENAI_API_KEY` is set; offline heuristics + scripted agent dialogues otherwise |
| Storage | JSON file (`backend/data/state.json`) — no proprietary DB |
| Frontend | [Next.js 14](https://github.com/vercel/next.js) + Tailwind CSS |
| Backend | [Express](https://github.com/expressjs/express) + TypeScript |

**Note:** LinkedIn and Instagram often gate full HTML behind login. The harness uses **public** page signals only (OG tags + visible excerpt) and surfaces scrape warnings on each profile—matching the brief’s two-source rule without paid scraping APIs.

## Repo layout

```
frontend/   → deploy to Vercel (root directory: frontend)
backend/    → deploy to Hostinger Node app (root: backend)
```

## Local development

```bash
# Terminal 1 — API
cd backend
cp .env.example .env
npm install
npm run dev

# Terminal 2 — Web
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000 → **Load demo & open rankings** (25 people, 300 agent dates) or paste your own LinkedIn + Instagram links.

Optional richer analysis:

```bash
# in backend/.env
OPENAI_API_KEY=sk-...
```

Pre-seed demo on the server:

```bash
cd backend && npm run seed
```

## Deploy frontend (Vercel)

1. Import repo, set **Root Directory** to `frontend`.
2. Environment: `NEXT_PUBLIC_API_URL=https://your-hostinger-api.example.com`
3. Deploy.

## Deploy backend (Hostinger)

1. Upload / git-pull `backend` on your Node hosting plan.
2. `npm install && npm run build`
3. Start command: `npm start` (uses `PORT` from panel).
4. Environment variables:
   - `FRONTEND_URL=https://your-vercel-app.vercel.app`
   - `CORS_ALLOW_ALL=true` (optional if you have multiple preview URLs)
   - `OPENAI_API_KEY` (optional)
   - `DATA_DIR=/path/to/persistent/data` (keep rankings across restarts)
5. Run once: `npm run seed` to populate the **demo link** state for reviewers.

## API (summary)

- `POST /api/people` — `{ linkedinUrl, instagramUrl }` → scrape + analyze
- `GET /api/people/:id` — profile analysis
- `POST /api/demo/load` — 25 people with analyses
- `POST /api/demo/run-dating` — all pairwise agent dates
- `GET /api/rankings` — sorted matches per person
- `GET /api/dates/:id` — agent date transcript

## Hand-in checklist

| Item | Where |
|------|--------|
| Live website | Vercel URL + Hostinger API |
| Demo (pre-run) | Home → **Load demo & open rankings** (or seeded server) |
| GitHub | Public repo root |
| Video | Show profile analysis → agent date transcript → rankings (≤3 min) |

## License

MIT — see [LICENSE](LICENSE).
