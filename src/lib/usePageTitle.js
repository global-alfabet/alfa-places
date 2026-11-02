import { useEffect } from "react";

// Search results show about 60 characters of a title and 160 of a description. src/lib/seo.js uses the same
// strings for the HTML each page is built with.
export const DEFAULT_TITLE = "Alfa Finda · Find local businesses and places to visit";
export const DEFAULT_DESCRIPTION =
  "Search local businesses, services and attractions, see hours and contact details, plan a trip around places to visit, and list your business on Alfa Finda.";

/** Shortens a description to fit in search results, at a word break. */
export function clip(text, max = 158) {
  const s = String(text || "").replace(/\s+/g, " ").trim();
  if (s.length <= max) return s;
  return `${s.slice(0, s.lastIndexOf(" ", max - 1))}…`;
}

export function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · Alfa Finda` : DEFAULT_TITLE;
    document.querySelector('meta[name="description"]')?.setAttribute("content", clip(description || DEFAULT_DESCRIPTION));
  }, [title, description]);
}
