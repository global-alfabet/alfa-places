import { categories, categoryById, towns, provinces } from "../content/categories.js";
import { destinations } from "../content/destinations.js";

// Words that carry no meaning in a search like "vets near me in Harare".
const STOP = new Set([
  "in",
  "near",
  "me",
  "the",
  "a",
  "an",
  "and",
  "for",
  "of",
  "at",
  "to",
  "with",
  "around",
  "best",
  "good",
  "find",
  "some",
  "any",
  "zimbabwe",
  "my",
  "i",
  "need",
  "want",
  "looking",
]);

const norm = (s) =>
  ` ${String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9&\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;

const has = (text, phrase) => text.includes(` ${phrase} `);

/**
 * Reads a plain-language search. "restaurants in Bulawayo" → { category: "restaurants", town: "Bulawayo", terms: [] }.
 * Words that name any category ("shops", "repairs") describe the search rather than narrow it, so they are dropped
 * from the terms every result must contain.
 */
export function parseQuery(raw) {
  let text = norm(raw).replace(/ near me /g, " ");
  let town = "";
  for (const t of [...towns, ...provinces]) {
    const n = t.toLowerCase();
    if (has(text, n)) {
      town = t;
      text = text.replace(` ${n} `, " ");
      break;
    }
  }
  let category = "";
  for (const c of categories) {
    if (c.words.some((w) => has(text, w) || has(text, `${w}s`)) || has(text, c.name.toLowerCase())) {
      category = c.id;
      break;
    }
  }
  const categoryWords = new Set(
    categories.flatMap((c) => c.words.flatMap((w) => w.split(" ")).flatMap((w) => [w, `${w}s`])),
  );
  const terms = text.split(" ").filter((w) => w.length > 1 && !STOP.has(w) && !(category && categoryWords.has(w)));
  return { town, category, terms };
}

function businessText(b) {
  const c = categoryById[b.category];
  return norm(
    [
      b.name,
      c?.name,
      ...(c?.words || []),
      b.city,
      b.province,
      b.description,
      ...(b.services || []),
      ...(b.products || []),
      ...(b.keywords || []),
    ].join(" "),
  );
}

const inTown = (b, town) =>
  !town || b.city.toLowerCase() === town.toLowerCase() || b.province.toLowerCase() === town.toLowerCase();

/** Filters businesses. Every option is optional; q is a plain-language search. */
export function searchBusinesses(
  list,
  { q = "", category = "", town = "", mobileMoney = false, cards = false, delivery = false, whatsapp = false } = {},
) {
  const parsed = parseQuery(q);
  const cat = category || parsed.category;
  const place = town || parsed.town;
  return list
    .filter((b) => !cat || b.category === cat)
    .filter((b) => inTown(b, place))
    .filter((b) => !mobileMoney || (b.payments || []).some((p) => /ecocash|onemoney|innbucks|mobile/i.test(p)))
    .filter((b) => !cards || (b.payments || []).some((p) => /card/i.test(p)))
    .filter((b) => !delivery || b.delivery)
    .filter((b) => !whatsapp || b.whatsapp)
    .filter((b) => {
      if (!parsed.terms.length) return true;
      const text = businessText(b);
      return parsed.terms.every((t) => text.includes(t));
    })
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
}

/** Places to visit that match a search, e.g. "waterfalls" or "Matobo". */
export function searchDestinations(q) {
  const { terms, town, category } = parseQuery(q);
  if (category) return []; // a search for a kind of business, not a place to visit
  const words = [...terms, ...(town ? [town.toLowerCase()] : [])];
  if (!words.length) return [];
  return destinations.filter((d) => {
    const text = norm([d.name, d.location, d.region, d.summary, ...d.interests, ...d.activities].join(" "));
    return words.every((w) => text.includes(w));
  });
}

/** A short title for a search: "Vets and pet care in Harare". */
export function describeSearch({ q = "", category = "", town = "" }) {
  const parsed = parseQuery(q);
  const cat = categoryById[category || parsed.category];
  const place = town || parsed.town;
  if (cat && place) return `${cat.name} in ${place}`;
  if (cat) return cat.name;
  if (q.trim()) return `“${q.trim()}”${place && !q.toLowerCase().includes(place.toLowerCase()) ? ` in ${place}` : ""}`;
  if (place) return `Businesses in ${place}`;
  return "All businesses";
}
