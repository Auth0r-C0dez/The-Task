export default function HowItWorksPage() {
  return (
    <article className="prose prose-invert max-w-3xl space-y-6">
      <h1 className="font-display text-3xl">How it works</h1>
      <ol className="list-decimal pl-5 space-y-3 text-white/80 text-sm">
        <li>
          You provide exactly two public links: LinkedIn + Instagram (or load the 25-person demo).
        </li>
        <li>
          The backend fetches public HTML, extracts Open Graph / page text with Cheerio (no
          proprietary scrapers).
        </li>
        <li>
          An agent analyzer (OpenAI if configured, otherwise deterministic heuristics) builds needs,
          hobbies, interests, qualities, and an agent persona.
        </li>
        <li>
          For each pair, dating agents converse, score compatibility, and store a transcript.
        </li>
        <li>Rankings sort matches per person using those agent date scores.</li>
      </ol>

      <section className="glass rounded-2xl p-5 text-sm text-white/75 space-y-2">
        <h2 className="font-display text-xl text-white">Deployment split</h2>
        <p>
          <strong>Frontend (Vercel):</strong> Next.js app in <code>/frontend</code>. Set{" "}
          <code>NEXT_PUBLIC_API_URL</code> to your Hostinger API URL.
        </p>
        <p>
          <strong>Backend (Hostinger):</strong> Node Express API in <code>/backend</code>. Run{" "}
          <code>npm run build && npm start</code>, set <code>FRONTEND_URL</code>, optional{" "}
          <code>OPENAI_API_KEY</code>, persist <code>DATA_DIR</code> for JSON state.
        </p>
      </section>
    </article>
  );
}
