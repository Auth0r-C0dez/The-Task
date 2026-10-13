# Submission template (fill before hand-in)

## YouTube link
https://

## Demo link
https://your-vercel-app.vercel.app (click **Load demo & open rankings**)

## Live website
https://your-vercel-app.vercel.app

## GitHub URL
https://github.com/Amirm143/The-Task

## Overall explanation (0/200)
Agents scrape public LinkedIn/Instagram, analyze each person, simulate agent-to-agent dates, and rank best matches—Next.js on Vercel, Node API on Hostinger.

## Technical section (0/500)
We fetch public profile pages with Node `fetch`, parse Open Graph tags, meta descriptions, JSON-LD, and text excerpts using Cheerio (MIT). No paid scrapers. Profile understanding and agent date dialogues use the OpenAI Node SDK (`gpt-4o-mini`) when `OPENAI_API_KEY` is set; otherwise open-source heuristics and template agent transcripts keep the site fully functional offline. State is persisted in JSON on the Hostinger Node backend. Frontend is Next.js 14 on Vercel calling the REST API with CORS.
