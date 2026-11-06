// Asks whether we may use cookies, with every answer equally easy to give. The same file is used on every Global
// Alfabet website.
// - Without a Meta Pixel ID: Google Analytics only, with Reject and Accept (as before).
// - With a pixel ID: analytics (Google) and advertising (Meta) are asked separately, with Reject all, Choose and
//   Accept all; Choose shows a switch for each. Each answer has its own cookie (src/lib/consent.js), so an earlier
//   analytics Accept never switches Meta on, and people who answered before are asked about advertising.
// Shows nothing until the page is running in the browser (so prerendered HTML matches), and nothing at all when the
// site has neither ID. "Cookie settings" links call openCookieSettings() to show it again.
import { useEffect, useRef, useState } from "react";
import {
  analyticsEnabled,
  choices,
  currentChoice,
  initConsent,
  needsAnswer,
  onChoiceChange,
  pixelEnabled,
  setChoice,
  setChoices,
  tools,
} from "../lib/consent.js";

const KINDS = [
  {
    key: "analytics",
    name: "analytics",
    title: "Analytics (Google Analytics)",
    text: "Counts visits and shows which pages help people.",
    why: "from Google, to see which pages help people",
  },
  {
    key: "advertising",
    name: "advertising",
    title: "Advertising (Meta)",
    text: "Measures our ads on Facebook and Instagram and shows them again to people who visited. Meta receives the pages you open and your browser's details, may link them to your Facebook or Instagram account, and may process them outside your country.",
    why: "from Meta, to measure our Facebook and Instagram ads and show them to people who've visited",
  },
];

export default function CookieBanner({ measurementId, metaPixel = "", metaPixelPages = null, policyHref, countsVisits = false }) {
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [picks, setPicks] = useState({ analytics: false, advertising: false });
  const firstSwitch = useRef(null);
  const reviewing = useRef(false);
  reviewing.current = review;
  const [, refresh] = useState(0);
  useEffect(() => {
    if (choosing) firstSwitch.current?.focus(); // Choose opens the switches: start on the first one
  }, [choosing]);
  useEffect(() => {
    initConsent(measurementId, { metaPixel, metaPixelPages });
    setOpen(needsAnswer());
    const again = () => {
      if (!analyticsEnabled()) return;
      const now = choices();
      setPicks({ analytics: now.analytics === "granted", advertising: now.advertising === "granted" });
      setChoosing(false);
      setReview(true);
      setOpen(true);
    };
    window.addEventListener("ga:cookie-settings", again);
    // An answer given in another tab: close this banner if it was only asking, or show the new answers if it was
    // opened from Cookie settings.
    const off = onChoiceChange(() => {
      if (!reviewing.current) setOpen(needsAnswer());
      refresh((n) => n + 1);
    });
    return () => {
      window.removeEventListener("ga:cookie-settings", again);
      off();
    };
  }, [measurementId, metaPixel, metaPixelPages]);
  if (!open) return null;
  const close = () => {
    setOpen(false);
    setReview(false);
    setChoosing(false);
  };

  // Google Analytics only: the question as it has always been.
  if (!pixelEnabled()) {
    const answer = (v) => {
      setChoice(v);
      close();
    };
    const now = currentChoice();
    return (
      <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-text">
        <div className="cookie-copy">
          <p id="cookie-title" className="cookie-title">
            Cookies
          </p>
          <p id="cookie-text">
            {countsVisits
              ? "We count visits without cookies. With your OK, we'd also use Google Analytics cookies to see which pages help people."
              : "We'd like to use Google Analytics cookies to count visits and see which pages help people."}{" "}
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

  // Analytics and advertising, asked separately.
  const used = tools();
  const kinds = KINDS.filter((k) => used[k.key]);
  const all = (v) => {
    setChoices(Object.fromEntries(kinds.map((k) => [k.key, v])));
    close();
  };
  const save = () => {
    setChoices(Object.fromEntries(kinds.map((k) => [k.key, picks[k.key] ? "granted" : "denied"])));
    close();
  };
  const now = choices();
  const answered = kinds.filter((k) => now[k.key]);
  const lead = countsVisits ? "We count visits without cookies. With your OK, we'd also use" : "With your OK, we'd like to use";
  return (
    <div
      className="cookie-banner is-detailed"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-text"
    >
      <div className="cookie-copy">
        <p id="cookie-title" className="cookie-title">
          Cookies
        </p>
        <p id="cookie-text">
          {lead} cookies {kinds.map((k) => k.why).join(", and ")}. They're only set if you allow them, and your choice
          covers Global Alfabet's websites. <a href={policyHref}>Cookie policy</a>
          {review && answered.length > 0 && (
            <span className="cookie-now">
              {" "}
              You chose: {answered.map((k) => `${k.name} ${now[k.key] === "granted" ? "on" : "off"}`).join(", ")}.
            </span>
          )}
        </p>
      </div>
      {choosing && (
        <ul className="cookie-choices" aria-label="Cookie choices">
          {kinds.map((k, i) => (
            <li key={k.key}>
              <label className="cookie-choice">
                <span>
                  <strong>{k.title}</strong>
                  <span>{k.text}</span>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  className="cookie-switch"
                  ref={i === 0 ? firstSwitch : undefined}
                  checked={picks[k.key]}
                  onChange={(e) => setPicks((p) => ({ ...p, [k.key]: e.target.checked }))}
                />
              </label>
            </li>
          ))}
        </ul>
      )}
      <div className="cookie-actions">
        <button type="button" className="cookie-btn" onClick={() => all("denied")}>
          Reject all
        </button>
        {choosing ? (
          <button type="button" className="cookie-btn" onClick={save}>
            Save choices
          </button>
        ) : (
          <button type="button" className="cookie-btn" onClick={() => setChoosing(true)}>
            Choose
          </button>
        )}
        <button type="button" className="cookie-btn" onClick={() => all("granted")}>
          Accept all
        </button>
      </div>
    </div>
  );
}
