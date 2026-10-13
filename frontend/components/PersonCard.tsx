import Link from "next/link";
import type { Person } from "@/lib/api";

export function PersonCard({ person }: { person: Person }) {
  const name = person.analysis?.displayName || "Analyzing…";
  return (
    <Link
      href={`/people/${person.id}`}
      className="glass block rounded-2xl p-4 transition hover:border-white/25"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg">{name}</h3>
          <p className="text-xs text-white/55 mt-1 line-clamp-1">
            {person.analysis?.headline || person.linkedinUrl}
          </p>
        </div>
        <span className="chip capitalize">{person.status}</span>
      </div>
      {person.analysis && (
        <div className="mt-3 flex flex-wrap gap-2">
          {person.analysis.interests.slice(0, 4).map((i) => (
            <span key={i} className="chip">
              {i}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
