import OpenAI from "openai";
import type { PersonAnalysis, RawProfileSources } from "../types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function heuristicAnalysis(raw: RawProfileSources): PersonAnalysis {
  const name =
    raw.linkedinTitle?.split("|")[0]?.trim() ||
    raw.instagramTitle?.replace(/^\(@?[^)]+\)\s*/, "").trim() ||
    "Unknown person";

  const blob = `${raw.linkedinText}\n${raw.instagramText}`.toLowerCase();
  const tags: string[] = [];
  const keywordMap: Record<string, string> = {
    engineer: "technology",
    developer: "software",
    design: "design",
    travel: "travel",
    fitness: "fitness",
    photo: "photography",
    music: "music",
    food: "food",
    founder: "entrepreneurship",
    marketing: "marketing",
    art: "art",
    yoga: "wellness",
  };
  for (const [k, v] of Object.entries(keywordMap)) {
    if (blob.includes(k) && !tags.includes(v)) tags.push(v);
  }
  if (tags.length === 0) tags.push("culture", "conversation");

  return {
    displayName: name.slice(0, 80),
    headline: raw.linkedinTitle?.slice(0, 120),
    needs: [
      "Emotional honesty and consistent communication",
      "Shared curiosity about the world",
      "Respect for personal ambitions and downtime",
    ],
    hobbies: tags.slice(0, 4).map((t) => t.charAt(0).toUpperCase() + t.slice(1)),
    interests: tags,
    qualities: ["Observant", "Warm", "Independent", "Playful"],
    personalitySummary: `Public signals from LinkedIn and Instagram suggest someone oriented toward ${tags.join(", ")}. The agent inferred temperament from bios, captions, and professional cues visible without private data.`,
    datingPreferences: [
      "Values quality time over constant messaging",
      "Open to people with complementary—not identical—hobbies",
      "Prefers slow-burn connection before big commitments",
    ],
    agentPersona: `I advocate for ${name.split(" ")[0] || "my client"} with calm confidence: I ask direct questions, mirror their pace, and filter matches who respect their ${tags[0] || "core"} interests.`,
  };
}

export async function analyzePerson(
  raw: RawProfileSources
): Promise<PersonAnalysis> {
  if (!openai) {
    return heuristicAnalysis(raw);
  }

  const system = `You are an dating-agent analyst. You ONLY use the provided LinkedIn and Instagram public text. Do not invent employers or facts not hinted in the text. Output valid JSON matching the schema.`;

  const user = `LinkedIn URL: ${raw.linkedinUrl}
Instagram URL: ${raw.instagramUrl}

LinkedIn extracted text:
${raw.linkedinText.slice(0, 6000)}

Instagram extracted text:
${raw.instagramText.slice(0, 6000)}

Warnings: ${raw.scrapeWarnings.join("; ") || "none"}

Return JSON:
{
  "displayName": string,
  "headline": string optional,
  "needs": string[3-5],
  "hobbies": string[3-6],
  "interests": string[4-8],
  "qualities": string[4-6],
  "personalitySummary": string (2-3 sentences),
  "datingPreferences": string[3-5],
  "agentPersona": string (how their agent behaves on dates)
}`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return heuristicAnalysis(raw);

  try {
    const parsed = JSON.parse(content) as PersonAnalysis;
    if (!parsed.displayName || !parsed.needs?.length) {
      return heuristicAnalysis(raw);
    }
    return parsed;
  } catch {
    return heuristicAnalysis(raw);
  }
}
