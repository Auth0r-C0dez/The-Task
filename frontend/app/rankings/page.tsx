import Link from "next/link";
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Match rankings</h1>
          <p className="text-sm text-white/65 mt-2 max-w-2xl">
            For every person, agents ranked everyone else by compatibility scores from agent-to-agent
            dates.
          </p>
        </div>
        <Link href="/dates" className="btn-ghost text-sm">
          Watch agent dates
        </Link>
      </div>

      {error && <p className="text-red-300 text-sm">{error}</p>}

      {rankings.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-sm text-white/70">
          No rankings yet. Load the demo from the home page or add people and run agent dating.
        </div>
      ) : (
        <div className="space-y-6">
          {rankings.map((block) => (
            <section key={block.personId} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-display text-xl">
                  <Link href={`/people/${block.personId}`} className="hover:text-blush">
                    {block.displayName}
                  </Link>
                </h2>
                <span className="text-xs text-white/50">Best matches first</span>
              </div>
              <ol className="space-y-3">
                {block.rankedMatches.slice(0, 8).map((match, idx) => (
                  <li
                    key={match.personId}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm"
                  >
                    <span className="w-6 text-white/40">#{idx + 1}</span>
                    <Link
                      href={`/people/${match.personId}`}
                      className="font-medium hover:text-blush min-w-[120px]"
                    >
                      {match.displayName}
                    </Link>
                    <span className="chip text-blush border-blush/30">
                      {match.compatibilityScore}% fit
                    </span>
                    <span className="text-white/60 flex-1">{match.summary}</span>
                    <Link href={`/dates/${match.dateId}`} className="text-violet-300 hover:underline">
                      Read date
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
