import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON } from "./storage.js";

const KEY = "alfa_places_trip";
const EVENT = "alfa-places-trip";

// The places a visitor has saved for their trip, kept in this browser only.
export function useTrip() {
  const [saved, setSaved] = useState(() => readJSON(KEY, []));
  useEffect(() => {
    const sync = () => setSaved(readJSON(KEY, []));
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const toggle = useCallback((slug) => {
    const now = readJSON(KEY, []);
    const next = now.includes(slug) ? now.filter((s) => s !== slug) : [...now, slug];
    writeJSON(KEY, next);
    setSaved(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { saved, toggle, has: (slug) => saved.includes(slug) };
}
