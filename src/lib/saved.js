import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON } from "./storage.js";

const KEY = "alfa_finda_saved_businesses";
const EVENT = "alfa-finda-saved";

// Businesses a visitor saved, kept in this browser only (like the places saved for a trip).
export function useSavedBusinesses() {
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
  const toggle = useCallback((id) => {
    const now = readJSON(KEY, []);
    const next = now.includes(id) ? now.filter((s) => s !== id) : [...now, id];
    writeJSON(KEY, next);
    setSaved(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { saved, toggle, has: (id) => saved.includes(id) };
}
