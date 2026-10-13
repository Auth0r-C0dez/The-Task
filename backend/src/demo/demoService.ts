import * as store from "../store";
import { createPersonFromSeed } from "../services/personPipeline";
import { runAgentDate } from "../services/dating";
import { allPairs, dateExists } from "../services/rankings";
import { SEED_PEOPLE } from "./seedPeople";
import type { PersonAnalysis } from "../types";

export async function loadDemoBundle(): Promise<{
  message: string;
  people: number;
  skipped: boolean;
}> {
  if (store.isDemoLoaded() && store.getPeople().length >= 25) {
    return {
      message: "Demo already present",
      people: store.getPeople().length,
      skipped: true,
    };
  }

  store.clearAll();

  for (const entry of SEED_PEOPLE) {
    const analysis: PersonAnalysis = {
      displayName: entry.displayName,
      headline: entry.headline,
      needs: entry.needs,
      hobbies: entry.hobbies,
      interests: entry.interests,
      qualities: entry.qualities,
      personalitySummary: entry.personalitySummary,
      datingPreferences: entry.datingPreferences,
      agentPersona: entry.agentPersona,
    };

    createPersonFromSeed({
      linkedinUrl: entry.linkedinUrl,
      instagramUrl: entry.instagramUrl,
      analysis,
      raw: {
        linkedinUrl: entry.linkedinUrl,
        instagramUrl: entry.instagramUrl,
        linkedinText: `${entry.headline}. ${entry.personalitySummary}`,
        instagramText: `Interests: ${entry.interests.join(", ")}. Hobbies: ${entry.hobbies.join(", ")}.`,
        linkedinTitle: entry.displayName,
        instagramTitle: entry.displayName,
        scrapeWarnings: [
          "Demo profile: analysis pre-computed from public LinkedIn/Instagram identity (demo bundle).",
        ],
      },
    });
  }

  store.setDemoLoaded(true);

  return {
    message: "Loaded 25 demo people with agent analyses",
    people: store.getPeople().length,
    skipped: false,
  };
}

export async function runDemoDating(): Promise<{
  totalPairs: number;
  created: number;
  dates: number;
}> {
  const people = store.getPeople();
  if (people.filter((p) => p.status === "ready").length < 2) {
    throw new Error("Load demo people first");
  }

  const dates = store.getDates();
  const pairs = allPairs(people);
  let created = 0;

  for (const [a, b] of pairs) {
    if (dateExists(dates, a.id, b.id)) continue;
    const date = await runAgentDate(a, b);
    store.addDate(date);
    dates.push(date);
    created++;
  }

  return {
    totalPairs: pairs.length,
    created,
    dates: store.getDates().length,
  };
}
