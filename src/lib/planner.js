import { destinations } from "../content/destinations.js";

export const BUDGETS = ["Budget", "Moderate", "Premium", "Luxury"];

// Starting towns and their approximate [latitude, longitude].
export const START_TOWNS = {
  Harare: [-17.83, 31.05],
  Bulawayo: [-20.15, 28.58],
  "Victoria Falls": [-17.93, 25.84],
  Mutare: [-18.97, 32.67],
  Masvingo: [-20.07, 30.83],
  Kariba: [-16.52, 28.8],
};

// Straight-line distance in km. Roads are longer, but this is enough to keep a trip from zig-zagging.
export function km([la1, lo1], [la2, lo2]) {
  const r = Math.PI / 180;
  const a =
    Math.sin(((la2 - la1) * r) / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin(((lo2 - lo1) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

/**
 * Builds a day-by-day trip.
 * interests: ids from content/destinations.js; days: 1–14; budget: one of BUDGETS; start: a START_TOWNS key or "";
 * saved: slugs the visitor saved, which are preferred when they fit.
 */
export function planTrip({ interests = [], days = 4, budget = "Moderate", start = "", saved = [] }) {
  const want = new Set(interests);
  const b = BUDGETS.indexOf(budget);
  const home = START_TOWNS[start];

  const candidates = destinations
    .map((d) => {
      const matches = d.interests.filter((i) => want.has(i));
      const score =
        matches.length * 4 +
        (3 - Math.abs(BUDGETS.indexOf(d.cost) - (b < 0 ? 1 : b))) +
        (saved.includes(d.slug) ? 10 : 0);
      return { d, matches, score };
    })
    .filter((x) => x.matches.length || saved.includes(x.d.slug));

  const total = Math.max(1, Math.min(14, Number(days) || 1));
  const NEAR_KM = 350; // later stops stay within this distance of a place already on the trip

  // Grows a trip outwards from one place: good matches close to the places already chosen.
  const grow = (anchor) => {
    let left = total;
    const stops = [
      { destination: anchor.d, days: Math.min(anchor.d.days[0], left), matches: anchor.matches, score: anchor.score },
    ];
    left -= stops[0].days;
    const pool = candidates.filter((x) => x !== anchor);
    while (left > 0 && stops.length < 5) {
      const near = (x) => Math.min(...stops.map((st) => km(st.destination.at, x.d.at)));
      const options = pool.filter(
        (x) => !stops.some((st) => st.destination === x.d) && x.d.days[0] <= left && near(x) <= NEAR_KM,
      );
      if (!options.length) break;
      options.sort((x, y) => y.score - near(y) / 150 - (x.score - near(x) / 150));
      const x = options[0];
      stops.push({ destination: x.d, days: x.d.days[0], matches: x.matches, score: x.score });
      left -= x.d.days[0];
    }
    // Spread any days left over across the places that suit a longer stay.
    for (let grew = true; left > 0 && grew;) {
      grew = false;
      for (const st of stops) {
        if (left > 0 && st.days < st.destination.days[1]) {
          st.days += 1;
          left -= 1;
          grew = true;
        }
      }
    }
    // Visit them in a sensible order: always go to the nearest place not yet visited.
    const ordered = [];
    let here = home || stops[0].destination.at;
    let distance = 0;
    const rest = [...stops];
    while (rest.length) {
      rest.sort((x, y) => km(here, x.destination.at) - km(here, y.destination.at));
      const next = rest.shift();
      distance += km(here, next.destination.at);
      ordered.push(next);
      here = next.destination.at;
    }
    const value = stops.reduce((sum, st) => sum + st.score, 0) + (total - left) * 1.5 - distance / 250;
    return { stops: ordered, left, value };
  };

  // Try starting the trip from each matching place and keep the best one.
  const best = candidates.map(grow).sort((x, y) => y.value - x.value)[0] || { stops: [], left: total };
  const ordered = best.stops;
  const left = best.left;

  const itinerary = [];
  ordered.forEach((s, si) => {
    const acts = s.destination.activities;
    for (let i = 0; i < s.days; i++) {
      const todo = s.days === 1 ? acts.slice(0, 2) : [acts[(i * 2) % acts.length], acts[(i * 2 + 1) % acts.length]];
      itinerary.push({
        day: itinerary.length + 1,
        destination: s.destination,
        travel: i === 0 && (si > 0 || Boolean(home)),
        activities: [...new Set(todo)],
      });
    }
  });

  return { stops: ordered, itinerary, spare: left };
}
