import { ManagePeople } from "@/components/ManagePeople";
import { PersonCard } from "@/components/PersonCard";
import { Reveal } from "@/components/Reveal";
import { RunDatingButton } from "@/components/RunDatingButton";
import { api } from "@/lib/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  let people: Awaited<ReturnType<typeof api.listPeople>>["people"] = [];
  let error: string | null = null;
  try {
    ({ people } = await api.listPeople());
  } catch (e) {
    error = e instanceof Error ? e.message : "Backend unreachable";
  }

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.28em] text-blush/90">Roster</p>
          <h1 className="font-display text-4xl md:text-5xl">People & agents</h1>
          <p className="max-w-2xl text-white/60">
            Each card opens the agent-built profile: needs, hobbies, interests, qualities, and how
            their agent behaves on dates.
          </p>
          {people.length > 0 && (
            <Link
              href="#manage-people"
              className="inline-flex text-sm text-rose transition hover:text-white"
            >
              Jump to remove people →
            </Link>
          )}
        </div>
      </Reveal>
      {people.filter((p) => p.status === "ready").length >= 2 && (
        <Reveal delay={1}>
          <RunDatingButton />
        </Reveal>
      )}
      {error && <p className="text-sm text-red-300">{error}</p>}
      {people.length === 0 && !error ? (
        <Reveal>
          <p className="text-sm text-white/60">
            No people yet — use the home page demo or paste LinkedIn + Instagram links.
          </p>
        </Reveal>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p, i) => (
            <Reveal key={p.id} delay={(Math.min(i % 6, 5) as 0 | 1 | 2 | 3 | 4 | 5)}>
              <PersonCard person={p} />
            </Reveal>
          ))}
        </div>
      )}

      {people.length > 0 && (
        <Reveal>
          <ManagePeople people={people} />
        </Reveal>
      )}
    </div>
  );
}
