const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || res.statusText);
  }
  return res.json() as Promise<T>;
}

export interface PersonAnalysis {
  displayName: string;
  headline?: string;
  needs: string[];
  hobbies: string[];
  interests: string[];
  qualities: string[];
  personalitySummary: string;
  datingPreferences: string[];
  agentPersona: string;
}

export interface Person {
  id: string;
  linkedinUrl: string;
  instagramUrl: string;
  status: string;
  errorMessage?: string;
  analysis?: PersonAnalysis;
  createdAt: string;
}

export interface DateExchange {
  speaker: "agent_a" | "agent_b";
  message: string;
}

export interface AgentDate {
  id: string;
  personAId: string;
  personBId: string;
  compatibilityScore: number;
  summary: string;
  highlights: string[];
  concerns: string[];
  transcript: DateExchange[];
}

export interface RankingEntry {
  personId: string;
  displayName: string;
  compatibilityScore: number;
  dateId: string;
  summary: string;
}

export interface PersonRankings {
  personId: string;
  displayName: string;
  rankedMatches: RankingEntry[];
}

export const api = {
  health: () => request<{ ok: boolean }>("/api/health"),
  listPeople: () => request<{ people: Person[] }>("/api/people"),
  getPerson: (id: string) => request<{ person: Person }>(`/api/people/${id}`),
  addPerson: (linkedinUrl: string, instagramUrl: string) =>
    request<{ person: Person }>("/api/people", {
      method: "POST",
      body: JSON.stringify({ linkedinUrl, instagramUrl }),
    }),
  listDates: () => request<{ dates: AgentDate[] }>("/api/dates"),
  getDate: (id: string) => request<{ date: AgentDate }>(`/api/dates/${id}`),
  runAllDates: () =>
    request<{ totalPairs: number; created: number }>("/api/dates/run-all", {
      method: "POST",
    }),
  rankings: () => request<{ rankings: PersonRankings[] }>("/api/rankings"),
  demoStatus: () =>
    request<{
      demoLoaded: boolean;
      peopleCount: number;
      readyCount: number;
      datesCount: number;
    }>("/api/demo/status"),
  loadDemo: () =>
    request<{ message: string; people: number }>("/api/demo/load", {
      method: "POST",
    }),
  runDemoDating: () =>
    request<{ totalPairs: number; created: number; dates: number }>(
      "/api/demo/run-dating",
      { method: "POST" }
    ),
};
