import { nanoid } from "nanoid";
import type { Person } from "../types";
import { analyzePerson } from "./analyzer";
import { scrapePersonSources } from "./scraper";
import * as store from "../store";

export async function createAndProcessPerson(
  linkedinUrl: string,
  instagramUrl: string
): Promise<Person> {
  const now = new Date().toISOString();
  let person: Person = {
    id: nanoid(12),
    linkedinUrl,
    instagramUrl,
    status: "scraping",
    createdAt: now,
    updatedAt: now,
  };
  store.upsertPerson(person);

  try {
    const raw = await scrapePersonSources(linkedinUrl, instagramUrl);
    person = {
      ...person,
      raw,
      status: "analyzing",
      updatedAt: new Date().toISOString(),
    };
    store.upsertPerson(person);

    const analysis = await analyzePerson(raw);
    person = {
      ...person,
      analysis,
      status: "ready",
      updatedAt: new Date().toISOString(),
    };
    store.upsertPerson(person);
    return person;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Processing failed";
    person = {
      ...person,
      status: "error",
      errorMessage: message,
      updatedAt: new Date().toISOString(),
    };
    store.upsertPerson(person);
    return person;
  }
}

export function createPersonFromSeed(entry: {
  linkedinUrl: string;
  instagramUrl: string;
  analysis: Person["analysis"];
  raw?: Person["raw"];
}): Person {
  const now = new Date().toISOString();
  const person: Person = {
    id: nanoid(12),
    linkedinUrl: entry.linkedinUrl,
    instagramUrl: entry.instagramUrl,
    status: "ready",
    raw: entry.raw,
    analysis: entry.analysis,
    createdAt: now,
    updatedAt: now,
  };
  store.upsertPerson(person);
  return person;
}
