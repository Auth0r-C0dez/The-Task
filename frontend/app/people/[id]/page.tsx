import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PersonPage({
  params,
}: {
  params: { id: string };
}) {
  let person;
  let relatedDates: Awaited<ReturnType<typeof api.listDates>>["dates"] = [];
  try {
    ({ person } = await api.getPerson(params.id));
    const datesRes = await api.listDates();
    relatedDates = datesRes.dates
      .filter((d) => d.personAId === params.id || d.personBId === params.id)
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
      .slice(0, 6);
  } catch {
    notFound();
  }

  const a = person.analysis;
  const warnings = person.raw?.scrapeWarnings || [];
  let peopleNames = new Map<string, string>();
  try {
    const { people } = await api.listPeople();
    peopleNames = new Map(
      people.map((p) => [p.id, p.analysis?.displayName || p.id])
    );
  } catch {
    /* ignore */
  }

  return (
    <div className="space-y-10">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3 text-sm text-white/55">
          <Link href="/people" className="transition hover:text-white">
            ← People
          </Link>
          <span className="chip capitalize">{person.status}</span>
          <Link href="/rankings" className="transition hover:text-blush">
            View rankings →
          </Link>
        </div>
      </Reveal>

      {!a ? (
        <Reveal>
          <div className="glass rounded-3xl p-8">
            <h1 className="font-display text-3xl">Agent is working…</h1>
            {person.errorMessage && (
              <p className="mt-2 text-red-300">{person.errorMessage}</p>
            )}
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <header className="space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blush/40 to-violet/40 font-display text-2xl">
                {a.displayName.charAt(0)}
              </div>
              <h1 className="font-display text-4xl md:text-5xl">{a.displayName}</h1>
              {a.headline && <p className="text-lg text-white/70">{a.headline}</p>}
              <p className="max-w-2xl text-sm leading-relaxed text-white/50">
                {a.personalitySummary}
              </p>
            </header>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            <Reveal delay={1}>
              <Section title="Needs" items={a.needs} />
            </Reveal>
            <Reveal delay={2}>
              <Section title="Hobbies" items={a.hobbies} />
            </Reveal>
            <Reveal delay={3}>
              <Section title="Interests" items={a.interests} />
            </Reveal>
            <Reveal delay={4}>
              <Section title="Qualities" items={a.qualities} />
            </Reveal>
            <Reveal delay={5}>
              <Section title="Dating preferences" items={a.datingPreferences} />
            </Reveal>
          </div>

          <Reveal>
            <div className="glass glass-hover rounded-3xl p-7">
              <h2 className="mb-2 font-display text-2xl">Their agent</h2>
              <p className="leading-relaxed text-white/75">{a.agentPersona}</p>
            </div>
          </Reveal>

          {relatedDates.length > 0 && (
            <Reveal>
              <div className="glass rounded-3xl p-7 space-y-4">
                <h2 className="font-display text-2xl">Agent dates (top fits)</h2>
                <ul className="space-y-2 text-sm">
                  {relatedDates.map((d) => {
                    const otherId =
                      d.personAId === params.id ? d.personBId : d.personAId;
                    const other = peopleNames.get(otherId) || otherId;
                    return (
                      <li
                        key={d.id}
                        className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 transition hover:border-blush/30"
                      >
                        <span className="chip text-blush border-blush/30">
                          {d.compatibilityScore}%
                        </span>
                        <span className="text-white/80">vs {other}</span>
                        <Link
                          href={`/dates/${d.id}`}
                          className="ml-auto text-rose transition hover:text-white"
                        >
                          Watch agents date →
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>
          )}

          <Reveal>
            <div className="glass space-y-3 rounded-3xl p-7 text-sm">
              <h2 className="font-display text-xl">Sources (only two)</h2>
              <a
                className="block break-all text-blush transition hover:text-rose"
                href={person.linkedinUrl}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn: {person.linkedinUrl}
              </a>
              <a
                className="block break-all text-blush transition hover:text-rose"
                href={person.instagramUrl}
                target="_blank"
                rel="noreferrer"
              >
                Instagram: {person.instagramUrl}
              </a>
              {warnings.length > 0 && (
                <div className="mt-4 space-y-1 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-amber-100/90">
                  <p className="font-medium text-amber-200">Scrape notes</p>
                  {warnings.map((w) => (
                    <p key={w}>• {w}</p>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </>
      )}
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass glass-hover h-full rounded-3xl p-6">
      <h2 className="mb-4 font-display text-xl">{title}</h2>
      <ul className="space-y-2.5 text-sm text-white/80">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-blush">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
