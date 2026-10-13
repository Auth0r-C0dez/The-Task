"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function DemoLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadFullDemo() {
    setLoading(true);
    setError(null);
    try {
      setStep("Loading 25 people with agent analyses…");
      await api.loadDemo();
      setStep("Running agent-vs-agent dates (300 pairs)…");
      await api.runDemoDating();
      setStep("Done");
      router.push("/rankings");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Demo failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-2xl p-6 space-y-3">
      <h2 className="font-display text-xl">Instant demo (25 people)</h2>
      <p className="text-sm text-white/65">
        Pre-loaded public LinkedIn + Instagram identities with full agent analysis, dates, and
        rankings—ready for reviewers without typing links.
      </p>
      {step && loading && <p className="text-sm text-violet-200">{step}</p>}
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button
        type="button"
        disabled={loading}
        onClick={loadFullDemo}
        className="btn-ghost"
      >
        {loading ? "Preparing demo…" : "Load demo & open rankings"}
      </button>
    </div>
  );
}
