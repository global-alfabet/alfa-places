// Alfa Finda details used across the site. Edit here, not in the pages.
export const site = {
  name: "Alfa Finda",
  url: "https://finda.globalalfabet.com",
  email: "hello@globalalfabet.com",
  phone: "+263 772 906 967",
  whatsapp: "263772906967", // digits only, used for wa.me links
  parent: { name: "Global Alfabet", url: "https://www.globalalfabet.com" },
  maps: "https://maps.globalalfabet.com",
  // Google Analytics 4 measurement ID ("G-…"). Julius pastes it here. Empty: no analytics and no cookie banner.
  // Analytics only runs after a visitor presses Accept (src/lib/consent.js).
  analytics: {
    ga4: "G-47R00SKKE8",
    // Cloudflare Web Analytics token: counts every visit without cookies (src/lib/webAnalytics.js). Empty: off.
    cloudflare: "39246bebf1494531914459c105726428",
    // Meta Pixel ID (digits only, from Meta Events Manager). Empty: no pixel. It loads only after a visitor allows
    // advertising on the cookie banner (src/lib/consent.js), and sends only PageView and Lead (a business was added).
    // Before you fill it in: Julius approves the privacy and cookie wording (src/pages/Privacy.jsx shows it then).
    metaPixel: "",
    // The only pages the pixel runs on, as the privacy notice lists them. Never search results, business pages or trip
    // plans: their addresses carry what people search for and the businesses they open (health and medical included).
    // A visit that has been on, or comes from, another page keeps the pixel off, and moving from a page with the pixel
    // to another page is a full page load, so Meta's code never sees its address.
    metaPixelPages: ["/", "/categories", "/destinations", "/destinations/*", "/add-your-business"],
  },
  // Search engine ownership checks. Paste only the code from content="…" (Google Search Console: "HTML tag";
  // Bing Webmaster Tools: "Meta tag"). Empty: no tag. Not needed for a domain verified with a DNS TXT record.
  verification: {
    google: "", // <meta name="google-site-verification">
    bing: "", // <meta name="msvalidate.01">
  },
  // Our social media profiles, shown in the footer.
  // Leave one empty ("") to hide it.
  social: {
    instagram: "https://www.instagram.com/globalalfabet/",
    facebook: "https://www.facebook.com/profile.php?id=100086531795259",
    linkedin: "https://www.linkedin.com/company/global-alfabet/",
    youtube: "https://www.youtube.com/@GlobalAlfabet",
  },
  // Test mode. While true, the site shows a banner and the fictional example businesses in src/content/examples.js
  // (badges, sample ratings and reviews included). Set to false at launch: only real listings stay.
  demo: true,
  // Map tiles for the search and business maps. OpenStreetMap's own tiles are fine for testing; switch to a tile
  // provider with a plan (MapTiler, Stadia, Mapbox) before launch, and keep the attribution.
  mapTiles: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
};
