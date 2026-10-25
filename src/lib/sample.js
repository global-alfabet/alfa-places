// Sample numbers for the test dashboards (site.demo). They are made up, but the same every time for the same
// business, so a page looks the same after a reload. Nothing here is a real visit, enquiry or rating.

/** A small seeded random number generator: the same text always gives the same sequence. */
export function seeded(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = (rand, list) => list[Math.floor(rand() * list.length)];

const DAY = 86400000;
const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Sample activity for a business over the last 14 days: profile views, enquiries (messages and WhatsApp taps),
 * calls, direction requests and saves. Busier listings (more reviews) get more views.
 */
export function sampleStats(b, now = new Date()) {
  const rand = seeded(`stats:${b.id}`);
  const base = 18 + Math.min(b.reviewCount || 10, 220) * 0.9;
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now.getTime() - i * DAY);
    const weekend = date.getDay() === 0 || date.getDay() === 6;
    const lift = b.category === "restaurants" || b.category === "hotels" || b.category === "tourism" ? 1.25 : 0.8;
    const views = Math.round(base * (weekend ? lift : 1) * (0.7 + rand() * 0.6) * (i < 7 ? 1.08 : 1));
    days.push({ date, label: SHORT_DAYS[date.getDay()], views, enquiries: Math.round(views * (0.05 + rand() * 0.05)) });
  }
  const week = days.slice(7);
  const before = days.slice(0, 7);
  const sum = (list, k) => list.reduce((n, d) => n + d[k], 0);
  const views = sum(week, "views");
  const enquiries = sum(week, "enquiries");
  return {
    days: week,
    views,
    viewsChange: change(views, sum(before, "views")),
    enquiries,
    enquiriesChange: change(enquiries, sum(before, "enquiries")),
    calls: Math.round(enquiries * (0.4 + rand() * 0.3)),
    directions: Math.round(views * (0.03 + rand() * 0.03)),
    saves: Math.round(views * (0.04 + rand() * 0.04)),
    savesChange: Math.round((rand() - 0.35) * 30),
    searches: Math.round(views * (2.2 + rand())),
  };
}

const change = (now, before) => (before ? Math.round(((now - before) / before) * 100) : 0);

/**
 * How many reviews gave 5, 4, 3, 2 and 1 stars, for an average rating and a review count. Uses the smoothest
 * spread with that average (weights e^(λ·stars)), so 4.8 gives mostly fives and a few fours.
 */
export function ratingSpread(rating, count) {
  if (!rating || !count) return [5, 4, 3, 2, 1].map((stars) => ({ stars, count: 0, share: 0 }));
  const mean = (l) => {
    const w = [1, 2, 3, 4, 5].map((s) => Math.exp(l * s));
    return w.reduce((n, x, i) => n + x * (i + 1), 0) / w.reduce((n, x) => n + x, 0);
  };
  let lo = -10;
  let hi = 10;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (mean(mid) < rating) lo = mid;
    else hi = mid;
  }
  const w = [5, 4, 3, 2, 1].map((s) => Math.exp(lo * s));
  const total = w.reduce((n, x) => n + x, 0);
  const counts = w.map((x) => Math.round((x / total) * count));
  counts[0] += count - counts.reduce((n, x) => n + x, 0);
  return [5, 4, 3, 2, 1].map((stars, i) => ({ stars, count: counts[i], share: counts[i] / count }));
}

/** "4 min ago", "3 h ago", "Yesterday", "Tue", "12 Oct" for message lists. */
export function shortTime(iso, now = new Date()) {
  const d = new Date(iso);
  const mins = Math.round((now - d) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (mins < 60 * 24 && d.getDate() === now.getDate()) return `${Math.round(mins / 60)} h ago`;
  if (mins < 60 * 48) return "Yesterday";
  if (mins < 60 * 24 * 6) return SHORT_DAYS[d.getDay()];
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** "24 Oct" */
export const dayMonth = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export const minutesAgo = (m, now = new Date()) => new Date(now.getTime() - m * 60000).toISOString();

export const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** 48291 → "48,291"; 124500 → "124.5K". */
export function compact(n) {
  if (n >= 100000) return `${(n / 1000).toFixed(n >= 1000000 ? 0 : 1).replace(/\.0$/, "")}K`;
  return n.toLocaleString("en-GB");
}
