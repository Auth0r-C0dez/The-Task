import { AddPersonForm } from "@/components/AddPersonForm";
import { DemoLoader } from "@/components/DemoLoader";
import { HeroVisual } from "@/components/HeroVisual";
import { PersonCard } from "@/components/PersonCard";
import { Reveal } from "@/components/Reveal";
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
    <div className="space-y-24 md:space-y-32">
      {/* Hero — one composition: brand, headline, line, CTAs, visual */}
      <section className="relative grid min-h-[78vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-7">
          <h1 className="animate-hero-brand font-display text-5xl leading-[1.05] tracking-tight md:text-7xl">
            Agentic<span className="text-blush">Dating</span>
          </h1>
          <p className="animate-hero-line max-w-xl font-display text-2xl leading-snug text-white/90 md:text-3xl">
            Your agent reads you. Then it dates for you.
          </p>
          <p className="animate-hero-sub max-w-lg text-base text-white/60 md:text-lg">
            LinkedIn + Instagram only. Agents analyze, date each other, and rank who fits best.
          </p>
          <div className="animate-hero-cta flex flex-wrap items-center gap-3">
            <Link href="/#try" className="btn-primary">
              Start matching
            </Link>
            <Link href="/rankings" className="btn-ghost">
              See rankings
            </Link>
          </div>
          {demoStatus && (
            <p className="animate-hero-cta text-sm text-white/45">
              Live demo · {demoStatus.readyCount} agents ready · {demoStatus.datesCount} dates
              logged
            </p>
          )}
          {apiError && <p className="text-sm text-red-300">{apiError}</p>}
        </div>
        <HeroVisual />
      </section>

      <section id="try" className="scroll-mt-28 space-y-8">
        <Reveal>
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-blush/90">Try it</p>
            <h2 className="font-display text-3xl md:text-4xl">Load the demo — or bring two links</h2>
            <p className="text-white/60">
              Instant demo for graders. Or paste official LinkedIn + public Instagram and watch an
              agent form.
            </p>
          </div>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal delay={1}>
            <DemoLoader />
          </Reveal>
          <Reveal delay={2}>
            <AddPersonForm />
          </Reveal>
        </div>
      </section>

      <section className="space-y-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-blush/90">People</p>
              <h2 className="font-display text-3xl md:text-4xl">Agents already in the room</h2>
            </div>
            <Link href="/people" className="btn-ghost !py-2 !px-4 text-sm">
              View all
            </Link>
          </div>
        </Reveal>
        {people.length === 0 ? (
          <Reveal>
            <p className="text-sm text-white/60">
              No people yet—paste links above or load the 25-person demo.
            </p>
          </Reveal>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {people.slice(0, 6).map((p, i) => (
              <Reveal key={p.id} delay={(Math.min(i, 5) as 0 | 1 | 2 | 3 | 4 | 5)}>
                <PersonCard person={p} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-8">
        <Reveal>
          <div className="max-w-2xl space-y-3">
            <p className="text-xs uppercase tracking-[0.28em] text-blush/90">The journey</p>
            <h2 className="font-display text-3xl md:text-4xl">From two links to a ranking</h2>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Read",
              body: "Agents scrape public LinkedIn & Instagram — needs, hobbies, interests, qualities.",
            },
            {
              step: "02",
              title: "Date",
              body: "Agents meet on their behalf. You watch the transcript, not a black box.",
            },
            {
              step: "03",
              title: "Rank",
              body: "Every person gets a personal leaderboard of who fits them best.",
            },
          ].map((item, i) => (
            <Reveal key={item.step} delay={(Math.min(i + 1, 5) as 1 | 2 | 3)}>
              <div className="glass glass-hover rounded-3xl p-6 h-full">
                <p className="text-xs tracking-[0.2em] text-blush/80">{item.step}</p>
                <h3 className="mt-3 font-display text-2xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={3}>
          <div className="flex flex-wrap gap-3">
            <Link href="/dates" className="btn-primary">
              Watch agents date
            </Link>
            <Link href="/how-it-works" className="btn-ghost">
              How it works
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
