// Search and sharing details for every page: title, description, canonical address, share image and structured
// data (JSON-LD). Used at build time to write each page's HTML (scripts/prerender.js) and in the browser to keep
// the canonical address, share tags and structured data right as a visitor moves around (components/Seo.jsx).
// Page titles and descriptions in the browser come from usePageTitle in each page: keep the two in step.
// Example listings (test mode) are kept out of search results; real listings and places to visit are indexed.
import { site } from "../config.js";
import { businesses } from "../content/businesses.js";
import { categories, categoryById } from "../content/categories.js";
import { destinations } from "../content/destinations.js";
import { DEFAULT_TITLE, DEFAULT_DESCRIPTION, clip } from "./usePageTitle.js";

export const SITE_URL = site.url.replace(/\/$/, "");
const absolute = (path) => (/^https?:/.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`);
const ORG_ID = `${site.parent.url}/#organization`;

const SHARE_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Alfa Finda: find places worth going to. Businesses, attractions and places to visit, in one search.",
};

// The same titles and descriptions the pages pass to usePageTitle.
const pages = {
  "/": { fullTitle: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION },
  "/categories": {
    title: "Businesses",
    description: "Browse businesses by category: food, places to stay, tours, vets, mechanics and more.",
    crumb: "Businesses",
  },
  "/search": { title: "Search", description: DEFAULT_DESCRIPTION, crumb: "Search" },
  "/destinations": {
    title: "Places to visit",
    description: "Waterfalls, national parks, ancient stone cities and mountains: places worth the trip.",
    crumb: "Places to visit",
  },
  "/plan": {
    title: "Plan a trip",
    description: "Pick your interests, days and budget, and get a day-by-day trip.",
    crumb: "Plan a trip",
  },
  "/add-your-business": {
    title: "Add your business",
    description: "List your business or freelance work on Alfa Finda so customers and travellers can find you.",
    crumb: "Add your business",
  },
  "/privacy": { title: "Privacy", description: DEFAULT_DESCRIPTION, crumb: "Privacy" },
  "/credits": { title: "Photo credits", description: DEFAULT_DESCRIPTION, crumb: "Photo credits" },
  // Test-mode dashboards: never in search results.
  ...(site.demo
    ? {
        "/sign-in": { title: "Sign in", description: DEFAULT_DESCRIPTION, noindex: true },
        "/dashboard": { title: "Business dashboard", description: DEFAULT_DESCRIPTION, noindex: true },
        "/admin": { title: "Admin", description: DEFAULT_DESCRIPTION, noindex: true },
      }
    : {}),
};

const NOT_FOUND = { title: "Page not found · Alfa Finda", description: DEFAULT_DESCRIPTION, noindex: true };

const businessById = Object.fromEntries(businesses.map((b) => [b.id, b]));
const destinationBySlug = Object.fromEntries(destinations.map((d) => [d.slug, d]));

// Every address that gets its own HTML file at build time.
export const routes = [
  ...Object.keys(pages),
  ...destinations.map((d) => `/destinations/${d.slug}`),
  ...businesses.map((b) => `/business/${b.id}`),
];

function organization() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.parent.name,
    url: `${site.parent.url}/`,
    logo: {
      "@type": "ImageObject",
      url: `${site.parent.url}/brand/global-alfabet/global-alfabet-icon-512.png`,
      width: 512,
      height: 512,
    },
    email: site.email,
    // Our social profiles: tells search engines and AI assistants these accounts are ours.
    sameAs: Object.values(site.social).filter(Boolean),
    brand: [
      { "@type": "Brand", name: site.name, url: `${SITE_URL}/` },
      { "@type": "Brand", name: "Alfa Maps", url: site.maps },
    ],
  };
}

function website() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: site.name,
    description: "Businesses, attractions and places to visit, in one search.",
    inLanguage: "en",
    publisher: { "@id": ORG_ID },
  };
}

function breadcrumbs(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [["Alfa Finda", "/"], ...trail].map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: absolute(path),
    })),
  };
}

// A real place to visit. Facts come from destinations.js, which keeps them accurate.
function attraction(d, url) {
  return {
    "@type": "TouristAttraction",
    name: d.name,
    ...(d.aka?.length ? { alternateName: d.aka } : {}),
    description: [d.summary, d.description].filter(Boolean).join(" "),
    url,
    ...(d.photo?.small ? { image: d.photo.small } : {}),
    ...(d.at ? { geo: { "@type": "GeoCoordinates", latitude: d.at[0], longitude: d.at[1] } } : {}),
    ...(d.location ? { address: { "@type": "PostalAddress", addressLocality: d.location } } : {}),
  };
}

const normalise = (pathname) => (pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname) || "/";

