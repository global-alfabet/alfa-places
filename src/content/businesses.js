// Business listings. Real ones (example: false) come from the "Add your business" form after Julius approves them,
// and show their contact details. In test mode (site.demo in config.js) the fictional examples in examples.js are
// added after them. Those are labelled "Example" everywhere; delete examples.js and the import below at launch.
//
// Fields every listing can have: kind ("company", "small" or "freelancer"), verified and founding (badges Julius
// grants after checking a business), tagline, services (strings or { name, text }), tags, priceFrom, priceRange,
// hours, payments, languages, founded, team, serviceArea, at or contact.map ([lat, lng]) and photos.
// Never invent ratings, reviews, phone numbers, addresses or badges for a real listing.
import { site } from "../config.js";
import { examples } from "./examples.js";
import { withPhotos } from "./photos.js";

const real = [
  {
    id: "global-alfabet",
    logo: "/logos/global-alfabet.svg",
    name: "Global Alfabet",
    example: false,
    kind: "company",
    category: "technology",
    city: "Harare",
    province: "Harare Metropolitan",
    description:
      "A technology company that builds and runs digital products (Alfa Maps, Alfa Finda and Alfa Shop) and designs and builds websites and platforms for businesses.",
    services: ["Website development", "UI/UX design", "Digital product strategy"],
    products: ["Alfa Maps", "Alfa Finda", "Alfa Shop"],
    payments: [],
    languages: ["English"],
    amenities: [],
    keywords: ["web design", "web developers", "website", "software", "apps", "digital"],
    featured: true,
    contact: {
      phone: "+263 772 906 967",
      whatsapp: "+263 772 906 967",
      email: "hello@globalalfabet.com",
      website: "https://www.globalalfabet.com",
    },
  },
  {
    id: "alfa-maps",
    logo: "/logos/alfa-maps.svg",
    name: "Alfa Maps",
    example: false,
    kind: "company",
    category: "real-estate",
    city: "Harare",
    province: "Harare Metropolitan",
    description:
      "Interactive 3D estate maps for property developers. Buyers explore every plot on their phone, try house designs, and see prices and payment plans before they call your sales team. A Global Alfabet product.",
    services: [
      "3D estate maps from your layout plan",
      "House designer for buyers",
      "Prices and payment plans per plot",
      "PDF plot packs",
    ],
    products: [],
    payments: [],
    languages: ["English"],
    amenities: [],
    keywords: ["3d", "estate", "developers", "stands", "plots", "land", "property developers"],
    featured: true,
    contact: {
      phone: "+263 772 906 967",
      whatsapp: "+263 772 906 967",
      email: "hello@globalalfabet.com",
      website: "https://maps.globalalfabet.com",
    },
  },
  {
    id: "jetwash",
    logo: "/logos/jetwash.svg",
    name: "JetWash (Pvt) Ltd",
    example: false,
    kind: "company",
    category: "cleaning",
    city: "Harare",
    province: "Harare Metropolitan",
    description:
      "An industrial cleaning and maintenance company, established in 1998. JetWash does high-pressure cleaning, machinery maintenance, boiler and tank cleaning, fuel tanker degassing, drain and sewer unblocking, and commercial and residential cleaning, with specialised equipment.",
    services: [
      "High-pressure cleaning",
      "Industrial machinery maintenance",
      "Boiler and tank cleaning",
      "Fuel tanker degassing",
      "Drain and sewer unblocking",
      "Commercial and residential cleaning",
    ],
    products: [],
    payments: [],
    languages: [],
    amenities: [],
    keywords: [
      "jet wash",
      "industrial cleaning",
      "pressure washing",
      "degassing",
      "boiler",
      "tank",
      "sewer",
      "drains",
      "unblocking",
    ],
    featured: true,
    contact: {
      phone: "+263 772 327 148",
      whatsapp: "+263 772 906 967",
      email: "info@jetwash.co.zw",
      map: [-17.876306, 31.049917], // 17°52'34.7"S 31°02'59.7"E
    },
  },
];

export const businesses = [...real, ...(site.demo ? withPhotos(examples).map((b) => ({ ...b, example: true })) : [])];
