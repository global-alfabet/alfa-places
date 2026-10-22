import { useEffect } from "react";

const DEFAULT_TITLE = "Alfa Places · Find places worth knowing in Zimbabwe";
const DEFAULT_DESCRIPTION =
  "Find businesses, attractions and places to visit across Zimbabwe, plan a trip, and list your business on Alfa Places.";

export function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · Alfa Places` : DEFAULT_TITLE;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description || DEFAULT_DESCRIPTION);
  }, [title, description]);
}
