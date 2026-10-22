// Small per-browser memory (the places someone saved for their trip). Storage can be blocked or empty, so every
// read and write is guarded and the site works without it.
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked: the choice lasts until the page reloads */
  }
}
