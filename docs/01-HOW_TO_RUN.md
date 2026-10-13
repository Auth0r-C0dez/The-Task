# How to run Agentic Dating

This document explains **only how to install, start, use, and deploy** the project.  
For product/architecture detail, see [02 — How it works](./02-HOW_IT_WORKS.md).

---

## 1. What you will run

The product has **two programs**. Both must be running at the same time:

| Program | Folder | Job | Local address |
|---------|--------|-----|---------------|
| **Backend (API)** | `backend/` | Scraping, agents, dates, rankings, storage | http://localhost:4000 |
| **Frontend (website)** | `frontend/` | Pages you see in the browser | http://localhost:3000 |

If only the website is running, buttons will fail with “backend unreachable”.

---

## 2. Before you start (one-time setup)

### 2.1 Install Node.js

1. Go to https://nodejs.org  
2. Download **LTS** (version 18 or newer).  
3. Install with default options.  
4. **Close and reopen** any terminal / PowerShell window.

Check it worked:

```bash
node -v
npm -v
```

You should see version numbers (example: `v20.11.0` and `10.2.4`).

### 2.2 Get the project files

Either:

- Unzip the project ZIP to a folder, **or**
- Clone from GitHub: https://github.com/Amirm143/The-Task

Example unzip path:

```text
C:\Projects\The-Task
```

Avoid extremely long OneDrive paths if `npm install` keeps failing.

### 2.3 Open a terminal in the project

**Windows**

1. Open the `The-Task` folder in File Explorer.  
2. Click the address bar, type `powershell`, press Enter.  
   Or right-click empty space → “Open in Terminal”.

You should see a prompt whose path ends with `The-Task`.

---

## 3. Create environment files

Environment files tell each app which port / URL to use. Do this once.

### 3.1 Backend `.env`

```bash
cd backend
```

**Windows Command Prompt**

```bat
copy .env.example .env
```

**Windows PowerShell**

```powershell
Copy-Item .env.example .env
```

**Mac / Linux**

```bash
cp .env.example .env
```

Default `backend/.env` (local):

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
DATA_DIR=./data
CORS_ALLOW_ALL=false
ALLOW_RESET=false
```

| Variable | Meaning |
|----------|---------|
| `PORT` | API port (4000 locally) |
| `FRONTEND_URL` | Allowed website origin for CORS |
| `OPENAI_API_KEY` | Optional — richer AI analysis/dates |
| `OPENAI_MODEL` | Model name when key is set |
| `DATA_DIR` | Where `state.json` is saved |
| `CORS_ALLOW_ALL` | Set `true` if deploy CORS blocks Vercel previews |
| `ALLOW_RESET` | Set `true` only if you need `POST /api/admin/reset` |

### 3.2 Frontend `.env.local`

Open a second terminal (or go back to project root), then:

```bash
cd frontend
```

**Windows Command Prompt**

```bat
copy .env.example .env.local
```

**Windows PowerShell**

```powershell
Copy-Item .env.example .env.local
```

**Mac / Linux**

```bash
cp .env.example .env.local
```

Contents of `frontend/.env.local` (local):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Rules:

- No trailing slash  
- Must match the backend URL  
- After changing this file, restart `npm run dev` in frontend  

---

## 4. Install packages (first time)

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

Each command may take a few minutes. You only need this again if `package.json` changes or you delete `node_modules`.

---

## 5. (Recommended) Seed the 25-person demo

From `backend/`:

```bash
cd backend
npm run seed
```

What this does:

- Loads **25** public figures (LinkedIn + Instagram)  
- Runs **300** pairwise agent dates  
- Writes everything to `backend/data/state.json`  

You can also load the demo later from the website button **Load demo & open rankings**.

---

## 6. Start the project (every day)

You need **two terminals**.

### Terminal A — Backend

```bash
cd backend
npm run dev
```

Wait until you see:

```text
Agentic Dating API listening on port 4000
```

Leave this window open.

### Terminal B — Frontend

```bash
cd frontend
npm run dev
```

Wait until you see something like:

```text
Local: http://localhost:3000
```

### Open the site

In your browser go to:

**http://localhost:3000**

---

## 7. Quick start cheat sheet

```bash
# Terminal 1
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev

