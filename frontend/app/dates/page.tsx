import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DatesIndexPage() {
  let dates: Awaited<ReturnType<typeof api.listDates>>["dates"] = [];
  let people: Awaited<ReturnType<typeof api.listPeople>>["people"] = [];
  try {
    [{ dates }, { people }] = await Promise.all([api.listDates(), api.listPeople()]);
  } catch {
    /* empty */
  }

  const nameById = new Map(
    people.map((p) => [p.id, p.analysis?.displayName || p.id])
  );

  const sorted = [...dates].sort(
    (a, b) => b.compatibilityScore - a.compatibilityScore
  );

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-blush/90">Transcripts</p>
          <h1 className="font-display text-4xl md:text-5xl">Agent dates</h1>
          <p className="max-w-2xl text-sm text-white/60">
            Agents dated on behalf of their humans—open any conversation and watch the negotiation.
          </p>
        </div>
      </Reveal>

      {sorted.length === 0 ? (
        <Reveal>
          <p className="text-sm text-white/60">No dates yet. Load demo or run dating from People.</p>
        </Reveal>
      ) : (
        <div className="grid gap-3">
          {sorted.slice(0, 50).map((d, i) => (
            <Reveal key={d.id} delay={(Math.min(i % 4, 3) as 0 | 1 | 2 | 3)}>
              <Link
                href={`/dates/${d.id}`}
                className="glass glass-hover block rounded-2xl p-5"
              >
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="font-display text-lg">
                    {nameById.get(d.personAId)}{" "}
                    <span className="text-blush">↔</span> {nameById.get(d.personBId)}
                  </span>
                  <span className="chip text-blush border-blush/30">
                    {d.compatibilityScore}%
                  </span>
                  <div className="score-bar ml-auto hidden w-28 sm:block">
                    <span style={{ width: `${d.compatibilityScore}%` }} />
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-white/55">{d.summary}</p>
              </Link>
            </Reveal>
          ))}
          {sorted.length > 50 && (
            <p className="text-xs text-white/40">Showing top 50 of {sorted.length} agent dates.</p>
          )}
        </div>
      )}
    </div>
  );
}
