// Cookie consent, Google Analytics 4 (GA4) and the Meta Pixel for Global Alfabet's sites. The same file is used on
// every site, the Alfa Maps app included: change it everywhere or nowhere.
//
// Two answers, kept apart. Each lasts 6 months in its own first-party cookie, set for all of .globalalfabet.com, and
// only remembers the choice, so it's strictly necessary and needs no consent itself:
// - ga_consent: analytics (Google Analytics). Every site and the Alfa Maps app ask it.
// - ad_consent: advertising (the Meta Pixel). Only websites with a pixel ID ask it; the Alfa Maps app never sets it.
//   An analytics answer never switches Meta on: people who accepted analytics before are asked again.
// - Nothing loads until its own answer is "granted": until then neither Google's nor Meta's script is loaded.
// - A browser that sends Global Privacy Control counts as no to both, unless the visitor allows one in Cookie settings.
// - Turning either off stops it at once and deletes its cookies on our domains (_ga…, or _fbp and _fbc). An answer
//   changed in another tab or on another Global Alfabet site counts too: it's read again before every Meta event, on
//   every page change and when the tab comes back into view.
// - GA4: Google signals and ad personalisation are off, so no advertising features.
// - Meta Pixel (only with a pixel ID): sends PageView, which we send ourselves on each page (Meta's automatic tracking of
//   page changes is off), and Lead through trackLead(). Meta's automatic button-click and page data is off (autoConfig)
//   and there is no advanced matching. A site can limit the pixel to some pages (metaPixelPages): the pixel never loads
//   on other pages, nor in a visit that has been on one or came from one. From a page with the pixel, a link or
//   needsFullLoad() turns the move to such a page into a full page load before the address changes, so its address
//   never reaches Meta's code.
// - Never send names, emails, phone numbers, form contents or the visitor's location to either.
//
// Use: initConsent(measurementId, { metaPixel, metaPixelPages }) once in the browser; pageChanged() after every page
// change in a single-page site; needsFullLoad(address) before moving there in code; track("event_name", { ... }) for
// GA4 events; trackLead() when a form is sent. A banner
// component (CookieBanner.jsx) asks the question with needsAnswer(), choices() and setChoices(); a "Cookie settings" link
// calls openCookieSettings(). Without a measurement ID or a pixel ID nothing loads and no banner shows.
const COOKIES = { analytics: "ga_consent", advertising: "ad_consent" };
const MAX_AGE = 182 * 24 * 3600; // 6 months, then we ask again
const GA_COOKIE_AGE = 13 * 30 * 24 * 3600; // Google Analytics cookies last 13 months at most
const GA_COOKIES = /^(_ga(_|$)|_gid$|_gat)/;
const META_COOKIES = /^(_fbp|_fbc)$/;
const PIXEL_SCRIPT = "https://connect.facebook.net/en_US/fbevents.js";

let gaId = "";
let pixelId = "";
let pixelPages = null; // null: every page
let loaded = false; // GA4 is measuring
let pixelOn = false; // the Meta Pixel may send
let pixelInPage = false; // Meta's script is in this page
let pixelBarred = false; // this visit started on, or came from, a page without the pixel
let started = false;
let watching = false;
let known = null; // the answers this tab last acted on, to notice ones given in another tab
let lastPage = "";
const memory = { analytics: null, advertising: null }; // answers for this page view when the browser blocks cookies
const listeners = new Set();
const inBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";

/** Global Privacy Control: the browser asks sites not to sell or share data. */
const gpc = () => inBrowser() && navigator.globalPrivacyControl === true;

