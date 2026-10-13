"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export function AddPersonForm() {
  const router = useRouter();
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { person } = await api.addPerson(linkedinUrl.trim(), instagramUrl.trim());
      router.push(`/people/${person.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add person");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-2xl p-6 space-y-4">
      <h2 className="font-display text-xl">Add a person (2 links only)</h2>
      <p className="text-sm text-white/65">
        Public LinkedIn + public Instagram. The agent reads both and builds a profile.
      </p>
      <label className="block text-sm">
        LinkedIn URL
        <input
          required
          type="url"
          placeholder="https://www.linkedin.com/in/username/"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 outline-none focus:border-violet"
        />
      </label>
      <label className="block text-sm">
        Instagram URL
        <input
          required
          type="url"
          placeholder="https://www.instagram.com/username/"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          className="mt-1 w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 outline-none focus:border-blush"
        />
      </label>
      {error && <p className="text-sm text-red-300">{error}</p>}
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Agent is reading profiles…" : "Analyze & create agent"}
      </button>
    </form>
  );
}
