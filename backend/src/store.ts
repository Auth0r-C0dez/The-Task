import fs from "fs";
import path from "path";
import type { AppState, Person, AgentDateResult } from "./types";

const defaultState: AppState = {
  people: [],
  dates: [],
  demoLoaded: false,
};

let dataDir = path.join(process.cwd(), "data");
let stateFile = path.join(dataDir, "state.json");

export function configureStore(dir?: string): void {
  if (dir) {
    dataDir = path.resolve(dir);
    stateFile = path.join(dataDir, "state.json");
  }
}

function ensureDir(): void {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function loadState(): AppState {
  ensureDir();
  if (!fs.existsSync(stateFile)) {
    saveState(defaultState);
    return { ...defaultState };
  }
  try {
    const raw = fs.readFileSync(stateFile, "utf-8");
    return JSON.parse(raw) as AppState;
  } catch {
    return { ...defaultState };
  }
}

export function saveState(state: AppState): void {
  ensureDir();
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), "utf-8");
}

export function getPeople(): Person[] {
  return loadState().people;
}

export function getPerson(id: string): Person | undefined {
  return loadState().people.find((p) => p.id === id);
}

export function upsertPerson(person: Person): Person {
  const state = loadState();
  const idx = state.people.findIndex((p) => p.id === person.id);
  if (idx >= 0) state.people[idx] = person;
  else state.people.push(person);
  saveState(state);
  return person;
}

export function getDates(): AgentDateResult[] {
  return loadState().dates;
}

export function addDate(date: AgentDateResult): void {
  const state = loadState();
  state.dates.push(date);
  saveState(state);
}

export function replaceState(next: AppState): void {
  saveState(next);
}

export function isDemoLoaded(): boolean {
  return loadState().demoLoaded;
}

export function setDemoLoaded(value: boolean): void {
  const state = loadState();
  state.demoLoaded = value;
  saveState(state);
}

export function clearAll(): void {
  saveState({ ...defaultState });
}
