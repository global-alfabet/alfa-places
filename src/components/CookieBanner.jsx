// The cookie question, the same file on every Global Alfabet website (Julius, 27 November 2026).
// - First it says what we use and offers OK and Manage. OK allows every kind this site uses (Google Analytics, and the
//   Meta Pixel when the site has a pixel ID). Nothing loads before an answer (src/lib/consent.js).
// - Manage lists the kinds with a switch each. Necessary is always on and can't be switched off (it's the cookie that
//   remembers the answer); the others start off, so Save choices with nothing touched allows necessary cookies only.
// - "Cookie settings" links call openCookieSettings(): the banner opens on the switches, showing the answers in force.
// Each kind keeps its own answer cookie, so an earlier analytics answer never switches Meta on.
// Shows nothing until the page is running in the browser (so prerendered HTML matches), and nothing at all when the
// site has neither ID.
import { useEffect, useRef, useState } from "react";
import { analyticsEnabled, choices, initConsent, needsAnswer, onChoiceChange, setChoices, tools } from "../lib/consent.js";

const KINDS = [
  {
    key: "analytics",
    title: "Analytics (Google Analytics)",
    text: "Counts visits and shows which pages help people.",
    ask: "Google Analytics cookies, which show us which pages help people",
  },
  {
    key: "advertising",
    title: "Advertising (Meta)",
    text: "Measures our ads on Facebook and Instagram and shows them again to people who visited. Meta receives the pages you open and your browser's details, may link them to your Facebook or Instagram account, and may process them outside your country.",
    ask: "Meta advertising cookies, which measure our Facebook and Instagram ads",
  },
];

export default function CookieBanner({ measurementId, metaPixel = "", metaPixelPages = null, policyHref, countsVisits = false }) {
  const [open, setOpen] = useState(false);
  const [managing, setManaging] = useState(false);
  const [picks, setPicks] = useState({ analytics: false, advertising: false });
  const firstSwitch = useRef(null);
  const managingRef = useRef(false);
  managingRef.current = managing;
  useEffect(() => {
    if (managing) firstSwitch.current?.focus(); // Manage opens the switches: start on the first one that can change
  }, [managing]);
  useEffect(() => {
    initConsent(measurementId, { metaPixel, metaPixelPages });
    setOpen(needsAnswer());
    const again = () => {
      if (!analyticsEnabled()) return;
      const now = choices();
      setPicks({ analytics: now.analytics === "granted", advertising: now.advertising === "granted" });
      setManaging(true);
      setOpen(true);
    };
    window.addEventListener("ga:cookie-settings", again);
    // An answer given in another tab: close this banner if it was only asking, or show the new answers on the switches.
    const off = onChoiceChange(() => {
      if (!managingRef.current) return setOpen(needsAnswer());
      const now = choices();
      setPicks({ analytics: now.analytics === "granted", advertising: now.advertising === "granted" });
    });
    return () => {
      window.removeEventListener("ga:cookie-settings", again);
      off();
    };
  }, [measurementId, metaPixel, metaPixelPages]);
  if (!open) return null;

  const used = tools();
  const kinds = KINDS.filter((k) => used[k.key]);
  const answer = (pick) => {
    setChoices(Object.fromEntries(kinds.map((k) => [k.key, pick(k) ? "granted" : "denied"])));
    setOpen(false);
    setManaging(false);
  };
  const policy = <a href={policyHref}>Cookie policy</a>;

  if (!managing) {
    return (
      <div className="cookie-banner" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-text">
        <div className="cookie-copy">
          <p id="cookie-title" className="cookie-title">
            Cookies
          </p>
          <p id="cookie-text">
            {countsVisits ? "We count visits without cookies. " : ""}Necessary cookies keep the site working. Press OK to also
            allow {kinds.map((k) => k.ask).join(", and ")}, or Manage to pick which ones. Your choice covers Global Alfabet's
            sites. {policy}
          </p>
        </div>
        <div className="cookie-actions">
          <button type="button" className="cookie-btn" onClick={() => setManaging(true)}>
            Manage
          </button>
          <button type="button" className="cookie-btn" onClick={() => answer(() => true)}>
            OK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cookie-banner is-detailed" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-text">
      <div className="cookie-copy">
        <p id="cookie-title" className="cookie-title">
          Cookie settings
        </p>
        <p id="cookie-text">
          Necessary cookies are always on. Choose which others we may use, then save. Your choice covers Global Alfabet's
          sites. {policy}
        </p>
      </div>
      <ul className="cookie-choices" aria-label="Cookie choices">
        <li>
          <label className="cookie-choice is-locked">
            <span>
              <strong>Necessary</strong>
              <span>Keep the site working, such as remembering this choice. Always on.</span>
            </span>
            <input type="checkbox" role="switch" className="cookie-switch" checked disabled readOnly />
          </label>
        </li>
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
      <div className="cookie-actions">
        <button type="button" className="cookie-btn" onClick={() => answer(() => true)}>
          Allow all
        </button>
        <button type="button" className="cookie-btn" onClick={() => answer((k) => picks[k.key])}>
          Save choices
        </button>
      </div>
    </div>
  );
}
