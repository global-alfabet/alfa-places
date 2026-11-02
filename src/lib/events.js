// Google Analytics 4 events for clicks, on top of the page views and contact clicks in consent.js. Every event goes
// through track(), which sends nothing until the visitor presses Accept. Params are fixed labels only: never names,
// emails, phone numbers, form contents, search words or the visitor's location.
//
// Mark a main call to action with data-cta="short_label" (and data-placement="hero" etc.). Links to other Global
// Alfabet sites are found by their address. Don't put data-cta on email, phone or WhatsApp links: consent.js already
// counts those as contact_click.
import { track } from "./consent.js";

// Each Global Alfabet site, by host, for product_click.
const PRODUCTS = {
  "globalalfabet.com": "global_alfabet",
  "www.globalalfabet.com": "global_alfabet",
  "maps.globalalfabet.com": "alfa_maps",
  "app.maps.globalalfabet.com": "alfa_maps",
  "finda.globalalfabet.com": "alfa_finda",
  "shop.globalalfabet.com": "alfa_shop",
  "account.globalalfabet.com": "global_alfabet_account",
};

const productFor = (host) => PRODUCTS[host] || "";

let on = false;
/** Starts listening for clicks. Call once in the browser, from an effect. */
export function listenForClicks() {
  if (on || typeof document === "undefined") return;
  on = true;
  const here = productFor(location.hostname);
  document.addEventListener(
    "click",
    (e) => {
      const el = e.target instanceof Element ? e.target.closest("a[href], button") : null;
      if (!el) return;
      const placement = el.dataset.placement ? { placement: el.dataset.placement } : {};
      // cta_click: a main call to action was pressed (cta: its fixed label; placement: where on the page)
      if (el.dataset.cta) track("cta_click", { cta: el.dataset.cta, ...placement });
      // product_click: a link to another Global Alfabet product's site (product: which one)
      if (el.tagName === "A") {
        let host = "";
        try {
          host = new URL(el.href, location.href).hostname;
        } catch {
          return;
        }
        const product = productFor(host);
        if (product && product !== here) track("product_click", { product, ...placement });
      }
    },
    true,
  );
}

// select_content: a blog post card was opened (content_type "blog_post", item_id: the post's slug)
export const openPost = (slug) => track("select_content", { content_type: "blog_post", item_id: slug });

/**
 * For page views of one thing (an item, a business): use as `useEffect(() => trackOnView(name, params), [...])`.
 * It waits until the page's effects have run, so consent.js is ready on the first page a visitor lands on.
 */
export function trackOnView(name, params) {
  const t = setTimeout(() => track(name, params), 0);
  return () => clearTimeout(t);
}
