import { site } from "../config.js";

// Shown on every page while Alfa Finda is in test mode (site.demo in config.js).
export default function DemoBanner() {
  if (!site.demo) return null;
  return (
    <div className="demo-banner" role="note">
      <strong>Test version.</strong> Businesses marked Example are made up
      <span className="demo-more"> so we can test Alfa Finda. They, their reviews and their badges aren't real</span>.
    </div>
  );
}
