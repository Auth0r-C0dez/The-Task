import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function RankingsPage() {
  let rankings: Awaited<ReturnType<typeof api.rankings>>["rankings"] = [];
  let error: string | null = null;

  try {
    ({ rankings } = await api.rankings());
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load rankings";
  }

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-blush/90">Results</p>
            <h1 className="font-display text-4xl md:text-5xl">Match rankings</h1>
            <p className="max-w-2xl text-sm text-white/60">
              For every person, agents ranked everyone else by compatibility from agent-to-agent
              dates.
            </p>
          </div>
          <Link href="/dates" className="btn-ghost text-sm">
            Watch agent dates
          </Link>
        </div>
      </Reveal>

      {error && <p className="text-sm text-red-300">{error}</p>}

      {rankings.length === 0 ? (
        <Reveal>
          <div className="glass rounded-3xl p-8 text-sm text-white/70">
            No rankings yet. Load the demo from the home page or add people and run agent dating.
          </div>
        </Reveal>
      ) : (
        <div className="space-y-6">
          {rankings.map((block, bi) => (
            <Reveal key={block.personId} delay={(Math.min(bi % 3, 2) as 0 | 1 | 2) || undefined}>
              <section className="glass glass-hover rounded-3xl p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="font-display text-2xl">
                    <Link
                      href={`/people/${block.personId}`}
                      className="transition hover:text-blush"
                    >
                      {block.displayName}
                    </Link>
                  </h2>
                  <span className="text-xs uppercase tracking-wider text-white/40">
                    Best first
                  </span>
                </div>
                <ol className="space-y-3">
                  {block.rankedMatches.slice(0, 8).map((match, idx) => (
                    <li
                      key={match.personId}
                      className="group flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm transition hover:border-blush/30 hover:bg-black/40"
                    >
                      <span className="w-7 font-display text-white/35">#{idx + 1}</span>
                      <Link
                        href={`/people/${match.personId}`}
                        className="min-w-[120px] font-medium transition group-hover:text-blush"
                      >
                        {match.displayName}
                      </Link>
                      <span className="chip border-blush/30 text-blush">
                        {match.compatibilityScore}% fit
                      </span>
                      <div className="score-bar hidden w-24 sm:block">
                        <span style={{ width: `${match.compatibilityScore}%` }} />
                      </div>
                      <span className="flex-1 text-white/55">{match.summary}</span>
                      <Link
                        href={`/dates/${match.dateId}`}
                        className="text-rose transition hover:text-white"
                      >
                        Read date →
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
