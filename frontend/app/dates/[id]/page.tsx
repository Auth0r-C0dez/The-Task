import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let date;
  let people;
  try {
    [{ date }, { people }] = await Promise.all([
      api.getDate(params.id),
      api.listPeople(),
    ]);
  } catch {
    notFound();
  }

  const nameById = new Map(
    people.map((p) => [p.id, p.analysis?.displayName || p.id])
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <Reveal>
        <Link
          href="/dates"
          className="text-sm text-white/55 transition hover:text-white"
        >
          ← All agent dates
        </Link>
      </Reveal>

      <Reveal delay={1}>
        <header className="space-y-3">
          <h1 className="font-display text-4xl leading-tight">
            {nameById.get(date.personAId)}{" "}
            <span className="text-blush">&</span> {nameById.get(date.personBId)}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="chip border-blush/30 text-blush">
              {date.compatibilityScore}% compatibility
            </p>
            <div className="score-bar w-40">
              <span style={{ width: `${date.compatibilityScore}%` }} />
            </div>
          </div>
          <p className="text-white/70">{date.summary}</p>
        </header>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2">
        <Reveal delay={2}>
          <div className="glass glass-hover rounded-3xl p-5">
            <h2 className="mb-3 font-display text-xl">Highlights</h2>
            <ul className="space-y-2 text-sm text-white/80">
              {date.highlights.map((h) => (
                <li key={h}>• {h}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={3}>
          <div className="glass glass-hover rounded-3xl p-5">
            <h2 className="mb-3 font-display text-xl">Concerns</h2>
            <ul className="space-y-2 text-sm text-white/80">
              {date.concerns.length ? (
                date.concerns.map((c) => <li key={c}>• {c}</li>)
              ) : (
                <li className="text-white/45">None flagged</li>
              )}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal delay={4}>
        <div className="glass space-y-4 rounded-3xl p-6">
          <h2 className="font-display text-2xl">Agent date transcript</h2>
          {date.transcript.map((line, i) => (
            <div
              key={i}
              className={`rounded-2xl px-4 py-3 text-sm transition hover:scale-[1.01] ${
                line.speaker === "agent_a"
                  ? "mr-8 border border-violet/35 bg-violet/20"
                  : "ml-8 border border-blush/30 bg-blush/15"
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <p className="mb-1 text-xs uppercase tracking-wide text-white/45">
                {line.speaker === "agent_a"
                  ? `Agent for ${nameById.get(date.personAId)}`
                  : `Agent for ${nameById.get(date.personBId)}`}
              </p>
              <p className="text-white/90 leading-relaxed">{line.message}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
