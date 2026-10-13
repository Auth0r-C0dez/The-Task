import { PersonCard } from "@/components/PersonCard";
import { RunDatingButton } from "@/components/RunDatingButton";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const { people } = await api.listPeople();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">People & profile analyses</h1>
      {people.filter((p) => p.status === "ready").length >= 2 && <RunDatingButton />}
      <p className="text-white/65 text-sm max-w-2xl">
        Each card opens the agent-built profile: needs, hobbies, interests, qualities, and how
        their agent behaves on dates.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((p) => (
          <PersonCard key={p.id} person={p} />
        ))}
      </div>
    </div>
  );
}
