# Files changed or added (initial commit → now)

Compared to the original first commit (`5498c5a first commit`) on this repo.  
Status: **M** = modified existing file · **A** = newly added (not in the first commit yet)

---

## Summary

| Kind | Count |
|------|-------|
| Modified | 23 |
| Newly added | 7 |
| **Total touched** | **30** |

---

## Newly added files (A)

| File | Why it was added |
|------|------------------|
| `docs/README.md` | Documentation index |
| `docs/01-HOW_TO_RUN.md` | Detailed how-to-run guide |
| `docs/02-HOW_IT_WORKS.md` | Detailed how-it-works guide |
| `docs/CHANGED_FILES.md` | This list |
| `frontend/components/HeroVisual.tsx` | Hero orbiting-agents visual |
| `frontend/components/ManagePeople.tsx` | Remove-people section on People page |
| `frontend/components/Reveal.tsx` | Scroll-in animation wrapper |
| `frontend/components/SiteHeader.tsx` | Sticky glass navigation |

*(8 new files if counting this list file itself.)*

---

## Modified files (M)

### Docs / root

| File | What changed |
|------|----------------|
| `README.md` | Expanded non-coder guide + links to `docs/` |
| `SUBMISSION.md` | GitHub URL set to `Amirm143/The-Task` |

### Backend

| File | What changed |
|------|----------------|
| `backend/.env.example` | Added `CORS_ALLOW_ALL`, `ALLOW_RESET` |
| `backend/package-lock.json` | Lockfile after `npm install` |
| `backend/src/routes/api.ts` | URL normalize on create; `DELETE /api/people/:id` |
| `backend/src/services/scraper.ts` | Stronger LinkedIn/Instagram URL normalization (exported) |
| `backend/src/store.ts` | `removePerson()` (person + related dates) |

### Frontend — app pages

| File | What changed |
|------|----------------|
| `frontend/app/layout.tsx` | Atmosphere background, `SiteHeader`, footer |
| `frontend/app/globals.css` | Theme, buttons, scroll/hero animations |
| `frontend/app/page.tsx` | Cinematic hero + sections + Reveal |
| `frontend/app/people/page.tsx` | Manage/remove section + polish |
| `frontend/app/people/[id]/page.tsx` | Top dates, scrape warnings, Reveal UI |
| `frontend/app/dates/page.tsx` | Polished list + score bars |
| `frontend/app/dates/[id]/page.tsx` | Polished transcript UI |
| `frontend/app/rankings/page.tsx` | Polished rankings + score bars |
| `frontend/app/how-it-works/page.tsx` | Card layout + Reveal |

### Frontend — components & config

| File | What changed |
|------|----------------|
| `frontend/components/AddPersonForm.tsx` | Progress steps + new field/button styles |
| `frontend/components/DemoLoader.tsx` | Progress steps + primary CTA styling |
| `frontend/components/PersonCard.tsx` | Avatar, hover motion, “Open profile” |
| `frontend/components/RunDatingButton.tsx` | Button polish |
| `frontend/lib/api.ts` | Better errors; `removePerson()` |
| `frontend/tailwind.config.ts` | `rose` color + fade animation |
| `frontend/package-lock.json` | Lockfile after `npm install` |

---

## Full path list (copy/paste)

```text
# Modified
README.md
SUBMISSION.md
backend/.env.example
backend/package-lock.json
backend/src/routes/api.ts
backend/src/services/scraper.ts
backend/src/store.ts
frontend/app/dates/[id]/page.tsx
frontend/app/dates/page.tsx
frontend/app/globals.css
frontend/app/how-it-works/page.tsx
frontend/app/layout.tsx
frontend/app/page.tsx
frontend/app/people/[id]/page.tsx
frontend/app/people/page.tsx
frontend/app/rankings/page.tsx
frontend/components/AddPersonForm.tsx
frontend/components/DemoLoader.tsx
frontend/components/PersonCard.tsx
frontend/components/RunDatingButton.tsx
frontend/lib/api.ts
frontend/package-lock.json
frontend/tailwind.config.ts

# Added
docs/README.md
docs/01-HOW_TO_RUN.md
docs/02-HOW_IT_WORKS.md
docs/CHANGED_FILES.md
frontend/components/HeroVisual.tsx
frontend/components/ManagePeople.tsx
frontend/components/Reveal.tsx
frontend/components/SiteHeader.tsx
```

---

## Not listed (local-only / generated / ignored)

These may exist on disk but are not source changes to commit:

- `backend/node_modules/`, `frontend/node_modules/`
- `backend/dist/`, `frontend/.next/`
- `backend/.env`, `frontend/.env.local`
- `backend/data/state.json` (created by seed/demo; gitignored)

---

## Note

None of these changes are committed yet (still working-tree / untracked).  
Say if you want them committed and pushed to https://github.com/Amirm143/The-Task.
