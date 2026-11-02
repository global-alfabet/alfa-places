import { useCallback, useEffect, useState } from "react";
import { readJSON, writeJSON } from "./storage.js";
import { track } from "./consent.js";

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
    // save_place: a business was saved (content_type "business", item_id: its id)
    if (!now.includes(id)) track("save_place", { content_type: "business", item_id: id });
    writeJSON(KEY, next);
    setSaved(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { saved, toggle, has: (id) => saved.includes(id) };
}
