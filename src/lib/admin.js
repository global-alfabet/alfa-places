// Queues for the test admin dashboard, worked out from the sample data and this visit's decisions (store.js).
import { reviewReports, submissions, verificationRequests } from "../content/demo-dashboard.js";

/** Businesses that sent the Add your business form, waiting for a decision. */
export const pendingSubmissions = (state) => submissions.filter((s) => !state.decisions[s.id]);

/** Businesses asking for the Verified badge, waiting for a decision. */
export function verifyQueue(state) {
  const asked = verificationRequests
    .filter((r) => !state.verify[r.id] || state.verify[r.id].status === "requested")
    .map((r) => ({ ...r, ...(state.verify[r.id] || {}), note: state.verify[r.id]?.note || r.note }));
  const fresh = Object.entries(state.verify)
    .filter(([id, v]) => v.status === "requested" && !verificationRequests.some((r) => r.id === id))
    .map(([id, v]) => ({ id, note: v.note ? `Registration number: ${v.note}` : "", at: v.at }));
  return [...fresh, ...asked];
}

/** Every reported review, with this visit's decision (undefined while open). */
export const allReports = (state) =>
  [...state.newReports, ...reviewReports].map((r) => ({ ...r, status: state.reports[r.id] }));

export const openReports = (state) => allReports(state).filter((r) => !r.status);

/** The directory as a CSV file, for Export. */
export function directoryCsv(list) {
  const cols = [
    "id",
    "name",
    "kind",
    "category",
    "city",
    "suburb",
    "verified",
    "founding",
    "featured",
    "hidden",
    "example",
    "added",
  ];
  const cell = (v) => {
    const s = v === undefined || v === null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    cols.join(","),
    ...list.map((b) => cols.map((c) => cell(b[c] ?? (c === "hidden" ? false : ""))).join(",")),
  ].join("\n");
}

/** Saves text as a file in the visitor's downloads. */
export function download(name, text, type = "text/csv") {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
