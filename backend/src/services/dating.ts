import { nanoid } from "nanoid";
import OpenAI from "openai";
import type {
  AgentDateResult,
  DateExchange,
  Person,
  PersonAnalysis,
} from "../types";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

function overlapScore(a: PersonAnalysis, b: PersonAnalysis): number {
  const setA = new Set(
    [...a.interests, ...a.hobbies].map((s) => s.toLowerCase())
  );
  let hits = 0;
  for (const item of [...b.interests, ...b.hobbies]) {
    if (setA.has(item.toLowerCase())) hits++;
  }
  const needSim =
    a.datingPreferences.filter((p) =>
      b.personalitySummary.toLowerCase().includes(p.split(" ")[0]?.toLowerCase() || "")
    ).length * 2;
  return Math.min(95, 45 + hits * 8 + needSim);
}

function templateDate(
  personA: Person,
  personB: Person
): AgentDateResult {
  const a = personA.analysis!;
  const b = personB.analysis!;
  const score = overlapScore(a, b);

  const transcript: DateExchange[] = [
    {
      speaker: "agent_a",
      message: `Hi—I'm ${a.displayName}'s agent. They care about ${a.needs[0]?.toLowerCase() || "trust"}. What does a good week look like for ${b.displayName}?`,
    },
    {
      speaker: "agent_b",
      message: `Great question. ${b.displayName} recharges with ${b.hobbies[0] || "creative time"} and wants ${b.needs[0]?.toLowerCase() || "honesty"}. Your client’s ${a.interests[0] || "interests"}—is that a lifestyle or a weekend thing?`,
    },
    {
      speaker: "agent_a",
      message: `Both, honestly. They're ${a.qualities[0]?.toLowerCase() || " thoughtful"} about it—no performative hustle. How do you handle mismatched schedules?`,
    },
    {
      speaker: "agent_b",
      message: `${b.agentPersona.split(".")[0] || "I keep it direct"}. If vibes align on ${b.interests.slice(0, 2).join(" and ") || "values"}, we can make logistics work.`,
    },
    {
      speaker: "agent_a",
      message: `I'll propose a low-pressure first meet aligned with ${a.hobbies[1] || a.hobbies[0] || "coffee"}—sound fair?`,
    },
    {
      speaker: "agent_b",
      message: `Fair. Score-wise I see ${score}/100 potential—strong on shared ${a.interests[0] && b.interests.includes(a.interests[0]) ? a.interests[0] : "curiosity"}, watch pace on commitment language.`,
    },
  ];

  return {
    id: nanoid(10),
    personAId: personA.id,
    personBId: personB.id,
    compatibilityScore: score,
    summary: `Agents negotiated a ${score}% fit emphasizing ${a.interests.slice(0, 2).join(", ") || "shared values"} vs ${b.interests.slice(0, 2).join(", ") || "complementary traits"}.`,
    highlights: [
      `Shared thread: ${[...new Set([...a.interests, ...b.interests])].slice(0, 2).join(", ") || "open communication"}`,
      `${a.displayName}'s need for ${a.needs[0]?.toLowerCase() || "clarity"} acknowledged by Agent B`,
    ],
    concerns: score < 70 ? ["Different energy on commitment pace"] : [],
    transcript,
    createdAt: new Date().toISOString(),
  };
}

export async function runAgentDate(
  personA: Person,
  personB: Person
): Promise<AgentDateResult> {
  if (!personA.analysis || !personB.analysis) {
    throw new Error("Both people must be analyzed before dating");
  }

  if (!openai) {
    return templateDate(personA, personB);
  }

  const a = personA.analysis;
  const b = personB.analysis;

  const prompt = `Simulate a short agent-to-agent dating conversation (6-8 turns) for two clients. Agents negotiate fit on behalf of their humans. Use ONLY the profile data below.

Client A: ${JSON.stringify(a)}
Client B: ${JSON.stringify(b)}

Return JSON:
{
  "compatibilityScore": number 0-100,
  "summary": string,
  "highlights": string[2-4],
  "concerns": string[0-3],
  "transcript": [{"speaker":"agent_a"|"agent_b","message":string}, ...]
}`;

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You write realistic, concise agent dialogues. JSON only.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return templateDate(personA, personB);

  try {
    const parsed = JSON.parse(content) as Omit<
      AgentDateResult,
      "id" | "personAId" | "personBId" | "createdAt"
    >;
    return {
      id: nanoid(10),
      personAId: personA.id,
      personBId: personB.id,
      compatibilityScore: Math.min(
        100,
        Math.max(0, Math.round(parsed.compatibilityScore))
      ),
      summary: parsed.summary,
      highlights: parsed.highlights || [],
      concerns: parsed.concerns || [],
      transcript: parsed.transcript || [],
      createdAt: new Date().toISOString(),
    };
  } catch {
    return templateDate(personA, personB);
  }
}
