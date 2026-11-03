// Asks once whether we may use Google Analytics cookies (and the Meta Pixel's, when the site has a pixel ID), with
// Accept and Reject side by side and equally easy to press. Shows nothing until the page is running in the browser
// (so prerendered HTML matches), and nothing at all when the site has neither ID. "Cookie settings" links call
// openCookieSettings() to show it again.
import { useEffect, useState } from "react";
import { analyticsEnabled, currentChoice, initConsent, needsAnswer, pixelEnabled, setChoice } from "../lib/consent.js";

// What we ask to use. Without a Meta Pixel ID the wording is exactly as before.
function question(ga, pixel, countsVisits) {
  if (!pixel) {
    return countsVisits
      ? "We count visits without cookies. With your OK, we'd also use Google Analytics cookies to see which pages help people."
      : "We'd like to use Google Analytics cookies to count visits and see which pages help people.";
  }
  const what = ga
    ? "Google Analytics and Meta Pixel cookies to see which pages help people and how our ads perform"
    : "Meta Pixel cookies to see how our ads perform";
  return countsVisits ? `We count visits without cookies. With your OK, we'd also use ${what}.` : `We'd like to use ${what}.`;
}

export default function CookieBanner({ measurementId, metaPixel = "", policyHref, countsVisits = false }) {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState(false);
  useEffect(() => {
    initConsent(measurementId, { metaPixel });
    setOpen(needsAnswer());
    const again = () => {
      if (!analyticsEnabled()) return;
      setReview(true);
      setOpen(true);
    };
    window.addEventListener("ga:cookie-settings", again);
    return () => window.removeEventListener("ga:cookie-settings", again);
  }, [measurementId, metaPixel]);
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
          {question(!!measurementId, pixelEnabled(), countsVisits)}{" "}
          They're only set if you accept, and your choice covers Global Alfabet's sites. <a href={policyHref}>Cookie policy</a>
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
