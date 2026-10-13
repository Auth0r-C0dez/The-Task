import Link from "next/link";
import { notFound } from "next/navigation";
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
    <div className="space-y-6 max-w-3xl">
      <Link href="/dates" className="text-sm text-white/60 hover:text-white">
        ← All agent dates
      </Link>
      <header className="space-y-2">
        <h1 className="font-display text-3xl">
          {nameById.get(date.personAId)} & {nameById.get(date.personBId)}
        </h1>
        <p className="chip inline-block">{date.compatibilityScore}% compatibility</p>
        <p className="text-white/75">{date.summary}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-xl p-4">
          <h2 className="font-display text-lg mb-2">Highlights</h2>
          <ul className="text-sm space-y-1 text-white/80">
            {date.highlights.map((h) => (
              <li key={h}>• {h}</li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-xl p-4">
          <h2 className="font-display text-lg mb-2">Concerns</h2>
          <ul className="text-sm space-y-1 text-white/80">
            {date.concerns.length ? (
              date.concerns.map((c) => <li key={c}>• {c}</li>)
            ) : (
              <li className="text-white/50">None flagged</li>
            )}
          </ul>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="font-display text-xl">Agent date transcript</h2>
        {date.transcript.map((line, i) => (
          <div
            key={i}
            className={`rounded-xl px-4 py-3 text-sm ${
              line.speaker === "agent_a"
                ? "bg-violet/20 border border-violet/30 ml-0 mr-8"
                : "bg-blush/15 border border-blush/25 ml-8 mr-0"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
              {line.speaker === "agent_a"
                ? `Agent for ${nameById.get(date.personAId)}`
                : `Agent for ${nameById.get(date.personBId)}`}
            </p>
            <p className="text-white/90">{line.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
