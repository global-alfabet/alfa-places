// Cloudflare Web Analytics: counts every visit, whatever the visitor answers on the cookie banner. It sets no cookies
// and stores nothing in the browser, so it needs no consent. Google Analytics stays Accept-only (src/lib/consent.js).
// The same file is used on every Global Alfabet site.
//
// The token comes from Cloudflare (Analytics & Logs, Web Analytics, Add a site, then the token in the JS snippet).
// It goes in `analytics.cloudflare` in src/config.js. Empty: nothing loads. It isn't a secret: it's in every page.
const BEACON = "https://static.cloudflareinsights.com/beacon.min.js";

/** Call once in the browser. Loads Cloudflare's beacon, which also counts page changes inside the app. */
export function initWebAnalytics(token) {
  if (typeof document === "undefined") return;
  const t = String(token || "").trim();
  if (!/^[A-Za-z0-9]{16,64}$/.test(t) || document.querySelector("script[data-cf-beacon]")) return;
  const s = document.createElement("script");
  s.defer = true;
  s.src = BEACON;
  s.dataset.cfBeacon = JSON.stringify({ token: t });
  document.head.appendChild(s);
}
