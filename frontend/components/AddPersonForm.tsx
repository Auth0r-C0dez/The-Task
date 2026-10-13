"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const STEPS = [
  "Validating LinkedIn + Instagram URLs…",
  "Scraping public HTML (Open Graph / meta / excerpt)…",
  "Agent analyzing needs, hobbies, interests, qualities…",
  "Opening profile page…",
];

export function AddPersonForm() {
  const router = useRouter();
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStepIndex(0);
    const tick = window.setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 2));
    }, 1200);
    try {
      const { person } = await api.addPerson(linkedinUrl.trim(), instagramUrl.trim());
      setStepIndex(STEPS.length - 1);
      router.push(`/people/${person.id}`);
      router.refresh();
    } catch (err) {
      const e2 = err as Error & { personId?: string };
      if (e2.personId) {
        router.push(`/people/${e2.personId}`);
        router.refresh();
        return;
      }
      setError(e2.message || "Failed to add person");
    } finally {
      window.clearInterval(tick);
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="glass glass-hover h-full space-y-5 rounded-3xl p-7"
    >
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-blush/80">Live path</p>
        <h2 className="font-display text-2xl">Add a person</h2>
        <p className="text-sm leading-relaxed text-white/60">
          Exactly two sources: public LinkedIn + public Instagram. The agent reads both and builds
          a profile.
        </p>
      </div>
      <label className="block text-sm text-white/80">
        LinkedIn URL
        <input
          required
          type="url"
          placeholder="https://www.linkedin.com/in/username/"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          className="field-input"
        />
      </label>
      <label className="block text-sm text-white/80">
        Instagram URL
        <input
          required
          type="url"
          placeholder="https://www.instagram.com/username/"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          className="field-input"
        />
      </label>
      {loading && (
        <ol className="space-y-2 text-sm">
          {STEPS.map((label, i) => (
            <li
              key={label}
              className={`flex gap-2 transition-all duration-500 ${
                i <= stepIndex ? "text-rose opacity-100" : "opacity-30"
              }`}
            >
              <span className="w-4 shrink-0">{i < stepIndex ? "✓" : i === stepIndex ? "→" : "·"}</span>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      )}
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
        {loading ? "Agent is reading profiles…" : "Analyze & create agent"}
      </button>
    </form>
  );
}
