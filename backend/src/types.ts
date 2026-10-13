export interface RawProfileSources {
  linkedinUrl: string;
  instagramUrl: string;
  linkedinText: string;
  instagramText: string;
  linkedinTitle?: string;
  instagramTitle?: string;
  scrapeWarnings: string[];
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

export type PersonStatus =
  | "pending"
  | "scraping"
  | "analyzing"
  | "ready"
  | "error";

export interface Person {
  id: string;
  linkedinUrl: string;
  instagramUrl: string;
  status: PersonStatus;
  errorMessage?: string;
  raw?: RawProfileSources;
  analysis?: PersonAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface DateExchange {
  speaker: "agent_a" | "agent_b";
  message: string;
}

export interface AgentDateResult {
  id: string;
  personAId: string;
  personBId: string;
  compatibilityScore: number;
  summary: string;
  highlights: string[];
  concerns: string[];
  transcript: DateExchange[];
  createdAt: string;
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

export interface AppState {
  people: Person[];
  dates: AgentDateResult[];
  demoLoaded: boolean;
}
