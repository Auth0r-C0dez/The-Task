import Link from "next/link";
import { notFound } from "next/navigation";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function PersonPage({
  params,
}: {
  params: { id: string };
}) {
  let person;
  try {
    ({ person } = await api.getPerson(params.id));
  } catch {
    notFound();
  }

  const a = person.analysis;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
        <Link href="/people" className="hover:text-white">
          ← People
        </Link>
        <span className="chip capitalize">{person.status}</span>
      </div>

      {!a ? (
        <div className="glass rounded-2xl p-6">
          <h1 className="font-display text-2xl">Agent is working…</h1>
          {person.errorMessage && (
            <p className="text-red-300 mt-2">{person.errorMessage}</p>
          )}
        </div>
      ) : (
        <>
          <header className="space-y-2">
            <h1 className="font-display text-4xl">{a.displayName}</h1>
            {a.headline && <p className="text-white/70">{a.headline}</p>}
            <p className="text-sm text-white/50">{a.personalitySummary}</p>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <Section title="Needs" items={a.needs} />
            <Section title="Hobbies" items={a.hobbies} />
            <Section title="Interests" items={a.interests} />
            <Section title="Qualities" items={a.qualities} />
            <Section title="Dating preferences" items={a.datingPreferences} />
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-xl mb-2">Their agent</h2>
            <p className="text-white/80 leading-relaxed">{a.agentPersona}</p>
          </div>

          <div className="glass rounded-2xl p-6 text-sm space-y-2">
            <h2 className="font-display text-lg">Sources (only two)</h2>
            <a
              className="block text-blush hover:underline break-all"
              href={person.linkedinUrl}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn: {person.linkedinUrl}
            </a>
            <a
              className="block text-blush hover:underline break-all"
              href={person.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              Instagram: {person.instagramUrl}
            </a>
          </div>
        </>
      )}
    </div>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="font-display text-lg mb-3">{title}</h2>
      <ul className="space-y-2 text-sm text-white/80">
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
