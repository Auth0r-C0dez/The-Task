"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, type Person } from "@/lib/api";

export function ManagePeople({ people }: { people: Person[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return people;
    return people.filter((p) => {
      const name = p.analysis?.displayName?.toLowerCase() || "";
      return (
        name.includes(q) ||
        p.linkedinUrl.toLowerCase().includes(q) ||
        p.instagramUrl.toLowerCase().includes(q)
      );
    });
  }, [people, query]);

  async function removeOne(person: Person) {
    const name = person.analysis?.displayName || person.id;
    const ok = window.confirm(
      `Remove ${name}? Their agent dates with others will also be deleted.`
    );
    if (!ok) return;

    setBusyId(person.id);
    setError(null);
    setMessage(null);
    try {
      const res = await api.removePerson(person.id);
      setMessage(
        `Removed ${name} and ${res.removedDates} related date${
          res.removedDates === 1 ? "" : "s"
        }. ${res.peopleRemaining} people left.`
      );
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove person");
    } finally {
      setBusyId(null);
    }
  }

  if (people.length === 0) return null;

  return (
    <section id="manage-people" className="glass scroll-mt-28 space-y-5 rounded-3xl p-6 md:p-7">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-blush/80">Manage roster</p>
        <h2 className="font-display text-2xl md:text-3xl">Remove people</h2>
        <p className="max-w-2xl text-sm text-white/55">
          Delete anyone you don’t want in the demo or live set. Removing a person also clears their
          agent dates so rankings stay consistent.
        </p>
      </div>

      <label className="block text-sm text-white/75">
        Search
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Name, LinkedIn, or Instagram…"
          className="field-input"
        />
      </label>

      {error && <p className="text-sm text-red-300">{error}</p>}
      {message && <p className="text-sm text-rose">{message}</p>}

      <ul className="divide-y divide-white/10 rounded-2xl border border-white/10 overflow-hidden">
        {filtered.length === 0 ? (
          <li className="px-4 py-5 text-sm text-white/50">No people match that search.</li>
        ) : (
          filtered.map((person) => {
            const name = person.analysis?.displayName || "Untitled person";
            const busy = busyId === person.id;
            return (
              <li
                key={person.id}
                className="flex flex-wrap items-center gap-3 bg-black/20 px-4 py-3 transition hover:bg-black/35"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blush/35 to-violet/35 font-display">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{name}</p>
                  <p className="truncate text-xs text-white/45">
                    {person.analysis?.headline || person.linkedinUrl}
                  </p>
                </div>
                <span className="chip capitalize">{person.status}</span>
                <button
                  type="button"
                  disabled={busy || busyId !== null}
                  onClick={() => removeOne(person)}
                  className="rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/25 hover:border-red-300/50 disabled:opacity-50"
                >
                  {busy ? "Removing…" : "Remove"}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </section>
  );
}
