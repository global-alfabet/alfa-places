// Cookie consent and Google Analytics 4 (GA4) for Global Alfabet's sites. The same file is used on every site.
//
// - Nothing is measured until the visitor presses Accept: until then Google's script isn't loaded at all.
// - The answer is kept for 6 months in one first-party cookie, ga_consent ("granted" or "denied"). On
//   *.globalalfabet.com it's set for the whole domain, so one answer covers every Global Alfabet site. It only remembers
//   the choice, so it's strictly necessary and needs no consent itself.
// - A browser that sends Global Privacy Control counts as Reject, unless the visitor accepts in Cookie settings.
// - Reject later (Cookie settings) stops measuring at once and deletes Google Analytics' cookies.
// - Google signals and ad personalisation are off: no advertising features. Never send names, emails or phone numbers.
//
// Use: initConsent(measurementId) once in the browser; track("event_name", { ... }) for events; a banner component
// (CookieBanner.jsx) asks the question; a "Cookie settings" link calls openCookieSettings(). Without a measurement ID
// nothing loads and no banner shows.
const NAME = "ga_consent";
const MAX_AGE = 182 * 24 * 3600; // 6 months, then we ask again
const GA_COOKIE_AGE = 13 * 30 * 24 * 3600; // Google Analytics cookies last 13 months at most

let gaId = "";
let loaded = false;
let memory = null; // the answer for this page view when the browser blocks cookies
const listeners = new Set();
const inBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

/** Global Privacy Control: the browser asks sites not to sell or share data. */
const gpc = () => inBrowser() && navigator.globalPrivacyControl === true;

/** The visitor's saved answer: "granted", "denied", or null when they haven't answered. */
export function savedChoice() {
  if (!inBrowser()) return null;
  try {
    const m = document.cookie.match(/(?:^|;\s*)ga_consent=(granted|denied)/);
    return m ? m[1] : memory;
  } catch {
    return memory; // cookies blocked
  }
}

/** The answer in force: the saved one, or "denied" for a browser with Global Privacy Control, or null. */
export const currentChoice = () => savedChoice() || (gpc() ? "denied" : null);

/** True when the site measures visits (a measurement ID is set) and this visitor hasn't answered yet. */
export const needsAnswer = () => !!gaId && currentChoice() === null;

/** True when the site has analytics at all (a measurement ID is set). */
export const analyticsEnabled = () => !!gaId;

function cookieDomain() {
  const h = location.hostname;
  return /(^|\.)globalalfabet\.com$/.test(h) ? "; Domain=.globalalfabet.com" : "";
}

/** Save the visitor's answer ("granted" or "denied") and act on it straight away. */
export function setChoice(value) {
  const v = value === "granted" ? "granted" : "denied";
  try {
    document.cookie = `${NAME}=${v}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}${cookieDomain()}`;
  } catch {
    /* cookies blocked: the answer lasts until the page closes */
  }
  memory = v;
  if (v === "denied") clearAnalyticsCookies(); // also from a page that doesn't load analytics, e.g. a cookie policy page
  apply();
  listeners.forEach((fn) => fn(v));
}

/** Call once in the browser with the site's GA4 measurement ID ("G-…"). An empty ID turns analytics off. */
export function initConsent(measurementId) {
  if (!inBrowser()) return;
  gaId = /^G-[A-Z0-9]{4,}$/i.test(String(measurementId || "")) ? String(measurementId) : "";
  if (!gaId) return;
  listenForContactClicks();
  apply();
}

/** Run fn(choice) whenever the visitor changes their answer. Returns a function that stops listening. */
export function onChoiceChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Opens the cookie banner again so the visitor can change their answer (for a "Cookie settings" link). */
export function openCookieSettings() {
  if (inBrowser()) window.dispatchEvent(new Event("ga:cookie-settings"));
}

/** Sends an event to GA4, only when the visitor accepted. Never put names, emails or phone numbers in params. */
export function track(name, params = {}) {
  if (loaded && typeof window.gtag === "function") window.gtag("event", name, params);
}

function apply() {
  if (!gaId) return;
  const on = currentChoice() === "granted";
  if (on && !loaded) load();
  else if (!on) {
    if (loaded) {
      window.gtag("consent", "update", { analytics_storage: "denied" });
      window[`ga-disable-${gaId}`] = true;
      loaded = false;
    }
    clearAnalyticsCookies();
  }
}

function load() {
  window[`ga-disable-${gaId}`] = false;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag() {
      // gtag.js reads the arguments object itself, as Google's snippet does
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" });
    window.gtag("js", new Date());
  }
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("config", gaId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_expires: GA_COOKIE_AGE,
    ...(location.protocol === "https:" ? { cookie_flags: "SameSite=Lax;Secure" } : {}),
  });
  if (!document.querySelector("script[data-gtag]")) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    s.dataset.gtag = "1";
    document.head.appendChild(s);
  }
  loaded = true;
}

/** Deletes Google Analytics' cookies (_ga, _ga_<id>, _gid, _gat…) on this host and its parent domains. */
function clearAnalyticsCookies() {
  let names = [];
  try {
    names = document.cookie.split(";").map((c) => c.split("=")[0].trim()).filter((n) => /^(_ga(_|$)|_gid$|_gat)/.test(n));
  } catch {
    return;
  }
  if (!names.length) return;
  const parts = location.hostname.split(".");
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; Domain=.${parts.slice(i).join(".")}`);
  for (const n of names) for (const d of domains) document.cookie = `${n}=; Max-Age=0; Path=/${d}`;
}

// Clicks on email, phone and WhatsApp links count as "contact_click" (method: email | phone | whatsapp).
let clicksOn = false;
function listenForContactClicks() {
  if (clicksOn) return;
  clicksOn = true;
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const method = href.startsWith("mailto:") ? "email" : href.startsWith("tel:") ? "phone" : /^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href) ? "whatsapp" : "";
      if (method) track("contact_click", { method, ...(a.dataset.track ? { placement: a.dataset.track } : {}) });
    },
    true,
  );
}
