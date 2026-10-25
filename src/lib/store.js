// Test-mode state shared by the public pages and the test dashboards (site.demo). Everything lives in memory: an
// edit in the business dashboard shows on the public listing, an approval in the admin dashboard adds a listing to
// search, a message sent from a listing lands in its inbox. Nothing is saved or sent, and it all resets on reload.
import { createContext, useCallback, useContext, useMemo } from "react";
import { businesses } from "../content/businesses.js";
import { sampleThreads, submissions } from "../content/demo-dashboard.js";
import { townCentres } from "./geo.js";

export const StoreContext = createContext(null);

export const HOME_DEFAULTS = {
  headline: "Find the right service, near you.",
  lead: "Plumbers, electricians, solar installers, salons, clinics and places to go across Zimbabwe, in one search.",
  placeholder: "What do you need done?",
  categories: ["plumbing", "electrical", "solar", "restaurants", "beauty", "automotive", "health"],
};

export const initialState = {
  edits: {}, // business id → changed fields
  added: [], // approved submissions, now listings
  userReviews: {}, // business id → reviews written on this visit
  replies: {}, // review key → { text, at }
  removed: {}, // review key → true (removed by Alfa Finda)
  reports: {}, // report id → "kept" | "removed"
  newReports: [], // reports a business made on this visit
  threads: {}, // business id → message threads, once anything changed
  decisions: {}, // submission id → { status, reason, at }
  verify: {}, // business id → { status: "requested" | "approved" | "declined", note, at }
  home: HOME_DEFAULTS,
  ownerId: "aquaflow-plumbing",
  notifications: {}, // business id → { messages, reviews, weekly }
  activity: [], // { at, icon, title, text }
};

const now = () => new Date().toISOString();

export function reducer(state, action) {
  const log = action.log ? { activity: [{ at: now(), ...action.log }, ...state.activity].slice(0, 40) } : {};
  switch (action.type) {
    case "edit":
      return {
        ...state,
        ...log,
        edits: { ...state.edits, [action.id]: { ...state.edits[action.id], ...action.fields } },
      };
    case "reset": {
      const edits = { ...state.edits };
      delete edits[action.id];
      return { ...state, ...log, edits };
    }
    case "review":
      return {
        ...state,
        ...log,
        userReviews: { ...state.userReviews, [action.id]: [action.review, ...(state.userReviews[action.id] || [])] },
      };
    case "reply": {
      const replies = { ...state.replies };
      if (action.text) replies[action.key] = { text: action.text, at: now() };
      else delete replies[action.key];
      return { ...state, ...log, replies };
    }
    case "report":
      return {
        ...state,
        ...log,
        reports: { ...state.reports, [action.id]: action.status },
        removed: { ...state.removed, [action.key]: action.status === "removed" || undefined },
      };
    case "newReport":
      return { ...state, ...log, newReports: [{ at: now(), ...action.report }, ...state.newReports] };
    case "threads":
      return { ...state, ...log, threads: { ...state.threads, [action.id]: action.list } };
    case "decide": {
      const decisions = {
        ...state.decisions,
        [action.id]: { status: action.status, reason: action.reason, at: now() },
      };
      const s = submissions.find((x) => x.id === action.id);
      const added =
        action.status === "approved" && s && !state.added.some((b) => b.id === s.id)
          ? [
              { ...s, example: true, added: now().slice(0, 10), at: townCentres[s.city], approvedNow: true },
              ...state.added,
            ]
          : state.added.filter((b) => action.status === "approved" || b.id !== action.id);
      return { ...state, ...log, decisions, added };
    }
    case "verify": {
      const verify = { ...state.verify, [action.id]: { status: action.status, note: action.note, at: now() } };
      const edits =
        action.status === "approved"
          ? { ...state.edits, [action.id]: { ...state.edits[action.id], kind: "company", verified: true } }
          : state.edits;
      return { ...state, ...log, verify, edits };
    }
    case "home":
      return { ...state, ...log, home: { ...state.home, ...action.content } };
    case "owner":
      return { ...state, ownerId: action.id };
    case "notifications":
      return { ...state, notifications: { ...state.notifications, [action.id]: action.value } };
    default:
      return state;
  }
}

export function useStore() {
  return useContext(StoreContext);
}

export const reviewKey = (businessId, r) => r.id || `${businessId}:${r.name}:${r.date}`;

// A listing with this visit's edits, new reviews, replies and removals applied.
function merge(b, state) {
  const x = { ...b, ...state.edits[b.id] };
  const mine = state.userReviews[b.id] || [];
  const all = [...mine, ...(b.reviews || [])].map((r) => {
    const key = reviewKey(b.id, r);
    return { ...r, key, reply: state.replies[key] };
  });
  x.reviews = all.filter((r) => !state.removed[r.key]);
  x.removedReviews = all.filter((r) => state.removed[r.key]);
  if (mine.length) {
    const n = b.reviewCount || 0;
    const total = (b.rating || 0) * n + mine.reduce((sum, r) => sum + r.rating, 0);
    x.reviewCount = n + mine.length;
    x.rating = Math.round((total / x.reviewCount) * 10) / 10;
  }
  return x;
}

/** Every listing as it stands on this visit. Hidden listings only with includeHidden (for the dashboards). */
export function useDirectory(includeHidden = false) {
  const { state } = useStore();
  return useMemo(() => {
    const list = [...state.added, ...businesses].map((b) => merge(b, state));
    return includeHidden ? list : list.filter((b) => !b.hidden);
  }, [state, includeHidden]);
}

/** One listing (hidden ones too), or undefined. */
export function useListing(id) {
  const all = useDirectory(true);
  return all.find((b) => b.id === id);
}

/** A business's message threads, and a setter that keeps changes for this visit. */
export function useThreads(b) {
  const { state, dispatch } = useStore();
  const threads = useMemo(() => (b ? state.threads[b.id] || sampleThreads(b) : []), [b, state.threads]);
  const setThreads = useCallback((list, log) => dispatch({ type: "threads", id: b.id, list, log }), [b, dispatch]);
  return [threads, setThreads];
}
