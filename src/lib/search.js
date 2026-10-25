import { categories, categoryById, towns, provinces } from "../content/categories.js";
import { destinations } from "../content/destinations.js";
import { distanceKm, placeOf, townCentres } from "./geo.js";
import { openStatus } from "./hours.js";

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
      b.tagline,
      c?.name,
      ...(c?.words || []),
      b.city,
      b.suburb,
      b.province,
      b.serviceArea,
      b.description,
      ...(b.services || []).map((s) => (typeof s === "string" ? s : `${s.name} ${s.text || ""}`)),
      ...(b.products || []),
      ...(b.tags || []),
      ...(b.keywords || []),
    ].join(" "),
  );
}

const inTown = (b, town) =>
  !town ||
  b.city.toLowerCase() === town.toLowerCase() ||
  b.province.toLowerCase() === town.toLowerCase() ||
  (b.serviceArea || "").toLowerCase().includes(town.toLowerCase());

const list = (v) => (Array.isArray(v) ? v : String(v || "").split(",")).filter(Boolean);
const score = (b) => (b.rating || 0) * Math.log10(10 + (b.reviewCount || 0));

export const SORTS = [
  ["recommended", "Recommended"],
  ["rating", "Highest rated"],
  ["reviews", "Most reviewed"],
  ["distance", "Nearest"],
  ["newest", "Newest"],
];

/**
 * Filters and sorts businesses. Every option is optional; q is a plain-language search like "plumbers in Harare".
 * centre is [lat, lng] (a town or the visitor's own location); with it, each result gets a distance in km.
 */
export function searchBusinesses(
  all,
  {
    q = "",
    category = "",
    town = "",
    kind = "",
    verified = false,
    founding = false,
    open = false,
    rating = 0,
    price = "",
    km = 0,
    centre = null,
    sort = "recommended",
    mobileMoney = false,
    cards = false,
    delivery = false,
    whatsapp = false,
  } = {},
) {
  const parsed = parseQuery(q);
  const cats = list(category).length ? list(category) : parsed.category ? [parsed.category] : [];
  const place = town || parsed.town;
  const kinds = list(kind);
  const prices = list(price);
  const from = centre || (place && townCentres[place]) || null;
  const results = all
    .filter((b) => !cats.length || cats.includes(b.category))
    .filter((b) => (km && from ? true : inTown(b, place)))
    .filter((b) => !kinds.length || kinds.includes(b.kind))
    .filter((b) => !verified || b.verified)
    .filter((b) => !founding || b.founding)
    .filter((b) => !open || openStatus(b.hours)?.open)
    .filter((b) => !rating || (b.rating || 0) >= Number(rating))
    .filter((b) => !prices.length || prices.includes(b.priceRange))
    .filter((b) => !mobileMoney || (b.payments || []).some((p) => /ecocash|onemoney|innbucks|mobile/i.test(p)))
    .filter((b) => !cards || (b.payments || []).some((p) => /card/i.test(p)))
    .filter((b) => !delivery || b.delivery)
    .filter((b) => !whatsapp || b.whatsapp)
    .filter((b) => {
      if (!parsed.terms.length) return true;
      const text = businessText(b);
      return parsed.terms.every((t) => text.includes(t));
    })
    .map((b) => {
      const at = placeOf(b);
      return { ...b, distance: from && at ? distanceKm(from, at) : null };
    })
    .filter((b) => !km || !from || (b.distance !== null && b.distance <= Number(km)));
  const by = {
    recommended: (a, b) =>
      Number(!!b.featured) - Number(!!a.featured) ||
      Number(!!b.verified) - Number(!!a.verified) ||
      score(b) - score(a) ||
      a.name.localeCompare(b.name),
    rating: (a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviewCount || 0) - (a.reviewCount || 0),
    reviews: (a, b) => (b.reviewCount || 0) - (a.reviewCount || 0),
    distance: (a, b) => (a.distance ?? 1e9) - (b.distance ?? 1e9),
    newest: (a, b) => String(b.added || "").localeCompare(String(a.added || "")),
  };
  return results.sort(by[sort] || by.recommended);
}

/** Places to visit that match a search, e.g. "waterfalls" or "Matobo". */
export function searchDestinations(q) {
  const { terms, town, category } = parseQuery(q);
  if (category) return []; // a search for a kind of business, not a place to visit
  const words = [...terms, ...(town ? [town.toLowerCase()] : [])];
  if (!words.length) return [];
  return destinations.filter((d) => {
    const text = norm(
      [d.name, ...(d.aka || []), d.location, d.region, d.summary, ...d.interests, ...d.activities].join(" "),
    );
    return words.every((w) => text.includes(w));
  });
}

/** A short title for a search: "Vets and pet care in Harare". */
export function describeSearch({ q = "", category = "", town = "" }) {
  const parsed = parseQuery(q);
  const cats = list(category);
  if (cats.length > 1) return `${cats.length} categories${town || parsed.town ? ` in ${town || parsed.town}` : ""}`;
  const cat = categoryById[cats[0] || parsed.category];
  const place = town || parsed.town;
  if (cat && place) return `${cat.name} in ${place}`;
  if (cat) return cat.name;
  if (q.trim()) return `“${q.trim()}”${place && !q.toLowerCase().includes(place.toLowerCase()) ? ` in ${place}` : ""}`;
  if (place) return `Businesses in ${place}`;
  return "All businesses";
}