/** Everything the <head> needs for one address. */
export function getMeta(pathname) {
  const path = normalise(pathname);
  const image = { ...SHARE_IMAGE, url: absolute(SHARE_IMAGE.url) };

  // The test dashboards' own pages (/dashboard/reviews) share the dashboard's details.
  const dash = path.match(/^\/(dashboard|admin)\/./);
  if (dash && site.demo) return getMeta(`/${dash[1]}`);

  const d = path.startsWith("/destinations/") ? destinationBySlug[path.slice("/destinations/".length)] : null;
  if (d) {
    const url = absolute(path);
    return {
      title: `${d.name} · Alfa Finda`,
      description: clip(d.summary),
      canonical: url,
      type: "website",
      image: d.photo?.small ? { url: d.photo.small, alt: d.photo.caption || d.name } : image,
      jsonLd: [
        attraction(d, url),
        breadcrumbs([
          ["Places to visit", "/destinations"],
          [d.name, path],
        ]),
      ],
    };
  }

  const b = path.startsWith("/business/") ? businessById[path.slice("/business/".length)] : null;
  if (b) {
    const cat = categoryById[b.category];
    return {
      title: `${b.name} · Alfa Finda`,
      description: clip(b.tagline || b.description || DEFAULT_DESCRIPTION),
      // Example listings are fictional (test mode): keep them out of search results.
      canonical: b.example ? null : absolute(path),
      noindex: Boolean(b.example),
      type: "website",
      image,
      jsonLd: b.example
        ? []
        : [
            breadcrumbs([
              [cat?.name || "Businesses", "/categories"],
              [b.name, path],
            ]),
          ],
    };
  }

  const page = pages[path];
  if (!page) return { ...NOT_FOUND, canonical: null, type: "website", image, jsonLd: [] };
  const jsonLd = path === "/" ? [organization(), website()] : page.crumb ? [breadcrumbs([[page.crumb, path]])] : [];
  return {
    title: page.fullTitle || `${page.title} · Alfa Finda`,
    description: clip(page.description),
    canonical: page.noindex ? null : absolute(path),
    noindex: Boolean(page.noindex),
    type: "website",
    image,
    jsonLd,
  };
}

const escape = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

/** JSON-LD as text that is safe inside a <script> tag. */
export const jsonLdText = (list) =>
  JSON.stringify(
    list.length === 1
      ? { "@context": "https://schema.org", ...list[0] }
      : { "@context": "https://schema.org", "@graph": list },
  ).replace(/</g, "\\u003c");

// Search engine ownership checks (site.verification in src/config.js): the code from content="…", or the whole tag
// if that's what was pasted. Empty: no tag.
const verificationCode = (value) => {
  const v = String(value || "").trim();
  return (v.match(/content=["']([^"']+)["']/)?.[1] || v).replace(/[^\w-]/g, "");
};
const VERIFICATION = [
  ["google-site-verification", verificationCode(site.verification?.google)],
  ["msvalidate.01", verificationCode(site.verification?.bing)],
].filter(([, code]) => code);

/** The <head> tags for one page, as HTML. Used by the build. */
export function headTags(meta) {
  const tags = [
    ...VERIFICATION.map(([name, code]) => `<meta name="${name}" content="${code}" />`),
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    meta.noindex ? `<meta name="robots" content="noindex, follow" />` : "",
    meta.canonical ? `<link rel="canonical" href="${escape(meta.canonical)}" />` : "",
    `<meta property="og:site_name" content="${escape(site.name)}" />`,
    `<meta property="og:locale" content="en_GB" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    meta.canonical ? `<meta property="og:url" content="${escape(meta.canonical)}" />` : "",
    `<meta property="og:image" content="${escape(meta.image.url)}" />`,
    meta.image.width ? `<meta property="og:image:width" content="${meta.image.width}" />` : "",
    meta.image.height ? `<meta property="og:image:height" content="${meta.image.height}" />` : "",
    `<meta property="og:image:alt" content="${escape(meta.image.alt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:image" content="${escape(meta.image.url)}" />`,
    `<meta name="twitter:image:alt" content="${escape(meta.image.alt)}" />`,
    meta.jsonLd.length ? `<script type="application/ld+json" id="page-jsonld">${jsonLdText(meta.jsonLd)}</script>` : "",
  ];
  return tags.filter(Boolean).join("\n    ");
}

/** sitemap.xml: every page that search engines should index. */
export function sitemap() {
  const entries = routes
    .filter((path) => !getMeta(path).noindex)
    .map((path) => `  <url><loc>${absolute(path)}</loc></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;
}

/** llms.txt: a plain summary of the site for AI assistants (https://llmstxt.org). */
export function llmsTxt() {
  const real = businesses.filter((b) => !b.example);
  return [
    `# ${site.name}`,
    "",
    `> ${site.name} is a ${site.parent.name} product: a search for businesses, attractions and places to visit. Each business has a profile with its services, hours and contact details. Travellers can browse places to visit and plan a trip day by day. Businesses add themselves with a short form, and every listing is checked before it goes live.`,
    "",
    ...(site.demo
      ? [
          "Alfa Finda is in test mode: listings marked Example are fictional and show how the site works. They are not real businesses and their contact details reach nobody.",
          "",
        ]
      : []),
    "## Pages",
    `- [Search businesses](${absolute("/search")}): search in plain words, such as "vets" or "places to stay"`,
    `- [Businesses by category](${absolute("/categories")})`,
    `- [Places to visit](${absolute("/destinations")})`,
    `- [Plan a trip](${absolute("/plan")}): pick interests, days and budget and get a day-by-day plan`,
    `- [Add your business](${absolute("/add-your-business")})`,
    "",
    "## Places to visit",
    ...destinations.map((d) => `- [${d.name}](${absolute(`/destinations/${d.slug}`)}): ${d.summary}`),
    "",
    "## Business listings",
    ...real.map((b) => `- [${b.name}](${absolute(`/business/${b.id}`)}): ${clip(b.tagline || b.description)}`),
    "",
    "## Categories",
    `- ${categories.map((c) => c.name).join(", ")}`,
    "",
    "## Contact",
    `- Email: ${site.email}`,
    "",
    `## Other ${site.parent.name} websites`,
    `- [${site.parent.name}](${site.parent.url}): the company behind Alfa Finda. It also designs and builds websites for businesses.`,
    `- [Alfa Maps](${site.maps}): interactive 3D estates that property developers use to sell plots and houses.`,
    "",
  ].join("\n");
}
