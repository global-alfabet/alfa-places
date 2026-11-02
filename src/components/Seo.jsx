import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getMeta, jsonLdText } from "../lib/seo.js";

// Keeps the canonical address, robots tag, share tags and structured data in step with the page as a visitor moves
// around. The first page they open already has them in its HTML (scripts/prerender.js). Titles and descriptions
// are set by each page (usePageTitle).
function setTag(selector, create, attr, value) {
  let el = document.head.querySelector(selector);
  if (value == null || value === "") {
    el?.remove();
    return;
  }
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const meta = (key, name) => () => {
  const el = document.createElement("meta");
  el.setAttribute(key, name);
  return el;
};

export default function Seo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = getMeta(pathname);
    const property = (name, value) => setTag(`meta[property="${name}"]`, meta("property", name), "content", value);
    setTag('meta[name="robots"]', meta("name", "robots"), "content", m.noindex ? "noindex, follow" : null);
    setTag(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement("link"), { rel: "canonical" }),
      "href",
      m.canonical,
    );
    property("og:title", m.title);
    property("og:description", m.description);
    property("og:url", m.canonical);
    property("og:image", m.image.url);
    property("og:image:alt", m.image.alt);

    let script = document.getElementById("page-jsonld");
    if (!m.jsonLd.length) script?.remove();
    else {
      if (!script) {
        script = Object.assign(document.createElement("script"), { type: "application/ld+json", id: "page-jsonld" });
        document.head.appendChild(script);
      }
      script.textContent = jsonLdText(m.jsonLd);
    }
  }, [pathname]);
  return null;
}
