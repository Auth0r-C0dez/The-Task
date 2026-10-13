import Link from "next/link";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function DatesIndexPage() {
  const [{ dates }, { people }] = await Promise.all([
    api.listDates(),
    api.listPeople(),
  ]);

  const nameById = new Map(
    people.map((p) => [p.id, p.analysis?.displayName || p.id])
  );

  const sorted = [...dates].sort(
    (a, b) => b.compatibilityScore - a.compatibilityScore
  );

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Agent dates</h1>
      <p className="text-sm text-white/65 max-w-2xl">
        Agents dated on behalf of their humans—read transcripts and compatibility scores.
      </p>

      {sorted.length === 0 ? (
        <p className="text-white/60 text-sm">No dates yet. Load demo or run dating from API.</p>
      ) : (
        <div className="grid gap-3">
          {sorted.slice(0, 50).map((d) => (
            <Link
              key={d.id}
              href={`/dates/${d.id}`}
              className="glass rounded-xl p-4 hover:border-white/25 block"
            >
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium">
                  {nameById.get(d.personAId)} ↔ {nameById.get(d.personBId)}
                </span>
                <span className="chip">{d.compatibilityScore}%</span>
              </div>
              <p className="text-white/60 text-sm mt-2 line-clamp-2">{d.summary}</p>
            </Link>
          ))}
          {sorted.length > 50 && (
            <p className="text-xs text-white/45">
              Showing top 50 of {sorted.length} agent dates.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
