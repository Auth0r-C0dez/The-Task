import { AddPersonForm } from "@/components/AddPersonForm";
import { DemoLoader } from "@/components/DemoLoader";
import { PersonCard } from "@/components/PersonCard";
import { api } from "@/lib/api";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let people: Awaited<ReturnType<typeof api.listPeople>>["people"] = [];
  let demoStatus: Awaited<ReturnType<typeof api.demoStatus>> | null = null;
  let apiError: string | null = null;

  try {
    const res = await api.listPeople();
    people = res.people;
    demoStatus = await api.demoStatus();
  } catch {
    apiError =
      "Backend unreachable. Set NEXT_PUBLIC_API_URL to your Hostinger API URL.";
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-blush/90">
            Agentic dating harness
          </p>
          <h1 className="font-display text-4xl leading-tight md:text-5xl">
            Your agent reads LinkedIn & Instagram, dates for you, ranks your matches.
          </h1>
          <p className="text-white/70 max-w-xl">
            Two sources only: official LinkedIn and public Instagram. Agents analyze each person,
            negotiate dates agent-to-agent, then produce per-person compatibility rankings.
          </p>
          {demoStatus && (
            <p className="text-sm text-white/55">
              Demo status: {demoStatus.readyCount} ready · {demoStatus.datesCount} agent dates
              logged
            </p>
          )}
          {apiError && <p className="text-red-300 text-sm">{apiError}</p>}
        </div>
        <div className="space-y-4">
          <DemoLoader />
          <AddPersonForm />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-2xl">People & agents</h2>
          <Link href="/people" className="text-sm text-blush hover:underline">
            View all
          </Link>
        </div>
        {people.length === 0 ? (
          <p className="text-white/60 text-sm">
            No people yet—paste links above or load the 25-person demo.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {people.slice(0, 6).map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
