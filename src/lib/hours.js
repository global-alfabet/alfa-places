// Opening hours like { Monday: "08:00–17:00", Sunday: "Closed" } or "Open 24 hours".
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// The day and minute of the day in Zimbabwe (Africa/Harare), whatever the visitor's own time zone.
function zimNow(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Harare",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  return { day: get("weekday"), minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

function ranges(text) {
  if (!text || /closed/i.test(text)) return [];
  if (/24 hours/i.test(text)) return [[0, 24 * 60]];
  return text.split(",").flatMap((part) => {
    const m = part.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
    return m ? [[Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])]] : [];
  });
}

/** { open: true, label: "Open now", detail: "Until 17:00" } or { open: false, label: "Closed", detail: "Opens Monday 08:00" }. */
export function openStatus(hours, now) {
  if (!hours) return null;
  if (typeof hours === "string") {
    return /24 hours/i.test(hours) ? { open: true, label: "Open 24 hours", detail: "" } : null;
  }
  const { day, minutes } = zimNow(now);
  const today = DAYS.indexOf(day);
  const todays = ranges(hours[day]);
  const current = todays.find(([a, b]) => minutes >= a && minutes < b);
  const hhmm = (m) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  if (current) return { open: true, label: "Open now", detail: current[1] >= 24 * 60 ? "Open all day" : `Until ${hhmm(current[1])}` };
  const later = todays.find(([a]) => a > minutes);
  if (later) return { open: false, label: "Closed", detail: `Opens ${hhmm(later[0])}` };
  for (let i = 1; i <= 7; i++) {
    const d = DAYS[(today + i) % 7];
    const r = ranges(hours[d]);
    if (r.length) return { open: false, label: "Closed", detail: `Opens ${i === 1 ? "tomorrow" : d} ${hhmm(r[0][0])}` };
  }
  return { open: false, label: "Closed", detail: "" };
}

/** "Mon–Fri 08:00–17:00 · Sat 08:00–13:00" for a short summary. */
export function hoursSummary(hours) {
  if (!hours) return "";
  if (typeof hours === "string") return hours;
  const groups = [];
  for (const d of DAYS) {
    const v = hours[d] || "Closed";
    const last = groups[groups.length - 1];
    if (last && last.v === v) last.to = d;
    else groups.push({ from: d, to: d, v });
  }
  return groups
    .filter((g) => !/closed/i.test(g.v))
    .map((g) => `${g.from.slice(0, 3)}${g.to !== g.from ? `–${g.to.slice(0, 3)}` : ""} ${g.v}`)
    .join(" · ");
}