# Terminal 2
cd frontend
copy .env.example .env.local
npm install
npm run dev
```

Then open http://localhost:3000

---

## 8. Using the running site

### 8.1 Instant demo (best for reviewers)

1. Home page → **Load demo & open rankings**  
2. Wait for progress steps  
3. Explore **People**, **Agent dates**, **Rankings**

### 8.2 Add your own person

1. On Home, paste:
   - LinkedIn URL  
   - Public Instagram URL  
2. Click **Analyze & create agent**  
3. Open the profile page  
4. Go to **People** → **Run all agent dates & view rankings**

### 8.3 Remove people

1. Open **People**  
2. Scroll to **Manage roster → Remove people** (or use “Jump to remove people”)  
3. Search if needed → **Remove** → confirm  
4. Related agent dates are deleted automatically  

### 8.4 Pages map

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Hero, demo, add person |
| People | `/people` | All agents + remove section |
| Profile | `/people/[id]` | Needs, hobbies, interests, qualities |
| Dates | `/dates` | List of agent dates |
| Date detail | `/dates/[id]` | Full transcript |
| Rankings | `/rankings` | Best matches per person |
| How it works | `/how-it-works` | In-app explanation |

---

## 9. Optional OpenAI (richer agents)

Without a key, the app still works (heuristics + template dialogues).

With a key:

1. Put the key in `backend/.env`:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
```

2. Stop backend (`Ctrl+C`) and start again:

```bash
npm run dev
```

---

## 10. Production build (optional local check)

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm start
```

For day-to-day development, prefer `npm run dev` (auto-reload).

---

## 11. Deploy online

### 11.1 Frontend → Vercel

1. Import https://github.com/Amirm143/The-Task  
2. Set **Root Directory** = `frontend`  
3. Environment:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_API_URL` | `https://YOUR-API-URL` (no slash at end) |

4. Deploy  

### 11.2 Backend → Hostinger Node

See also [`backend/DEPLOY.md`](../backend/DEPLOY.md).

1. Node.js app, root = `backend/`  
2. Build: `npm install && npm run build`  
3. Start: `npm start`  
4. Env vars:

| Variable | Example |
|----------|---------|
| `PORT` | From Hostinger panel |
| `FRONTEND_URL` | `https://your-app.vercel.app` |
| `CORS_ALLOW_ALL` | `true` if needed |
| `OPENAI_API_KEY` | Optional |
| `DATA_DIR` | Persistent path, e.g. `./data` |

5. After first deploy:

```bash
npm run seed
```

6. Point Vercel `NEXT_PUBLIC_API_URL` at the API HTTPS URL and redeploy frontend if needed.

---

## 12. Useful npm scripts

### Backend (`backend/`)

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Dev server with auto-reload |
| `npm run build` | Compile TypeScript → `dist/` |
| `npm start` | Run compiled server |
| `npm run seed` | Load 25 people + 300 dates |

### Frontend (`frontend/`)

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Lint |

---

## 13. Troubleshooting

| Problem | Fix |
|---------|-----|
| `node` / `npm` not recognized | Reinstall Node LTS, restart PC, open a **new** terminal |
| Backend unreachable on website | Start `backend` first; check `NEXT_PUBLIC_API_URL=http://localhost:4000` |
| Port 3000 or 4000 already in use | Close the other app using that port, or change `PORT` in `backend/.env` |
| `npm install` fails | Delete `node_modules`, retry; check internet/proxy; try shorter folder path |

| Blank page / 500 after big UI change | Stop frontend, delete `frontend/.next`, run `npm run dev` again |
| Rankings empty | Load demo or click **Run all agent dates** |
| Live add-person looks thin | LinkedIn/IG blocked public HTML — check scrape warnings; use demo for full grading |
| CORS errors after deploy | Set `FRONTEND_URL` to Vercel URL; try `CORS_ALLOW_ALL=true` |
| Demo empty on server | SSH into backend → `npm run seed` |
| Removed someone by mistake | Home → **Load demo & open rankings** (or re-seed) |

### Stop the servers

In each terminal press:

```text
Ctrl + C
```

---

## 14. Hand-off checklist (for a ZIP recipient)

- [ ] Node.js LTS installed  
- [ ] Unzipped / cloned project  
- [ ] Created `backend/.env` from `.env.example`  
- [ ] Created `frontend/.env.local` from `.env.example`  
- [ ] Ran `npm install` in both folders  
- [ ] Ran `npm run seed` in backend (optional but recommended)  
- [ ] Started backend `npm run dev`  
- [ ] Started frontend `npm run dev`  
- [ ] Opened http://localhost:3000  

---

## 15. Related docs

- [02 — How it works](./02-HOW_IT_WORKS.md)  
- [Main README](../README.md)  
- [Submission fields](../SUBMISSION.md)  
- [Hostinger deploy notes](../backend/DEPLOY.md)