function saved(kind) {
  if (!inBrowser()) return null;
  try {
    const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIES[kind]}=(granted|denied)`));
    return m ? m[1] : memory[kind];
  } catch {
    return memory[kind]; // cookies blocked
  }
}

/** The visitor's saved analytics answer: "granted", "denied", or null when they haven't answered. */
export const savedChoice = () => saved("analytics");

/** The analytics answer in force: the saved one, or "denied" for a browser with Global Privacy Control, or null. */
export const currentChoice = () => saved("analytics") || (gpc() ? "denied" : null);

/** The advertising answer in force, the same way. */
export const currentAdChoice = () => saved("advertising") || (gpc() ? "denied" : null);

/** Both answers in force: { analytics, advertising }, each "granted", "denied" or null. */
export const choices = () => ({ analytics: currentChoice(), advertising: currentAdChoice() });

/** Which tools this site uses: { analytics: GA4 ID set, advertising: Meta Pixel ID set }. */
export const tools = () => ({ analytics: !!gaId, advertising: !!pixelId });

/** True when the site uses any of them (for "Cookie settings" links). */
export const analyticsEnabled = () => !!gaId || !!pixelId;

/** True when the site uses the Meta Pixel, so the banner asks about advertising too. */
export const pixelEnabled = () => !!pixelId;

/** True when the site uses a tool the visitor hasn't answered about yet. */
export const needsAnswer = () => (!!gaId && currentChoice() === null) || (!!pixelId && currentAdChoice() === null);

function cookieDomain() {
  const h = location.hostname;
  return /(^|\.)globalalfabet\.com$/.test(h) ? "; Domain=.globalalfabet.com" : "";
}

/**
 * Save answers and act on them straight away: setChoices({ analytics: "granted", advertising: "denied" }). Leave one
 * out to keep its current answer.
 */
export function setChoices(answers) {
  for (const kind of Object.keys(COOKIES)) {
    if (!answers[kind]) continue;
    const v = answers[kind] === "granted" ? "granted" : "denied";
    try {
      document.cookie = `${COOKIES[kind]}=${v}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}${cookieDomain()}`;
    } catch {
      /* cookies blocked: the answer lasts until the page closes */
    }
    memory[kind] = v;
  }
  // Also from a page that doesn't load the tool, e.g. a cookie policy page
  if (answers.analytics === "denied") clearCookies(GA_COOKIES);
  if (answers.advertising === "denied") clearCookies(META_COOKIES);
  known = choices();
  apply();
  listeners.forEach((fn) => fn(known.analytics, known.advertising));
}

/** Save the analytics answer ("granted" or "denied") and act on it straight away. */
export const setChoice = (value) => setChoices({ analytics: value });

/**
 * Call once in the browser with the site's GA4 measurement ID ("G-…") and, optionally, its Meta Pixel ID (digits) and
 * the pages the pixel may run on (["/", "/destinations/*"]; leave out for every page). An empty ID turns that tool off;
 * with both empty nothing loads and no banner shows.
 */
export function initConsent(measurementId, { metaPixel = "", metaPixelPages = null } = {}) {
  if (!inBrowser()) return;
  gaId = /^G-[A-Z0-9]{4,}$/i.test(String(measurementId || "")) ? String(measurementId) : "";
  pixelId = /^\d{6,20}$/.test(String(metaPixel || "").trim()) ? String(metaPixel).trim() : "";
  pixelPages = Array.isArray(metaPixelPages) ? metaPixelPages : null;
  if (!started) {
    started = true; // the page this visit started on, and the page before it
    pixelBarred = !pixelPage(location.pathname) || cameFromBarredPage();
  }
  if (!analyticsEnabled()) return;
  if (gaId) listenForContactClicks();
  watchOtherTabs();
  known = choices();
  apply();
}

/**
 * Run fn(analyticsChoice, advertisingChoice) whenever the visitor changes an answer, here or in another tab (a banner
 * still asking in this tab should then close). Returns a function that stops listening.
 */
export function onChoiceChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Opens the cookie banner again so the visitor can change their answers (for a "Cookie settings" link). */
export function openCookieSettings() {
  if (inBrowser()) window.dispatchEvent(new Event("ga:cookie-settings"));
}

/** Sends an event to GA4, only when the visitor allowed analytics. Never put names, emails or phone numbers in params. */
export function track(name, params = {}) {
  if (loaded && typeof window.gtag === "function") window.gtag("event", name, params);
}

/** Sends Meta's standard Lead event when a form was sent, only when the visitor allowed advertising. It carries nothing else. */
export function trackLead() {
  if (pixelOn && adStillAllowed() && pixelHere()) window.fbq("track", "Lead");
}

/**
 * True when moving to this address must be a full page load: Meta's code is in this page and may not run there. Check
 * it before moving in code (navigate()), and use location.assign() instead. Links are handled already.
 */
export function needsFullLoad(address) {
  if (!inBrowser() || !pixelInPage) return false;
  try {
    const to = new URL(address, location.href);
    return to.origin === location.origin && !pixelPage(to.pathname);
  } catch {
    return false;
  }
}

/** Call after every page change in a single-page site. Picks up answers changed elsewhere and sends the PageView. */
export function pageChanged() {
  if (!inBrowser() || !analyticsEnabled()) return;
  if (pixelId && !pixelPage(location.pathname)) {
    // Moves here are full page loads (needsFullLoad, links); this catches any other way, such as Back.
    if (pixelInPage) return location.reload();
    pixelBarred = true; // this visit has been on a page without the pixel: keep it off
  }
  sync();
  if (pixelOn) pageView();
}

function apply() {
  const analytics = currentChoice() === "granted";
  const advertising = currentAdChoice() === "granted";
  if (gaId) {
    if (analytics && !loaded) load();
    else if (!analytics) {
      if (loaded) {
        window.gtag("consent", "update", { analytics_storage: "denied" });
        window[`ga-disable-${gaId}`] = true;
        loaded = false;
      }
      clearCookies(GA_COOKIES);
    }
  }
  if (pixelId) {
    if (advertising && !pixelOn) startPixel();
    else if (!advertising) {
      if (pixelOn) {
        window.fbq("consent", "revoke"); // Meta's script sends nothing more
        pixelOn = false;
        lastPage = "";
      }
      clearCookies(META_COOKIES);
    }
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

const pathOf = (path) => String(path || "/").replace(/\/+$/, "") || "/";

/** May the pixel run on this path? Entries are exact paths ("/plan") or prefixes ending in "/*" ("/destinations/*"). */
function pixelPage(path) {
  if (!pixelPages) return true;
  const p = pathOf(path);
  return pixelPages.some((entry) => (entry.endsWith("/*") ? p.startsWith(entry.slice(0, -1)) : p === pathOf(entry)));
}

function cameFromBarredPage() {
  try {
    const from = new URL(document.referrer);
    return from.origin === location.origin && !pixelPage(from.pathname);
  } catch {
    return false; // no referrer, or not an address
  }
}

const pixelHere = () => !pixelBarred && pixelPage(location.pathname);

/** Another tab, or another Global Alfabet site, may have changed the answer: if it's no longer "granted", stop now. */
function adStillAllowed() {
  if (currentAdChoice() === "granted") return true;
  sync(); // revokes Meta's consent and deletes _fbp and _fbc
  return false;
}

/** Acts on the answers in force, and tells listeners when one was given in another tab since this tab last looked. */
function sync() {
  const now = choices();
  const changed = known && (now.analytics !== known.analytics || now.advertising !== known.advertising);
  known = now;
  apply();
  if (changed) listeners.forEach((fn) => fn(now.analytics, now.advertising));
}

/** Acts on answers changed in another tab as soon as this one is back in view (or at once, where browsers say so). */
function watchOtherTabs() {
  if (watching) return;
  watching = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") sync();
  });
  try {
    window.cookieStore?.addEventListener("change", (e) => {
      const names = [...(e.changed || []), ...(e.deleted || [])].map((c) => c.name);
      if (names.some((n) => Object.values(COOKIES).includes(n))) sync();
    });
  } catch {
    /* no cookie change events in this browser */
  }
}

/**
 * With a page list, Meta's code must never see the address of a page outside it: links to those pages become full
 * page loads before the address changes, and so does any other move inside the site (history), as a backstop. The
 * history guard stays outermost even if Meta's script wraps pushState later (it ignores disablePushState, say): the
 * address is checked before any wrapper gets it, and a wrapper that calls back into it reaches the browser's own.
 */
let guarding = false;
function guardMoves() {
  if (guarding || !pixelPages) return;
  guarding = true;
  window.addEventListener(
    "click",
    (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      if (!needsFullLoad(a.href)) return;
      e.preventDefault(); // before the site's router sees the click
      location.assign(a.href);
    },
    true,
  );
  for (const name of ["pushState", "replaceState"]) {
    const native = history[name];
    let outer = null; // whatever wraps it later
    let inside = false;
    const guarded = function guarded(state, unused, address) {
      if (address != null && needsFullLoad(address)) return location.assign(new URL(address, location.href).href);
      if (inside || !outer) return native.apply(history, arguments);
      inside = true;
      try {
        return outer.apply(history, arguments);
      } finally {
        inside = false;
      }
    };
    try {
      Object.defineProperty(history, name, {
        configurable: true,
        get: () => guarded,
        set: (fn) => {
          outer = fn;
        },
      });
    } catch {
      history[name] = guarded;
    }
  }
}

/** Meta's base code (the fbq queue that fbevents.js picks up), written out here so nothing runs inline. */
function startPixel() {
  if (!pixelHere()) return; // pageChanged() starts it on a page where it may run
  guardMoves(); // before Meta's code arrives
  if (typeof window.fbq !== "function") {
    const fbq = function fbq() {
      if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
      else fbq.queue.push(arguments);
    };
    if (!window._fbq) window._fbq = fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    fbq.disablePushState = true; // we send PageView ourselves, only on pages where the pixel may run
    window.fbq = fbq;
    fbq("set", "autoConfig", false, pixelId); // no automatic button-click or page data
    fbq("init", pixelId); // no second argument: no advanced matching
  }
  window.fbq("consent", "grant");
  pixelOn = true;
  pageView();
  if (!document.querySelector("script[data-meta-pixel]")) {
    const s = document.createElement("script");
    s.async = true;
    s.src = PIXEL_SCRIPT;
    s.dataset.metaPixel = "1";
    document.head.appendChild(s);
  }
  pixelInPage = true;
}

function pageView() {
  const page = pathOf(location.pathname);
  if (!pixelOn || page === lastPage || !adStillAllowed()) return; // one PageView per page, while still allowed
  lastPage = page;
  window.fbq("track", "PageView");
}

/** Deletes the cookies whose names match, on this host and its parent domains. */
function clearCookies(pattern) {
  let names = [];
  try {
    names = document.cookie
      .split(";")
      .map((c) => c.split("=")[0].trim())
      .filter((n) => pattern.test(n));
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
