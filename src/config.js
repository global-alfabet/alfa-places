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
  analytics: { ga4: "G-47R00SKKE8" },
  // Our social media profiles, shown in the footer. TODO: Julius sends the real links; "#" is a placeholder.
  // Leave one empty ("") to hide it.
  social: {
    instagram: "#",
    facebook: "#",
    linkedin: "#",
    youtube: "#",
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
