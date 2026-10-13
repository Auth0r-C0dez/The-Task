import * as cheerio from "cheerio";
import type { RawProfileSources } from "../types";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

function extractFromHtml(html: string, baseUrl: string): {
  title: string;
  text: string;
  warnings: string[];
} {
  const $ = cheerio.load(html);
  const warnings: string[] = [];

  const ogTitle =
    $('meta[property="og:title"]').attr("content") ||
    $("title").text().trim();
  const ogDesc = $('meta[property="og:description"]').attr("content") || "";
  const metaDesc = $('meta[name="description"]').attr("content") || "";
  const ogSite = $('meta[property="og:site_name"]').attr("content") || "";

  $("script, style, noscript").remove();
  const bodyText = $("body").text().replace(/\s+/g, " ").trim().slice(0, 8000);

  const jsonLdBlocks: string[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const content = $(el).html();
    if (content) jsonLdBlocks.push(content.slice(0, 2000));
  });

  const combined = [
    `Title: ${ogTitle}`,
    ogSite ? `Site: ${ogSite}` : "",
    ogDesc ? `Description: ${ogDesc}` : "",
    metaDesc && metaDesc !== ogDesc ? `Meta: ${metaDesc}` : "",
    jsonLdBlocks.length ? `Structured: ${jsonLdBlocks.join(" | ")}` : "",
    bodyText ? `Page text excerpt: ${bodyText.slice(0, 4000)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  if (!ogDesc && bodyText.length < 100) {
    warnings.push(
      `Limited public HTML at ${baseUrl}; login walls may block full content. Analysis uses available Open Graph and excerpt text only.`
    );
  }

  return {
    title: ogTitle || "Unknown",
    text: combined || bodyText || "(no extractable public text)",
    warnings,
  };
}

export function normalizeLinkedIn(url: string): string {
  let u = url.trim();
  if (!u.startsWith("http")) u = `https://${u}`;
  if (!u.includes("linkedin.com")) {
    throw new Error("Invalid LinkedIn URL — use a public linkedin.com/in/... profile");
  }
  return u.split("?")[0].split("#")[0].replace(/\/$/, "");
}

export function normalizeInstagram(url: string): string {
  let u = url.trim();
  if (u.startsWith("@")) u = `https://www.instagram.com/${u.slice(1)}/`;
  if (!u.startsWith("http") && !u.includes("instagram.com")) {
    u = `https://www.instagram.com/${u.replace(/^\/+/, "")}/`;
  } else if (!u.startsWith("http")) {
    u = `https://${u}`;
  }
  if (!u.includes("instagram.com")) {
    throw new Error("Invalid Instagram URL — use a public instagram.com/... profile");
  }
  u = u.split("?")[0].split("#")[0];
  if (!u.endsWith("/")) u += "/";
  return u;
}

export async function scrapePersonSources(
  linkedinUrl: string,
  instagramUrl: string
): Promise<RawProfileSources> {
  const linkedin = normalizeLinkedIn(linkedinUrl);
  const instagram = normalizeInstagram(instagramUrl);
  const warnings: string[] = [];

  let linkedinTitle = "";
  let linkedinText = "";
  let instagramTitle = "";
  let instagramText = "";

  try {
    const liHtml = await fetchHtml(linkedin);
    const li = extractFromHtml(liHtml, linkedin);
    linkedinTitle = li.title;
    linkedinText = li.text;
    warnings.push(...li.warnings);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    warnings.push(`LinkedIn fetch failed (${msg}). Using URL identity only.`);
    linkedinTitle = linkedin.split("/").filter(Boolean).pop() || "LinkedIn profile";
    linkedinText = `LinkedIn profile URL: ${linkedin}. Public page could not be fetched; infer profession and interests cautiously from the handle/path segment.`;
  }

  try {
    const igHtml = await fetchHtml(instagram);
    const ig = extractFromHtml(igHtml, instagram);
    instagramTitle = ig.title;
    instagramText = ig.text;
    warnings.push(...ig.warnings);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "fetch failed";
    warnings.push(`Instagram fetch failed (${msg}). Using URL identity only.`);
    const handle =
      instagram.match(/instagram\.com\/([^/]+)/)?.[1] || "instagram user";
    instagramTitle = `@${handle}`;
    instagramText = `Instagram profile URL: ${instagram}. Public page could not be fetched; infer lifestyle and hobbies cautiously from the public handle.`;
  }

  return {
    linkedinUrl: linkedin,
    instagramUrl: instagram,
    linkedinText,
    instagramText,
    linkedinTitle,
    instagramTitle,
    scrapeWarnings: [...new Set(warnings)],
  };
}
