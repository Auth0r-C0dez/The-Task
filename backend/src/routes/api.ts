import { Router } from "express";
import { z } from "zod";
import * as store from "../store";
import { createAndProcessPerson } from "../services/personPipeline";
import { runAgentDate } from "../services/dating";
import {
  allPairs,
  buildRankings,
  dateExists,
} from "../services/rankings";
import { loadDemoBundle, runDemoDating } from "../demo/demoService";

const router = Router();

const addPersonSchema = z.object({
  linkedinUrl: z.string().url(),
  instagramUrl: z.string().url(),
});

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "agentic-dating-api" });
});

router.get("/people", (_req, res) => {
  res.json({ people: store.getPeople() });
});

router.get("/people/:id", (req, res) => {
  const person = store.getPerson(req.params.id);
  if (!person) return res.status(404).json({ error: "Person not found" });
  res.json({ person });
});

router.post("/people", async (req, res) => {
  const parsed = addPersonSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const duplicate = store
    .getPeople()
    .find(
      (p) =>
        p.linkedinUrl === parsed.data.linkedinUrl ||
        p.instagramUrl === parsed.data.instagramUrl
    );
  if (duplicate) {
    return res.status(409).json({
      error: "Person with these links already exists",
      personId: duplicate.id,
    });
  }

  const person = await createAndProcessPerson(
    parsed.data.linkedinUrl,
    parsed.data.instagramUrl
  );
  res.status(201).json({ person });
});

router.get("/dates", (_req, res) => {
  res.json({ dates: store.getDates() });
});

router.get("/dates/:id", (req, res) => {
  const date = store.getDates().find((d) => d.id === req.params.id);
  if (!date) return res.status(404).json({ error: "Date not found" });
  res.json({ date });
});

router.post("/dates/run-pair", async (req, res) => {
  const schema = z.object({
    personAId: z.string(),
    personBId: z.string(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const a = store.getPerson(parsed.data.personAId);
  const b = store.getPerson(parsed.data.personBId);
  if (!a || !b) return res.status(404).json({ error: "Person not found" });
  if (a.status !== "ready" || b.status !== "ready") {
    return res.status(400).json({ error: "Both profiles must be ready" });
  }

  const existing = store
    .getDates()
    .find(
      (d) =>
        (d.personAId === a.id && d.personBId === b.id) ||
        (d.personBId === a.id && d.personAId === b.id)
    );
  if (existing) return res.json({ date: existing, cached: true });

  const date = await runAgentDate(a, b);
  store.addDate(date);
  res.json({ date, cached: false });
});

router.post("/dates/run-all", async (req, res) => {
  const people = store.getPeople();
  const dates = store.getDates();
  const pairs = allPairs(people);
  const results = [];
  let created = 0;

  for (const [a, b] of pairs) {
    if (dateExists(dates, a.id, b.id)) {
      const existing = dates.find(
        (d) =>
          (d.personAId === a.id && d.personBId === b.id) ||
          (d.personBId === a.id && d.personAId === b.id)
      );
      if (existing) results.push(existing);
      continue;
    }
    const date = await runAgentDate(a, b);
    store.addDate(date);
    dates.push(date);
    results.push(date);
    created++;
  }

  res.json({
    totalPairs: pairs.length,
    created,
    dates: results,
  });
});

router.get("/rankings", (_req, res) => {
  const rankings = buildRankings(store.getPeople(), store.getDates());
  res.json({ rankings });
});

router.get("/demo/status", (_req, res) => {
  const people = store.getPeople();
  res.json({
    demoLoaded: store.isDemoLoaded(),
    peopleCount: people.length,
    readyCount: people.filter((p) => p.status === "ready").length,
    datesCount: store.getDates().length,
  });
});

router.post("/demo/load", async (_req, res) => {
  if (store.isDemoLoaded() && store.getPeople().length >= 25) {
    return res.json({
      message: "Demo already loaded",
      people: store.getPeople().length,
      dates: store.getDates().length,
    });
  }

  const result = await loadDemoBundle();
  res.json(result);
});

router.post("/demo/run-dating", async (_req, res) => {
  const result = await runDemoDating();
  res.json(result);
});

router.post("/admin/reset", (_req, res) => {
  if (process.env.ALLOW_RESET !== "true") {
    return res.status(403).json({ error: "Reset disabled in production" });
  }
  store.clearAll();
  res.json({ ok: true });
});

export default router;
