import Link from "next/link";
import { Reveal } from "@/components/Reveal";

const steps = [
  {
    n: "01",
    title: "Two links",
    body: "Provide exactly two public sources: LinkedIn + Instagram — or load the 25-person demo.",
  },
  {
    n: "02",
    title: "Public scrape",
    body: "The backend fetches public HTML and extracts Open Graph / page text with Cheerio. No paid scrapers.",
  },
  {
    n: "03",
    title: "Agent analysis",
    body: "An analyzer builds needs, hobbies, interests, qualities, and an agent persona (OpenAI if configured).",
  },
  {
    n: "04",
    title: "Agents date",
    body: "For each pair, dating agents converse, score compatibility, and store a full transcript.",
  },
  {
    n: "05",
    title: "Rankings",
    body: "Matches are sorted per person using those agent date scores — best fits first.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-12">
      <Reveal>
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-blush/90">Guide</p>
          <h1 className="font-display text-4xl md:text-5xl">How it works</h1>
          <p className="text-white/60">
            The product is the pipeline — not a static brochure. Here’s the journey end to end.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((s, i) => (
          <Reveal key={s.n} delay={(Math.min((i % 5) + 1, 5) as 1 | 2 | 3 | 4 | 5)}>
            <article className="glass glass-hover h-full rounded-3xl p-6">
              <p className="text-xs tracking-[0.2em] text-blush/80">{s.n}</p>
              <h2 className="mt-2 font-display text-2xl">{s.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{s.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <section className="glass space-y-3 rounded-3xl p-7 text-sm text-white/70">
          <h2 className="font-display text-2xl text-white">Deployment split</h2>
          <p>
            <strong className="text-white">Frontend (Vercel):</strong> Next.js app in{" "}
            <code className="text-rose">/frontend</code>. Set{" "}
            <code className="text-rose">NEXT_PUBLIC_API_URL</code> to your Hostinger API URL.
          </p>
          <p>
            <strong className="text-white">Backend (Hostinger):</strong> Node Express API in{" "}
            <code className="text-rose">/backend</code>. Run{" "}
            <code className="text-rose">npm run build && npm start</code>, set{" "}
            <code className="text-rose">FRONTEND_URL</code>, optional{" "}
            <code className="text-rose">OPENAI_API_KEY</code>, persist{" "}
            <code className="text-rose">DATA_DIR</code> for JSON state.
          </p>
          <div className="pt-2">
            <Link href="/#try" className="btn-primary">
              Try it now
            </Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
