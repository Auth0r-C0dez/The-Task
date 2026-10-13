import Link from "next/link";
import type { Person } from "@/lib/api";

export function PersonCard({ person }: { person: Person }) {
  const name = person.analysis?.displayName || "Analyzing…";
  const initial = name.charAt(0).toUpperCase();

  return (
    <Link
      href={`/people/${person.id}`}
      className="glass glass-hover group block rounded-3xl p-5"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blush/40 to-violet/40 font-display text-lg shadow-inner transition group-hover:scale-105">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display text-lg leading-tight transition group-hover:text-blush">
                {name}
              </h3>
              <p className="mt-1 line-clamp-1 text-xs text-white/50">
                {person.analysis?.headline || person.linkedinUrl}
              </p>
            </div>
            <span className="chip capitalize shrink-0">{person.status}</span>
          </div>
        </div>
      </div>
      {person.analysis && (
        <div className="mt-4 flex flex-wrap gap-2">
          {person.analysis.interests.slice(0, 4).map((i) => (
            <span key={i} className="chip">
              {i}
            </span>
          ))}
        </div>
      )}
      <p className="mt-4 text-xs text-white/40 transition group-hover:text-rose">
        Open profile →
      </p>
    </Link>
  );
}
