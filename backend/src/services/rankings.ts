import type {
  AgentDateResult,
  Person,
  PersonRankings,
  RankingEntry,
} from "../types";

export function buildRankings(
  people: Person[],
  dates: AgentDateResult[]
): PersonRankings[] {
  const ready = people.filter((p) => p.analysis && p.status === "ready");
  const byId = new Map(ready.map((p) => [p.id, p]));

  return ready.map((person) => {
    const rankedMatches: RankingEntry[] = [];

    for (const other of ready) {
      if (other.id === person.id) continue;

      const date = dates.find(
        (d) =>
          (d.personAId === person.id && d.personBId === other.id) ||
          (d.personBId === person.id && d.personAId === other.id)
      );

      if (date) {
        rankedMatches.push({
          personId: other.id,
          displayName: other.analysis!.displayName,
          compatibilityScore: date.compatibilityScore,
          dateId: date.id,
          summary: date.summary,
        });
      }
    }

    rankedMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return {
      personId: person.id,
      displayName: person.analysis!.displayName,
      rankedMatches,
    };
  });
}

export function pairsNeeded(count: number): number {
  return (count * (count - 1)) / 2;
}

export function allPairs(people: Person[]): [Person, Person][] {
  const ready = people.filter((p) => p.status === "ready" && p.analysis);
  const pairs: [Person, Person][] = [];
  for (let i = 0; i < ready.length; i++) {
    for (let j = i + 1; j < ready.length; j++) {
      pairs.push([ready[i], ready[j]]);
    }
  }
  return pairs;
}

export function dateExists(
  dates: AgentDateResult[],
  aId: string,
  bId: string
): boolean {
  return dates.some(
    (d) =>
      (d.personAId === aId && d.personBId === bId) ||
      (d.personBId === aId && d.personAId === bId)
  );
}
