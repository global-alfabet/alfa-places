import { useEffect } from "react";

const DEFAULT_TITLE = "Alfa Finda · Find services, businesses and places in Zimbabwe";
const DEFAULT_DESCRIPTION =
  "Find plumbers, electricians, solar installers, salons, clinics and places to visit across Zimbabwe, and list your business on Alfa Finda.";

export function usePageTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · Alfa Finda` : DEFAULT_TITLE;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description || DEFAULT_DESCRIPTION);
  }, [title, description]);
}
