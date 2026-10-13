"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

const DEMO_STEPS = [
  "Load 25 real public figures (LinkedIn + Instagram)…",
  "Attach agent analyses (needs, hobbies, interests, qualities)…",
  "Run 300 agent-to-agent dates with transcripts…",
  "Build per-person match rankings…",
];

export function DemoLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function loadFullDemo() {
    setLoading(true);
    setError(null);
    setStepIndex(0);
    try {
      setStepIndex(0);
      await api.loadDemo();
      setStepIndex(1);
      setStepIndex(2);
      await api.runDemoDating();
      setStepIndex(3);
      router.push("/rankings");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Demo failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass glass-hover h-full rounded-3xl p-7 space-y-5">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-blush/80">Instant demo</p>
        <h2 className="font-display text-2xl">25 people · 300 dates</h2>
        <p className="text-sm leading-relaxed text-white/60">
          Pre-loaded public LinkedIn + Instagram identities with full agent analysis, dates, and
          rankings—ready without typing a single link.
        </p>
      </div>
      {loading && (
        <ol className="space-y-2 text-sm">
          {DEMO_STEPS.map((label, i) => (
            <li
              key={label}
              className={`flex gap-2 transition-all duration-500 ${
                i <= stepIndex ? "translate-x-0 text-rose opacity-100" : "opacity-30"
              }`}
            >
              <span className="w-4 shrink-0">{i < stepIndex ? "✓" : i === stepIndex ? "→" : "·"}</span>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      )}
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button
        type="button"
        disabled={loading}
        onClick={loadFullDemo}
        className="btn-primary w-full sm:w-auto"
      >
        {loading ? "Preparing demo…" : "Load demo & open rankings"}
      </button>
    </div>
  );
}
