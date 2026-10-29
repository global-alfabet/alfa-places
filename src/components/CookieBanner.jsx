// Asks once whether we may use Google Analytics cookies, with Accept and Reject side by side and equally easy to press.
// Shows nothing until the page is running in the browser (so prerendered HTML matches), and nothing at all when the
// site has no measurement ID. "Cookie settings" links call openCookieSettings() to show it again.
import { useEffect, useState } from "react";
import { currentChoice, initConsent, needsAnswer, setChoice } from "../lib/consent.js";

export default function CookieBanner({ measurementId, policyHref }) {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState(false);
  useEffect(() => {
    initConsent(measurementId);
    setOpen(needsAnswer());
    const again = () => {
      if (!measurementId) return;
      setReview(true);
      setOpen(true);
    };
    window.addEventListener("ga:cookie-settings", again);
    return () => window.removeEventListener("ga:cookie-settings", again);
  }, [measurementId]);
  if (!open) return null;
  const answer = (v) => {
    setChoice(v);
    setOpen(false);
    setReview(false);
  };
  const now = currentChoice();
  return (
    <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-text">
      <div className="cookie-copy">
        <p id="cookie-title" className="cookie-title">
          Cookies
        </p>
        <p id="cookie-text">
          We'd like to use Google Analytics cookies to count visits and see which pages help people. They're only set if you accept, and
          your choice covers Global Alfabet's sites. <a href={policyHref}>Cookie policy</a>
          {review && now && <span className="cookie-now"> You chose: {now === "granted" ? "Accept" : "Reject"}.</span>}
        </p>
      </div>
      <div className="cookie-actions">
        <button type="button" className="cookie-btn" onClick={() => answer("denied")}>
          Reject
        </button>
        <button type="button" className="cookie-btn" onClick={() => answer("granted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
