"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function RunDatingButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await api.runAllDates();
      setMsg(`Agent dates ready (${res.created} new, ${res.totalPairs} pairs total).`);
      router.push("/rankings");
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="btn-primary" disabled={loading} onClick={run}>
        {loading ? "Agents are dating…" : "Run all agent dates & view rankings"}
      </button>
      {msg && (
        <span className="text-sm text-white/55 animate-[fade-in_0.4s_ease]">{msg}</span>
      )}
    </div>
  );
}
