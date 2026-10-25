// Fictional data for the test dashboards (site.demo): owners, enquiries, extra sample reviews, businesses waiting
// for approval and reported reviews. None of these people, messages or businesses are real. Delete at launch,
// together with examples.js.
import { minutesAgo, pick, seeded } from "../lib/sample.js";

// Which kind of messages and reviews fit a category.
const GROUPS = {
  trade: [
    "plumbing",
    "electrical",
    "solar",
    "construction",
    "home-services",
    "cleaning",
    "automotive",
    "technology",
    "freelancers",
    "logistics",
  ],
  visit: ["restaurants", "hotels", "tourism", "safari", "entertainment"],
  care: ["veterinary", "health", "beauty", "education"],
  shop: ["retail", "agriculture"],
};
export const groupOf = (category) => Object.keys(GROUPS).find((g) => GROUPS[g].includes(category)) || "pro";

const FIRST = [
  "Tendai", "Rudo", "Simba", "Chipo", "Tapiwa", "Rutendo", "Blessing", "Nokuthula", "Thandiwe", "Sipho",
  "Themba", "Panashe", "Tanaka", "Vimbai", "Munashe", "Shingai", "Fadzai", "Tsitsi", "Nkosana", "Lindiwe",
];
const LAST = [
  "Moyo", "Ncube", "Sibanda", "Dube", "Ndlovu", "Mpofu", "Mutasa", "Gumbo", "Mhlanga", "Marufu",
  "Nyathi", "Banda", "Zhou", "Mapfumo", "Musonza", "Makoni", "Hove", "Mlambo", "Shumba", "Tshuma",
];

// Freelancers named after themselves keep their name.
const NAMED = {
  "tendai-moyo-plumbing": "Tendai Moyo",
  "farai-chikore-electrician": "Farai Chikore",
  "nyasha-solar-installations": "Nyasha Mutasa",
  "tatenda-painting": "Tatenda Hove",
  "braids-by-rumbi": "Rumbi Marufu",
  "mobile-mechanic-tino": "Tino Gumbo",
  "kudzai-web-studio": "Kudzai Zhou",
  "kuda-welding": "Kuda Mapfumo",
};

/** The fictional person who runs an example listing: { name, email, role }. */
export function ownerOf(b) {
  const rand = seeded(`owner:${b.id}`);
  const name = NAMED[b.id] || `${pick(rand, FIRST)} ${pick(rand, LAST)}`;
  const role = b.kind === "freelancer" ? "Owner" : b.kind === "company" ? pick(rand, ["Director", "General manager", "Operations manager"]) : "Owner";
  return { name, role, email: `${name.split(" ")[0].toLowerCase()}@${b.id}.example` };
}

// Customers have names no owner has, so a message never seems to come from the owner.
const CUSTOMERS = [
  "Ruvimbo M.", "Kundai K.", "Zanele N.", "Tinotenda C.", "Sibusiso S.", "Tawanda G.", "Yeukai Z.", "Mthokozisi D.",
  "Nyarai B.", "Tonderai R.", "Chiedza P.", "Bongani M.",
];

const service = (b, i = 0) => {
  const s = b.services?.[i % (b.services?.length || 1)];
  const name = typeof s === "string" ? s : s?.name;
  return name ? name.charAt(0).toLowerCase() + name.slice(1) : "your services";
};

// Message templates. Each is [customer messages, business reply or null].
function templates(b) {
  const place = [b.suburb, b.city].filter(Boolean).join(", ");
  const price = b.priceFrom ? `From $${b.priceFrom.amount} per ${b.priceFrom.unit}.` : "It depends on the job.";
  const pays = b.payments?.length ? b.payments.join(", ") : "cash";
  const common = [
    [[`Hi, I found you on Alfa Finda. I'd like to ask about ${service(b, 1)}. What's included?`], null],
    [
      [`Good afternoon. Roughly how much do you charge for ${service(b, 0)}?`],
      `Good afternoon! ${price} We confirm the full price before we start.`,
    ],
    [["Hello. Which payment methods do you take?"], `Hi! We take ${pays}.`],
    [["Thank you for this week. Everything is working well and we're very happy."], "Thank you for choosing us!"],
  ];
  const own = {
    trade: [
      [
        [`Hi, can you give me a quote for ${service(b, 0)}? I'm near ${place}.`, "Is Thursday morning possible?"],
        null,
      ],
      [[`Are you available this Saturday? I need help with ${service(b, 2)}.`], "Yes, we can come at 9am. Please send your address."],
    ],
    visit: [
      [["Hi, do you have space for six people this Saturday afternoon?"], null],
      [
        ["Hello, I'm visiting from Johannesburg in December. Can I book from outside Zimbabwe?"],
        "Yes, you can! Send us your dates and we'll confirm by WhatsApp.",
      ],
    ],
    care: [
      [["Hi, can I book an appointment for Friday morning?"], null],
      [[`Do I need to book for ${service(b, 0)}, or can I walk in?`], "Walk-ins are welcome, but booking means no waiting."],
    ],
    shop: [
      [["Hi, do you deliver to Avondale? What does delivery cost?"], null],
      [["Do you have stock this week, or should I order ahead?"], "We have stock. Order ahead for large quantities."],
    ],
    pro: [
      [["Hello. Can we meet this week to talk about what we need?"], null],
      [[`I'd like a quote for ${service(b, 0)} for a small business.`], "Thanks for asking. Can you share a few details first?"],
    ],
  };
  return [...own[groupOf(b.category)], ...common];
}

/** Sample enquiries in a business's inbox: two unread, the rest answered. */
export function sampleThreads(b, now = new Date()) {
  const rand = seeded(`threads:${b.id}`);
  const list = templates(b);
  const order = [0, 2, 1, 3, 4, 5].filter((i) => list[i]).slice(0, 5);
  const ago = [14, 190, 60 * 26, 60 * 24 * 3 + 40, 60 * 24 * 6];
  const offset = Math.floor(rand() * CUSTOMERS.length);
  return order.map((t, n) => {
    const [asks, reply] = list[t];
    const at = ago[n];
    const messages = asks.map((text, k) => ({ from: "customer", text, at: minutesAgo(at + (asks.length - k - 1) * 2, now) }));
    if (reply && n > 1) messages.push({ from: "business", text: reply, at: minutesAgo(Math.max(1, at - 25), now) });
    return {
      id: `${b.id}-t${n}`,
      name: CUSTOMERS[(offset + n * 5) % CUSTOMERS.length],
      unread: n < 2,
      starred: n === 2,
      archived: false,
      messages,
    };
  });
}

// Extra sample reviews, so review filters and replies have something to work on. One good review for every example,
// and a mixed one (3 or 2 stars) for two in three.
const REVIEWS = {
  trade: {
    5: "Booked through Alfa Finda. They came when they said they would and the price matched the quote.",
    4: "Good work. It took a little longer than planned, but they kept me updated.",
    3: "The job was done well, but I had to call twice to confirm the time. Better communication would help.",
    2: "The work was fine in the end, but they arrived three hours late and didn't let me know.",
  },
  visit: {
    5: "Lovely staff and everything was as described. We'll be back.",
    4: "Really enjoyed it. Busy on the weekend, so book ahead.",
    3: "Nice place, but we waited a long time to be served on a Saturday.",
    2: "Our booking wasn't on the system when we arrived. They sorted it, but it took a while.",
  },
  care: {
    5: "Kind, patient and clear about costs before starting.",
    4: "Very professional. The waiting area was full, so expect a short wait.",
    3: "Good care, but the appointment ran late and nobody told us why.",
    2: "The service was okay, but the price was higher than what I was told on the phone.",
  },
  shop: {
    5: "Had everything on my list and delivered the same day.",
    4: "Good prices. Queues on Saturday morning, so go early.",
    3: "Found most of what I needed, but two items were out of stock.",
    2: "Delivery came a day late and nobody called to say why.",
  },
  pro: {
    5: "Clear advice and quick replies on WhatsApp. Exactly what we needed.",
    4: "Good result. A couple of follow-ups were slow, but the work was solid.",
    3: "Helpful, but it took a week to get a reply to my first message.",
    2: "The work was fine, but the final bill had extras we hadn't discussed.",
  },
};

export function withSampleReviews(b, i) {
  const words = REVIEWS[groupOf(b.category)];
  const good = b.rating >= 4.7 ? 5 : 4;
  const extra = [
    { id: `${b.id}-s1`, name: CUSTOMERS[(i * 7) % CUSTOMERS.length], rating: good, date: `2026-10-${String(22 - (i % 14)).padStart(2, "0")}`, text: words[good] },
  ];
  if (i % 3 !== 2) {
    const low = i % 3 === 0 ? 2 : 3;
    extra.push({ id: `${b.id}-s2`, name: CUSTOMERS[(i * 7 + 3) % CUSTOMERS.length], rating: low, date: `2026-10-${String(16 - (i % 10)).padStart(2, "0")}`, text: words[low] });
  }
  const reviews = [...(b.reviews || []), ...extra].sort((x, y) => y.date.localeCompare(x.date));
  return { ...b, reviews };
}

// Businesses that sent the "Add your business" form and wait for approval (fictional). Approving one adds it to the
// directory as an example listing until the page reloads.
export const submissions = [
  {
    id: "mbare-morning-bakery",
    name: "Mbare Morning Bakery",
    kind: "small",
    category: "restaurants",
    city: "Harare",
    suburb: "Mbare",
    province: "Harare Metropolitan",
    owner: "Chipo Mlambo",
    submitted: "2026-10-24",
    tagline: "Fresh bread and cakes every morning",
    description: "Bread, buns and cakes baked every morning from 5am. Orders for schools, churches and events.",
    services: ["Bread and buns", "Celebration cakes", "Orders for events"],
  },
  {
    id: "deep-water-boreholes",
    name: "Deep Water Borehole Drilling",
    kind: "company",
    category: "plumbing",
    city: "Chinhoyi",
    suburb: "Orange Grove",
    province: "Mashonaland West",
    owner: "Simba Gumbo",
    submitted: "2026-10-23",
    tagline: "Borehole siting, drilling and pumps",
    description: "Borehole siting, drilling, casing and solar pump installation for homes, schools and farms.",
    services: ["Borehole siting", "Drilling and casing", "Solar pumps"],
  },
  {
    id: "thandis-tailoring",
    name: "Thandi's Tailoring",
    kind: "freelancer",
    category: "freelancers",
    city: "Bulawayo",
    suburb: "Lobengula",
    province: "Bulawayo Metropolitan",
    owner: "Thandiwe Nyathi",
    submitted: "2026-10-22",
    tagline: "School uniforms, alterations and dresses",
    description: "Alterations, school uniforms and made-to-measure dresses from a home studio.",
    services: ["Alterations", "School uniforms", "Made-to-measure"],
  },
  {
    id: "kwekwe-gate-motors",
    name: "Kwekwe Gate Motors",
    kind: "small",
    category: "electrical",
    city: "Kwekwe",
    suburb: "Newtown",
    province: "Midlands",
    owner: "Themba Ncube",
    submitted: "2026-10-21",
    tagline: "Gate motors, intercoms and electric fences",
    description: "Gate motors, intercoms and electric fences installed and repaired around Kwekwe and Redcliff.",
    services: ["Gate motors", "Intercoms", "Electric fences"],
  },
  {
    id: "solarpoint-bulawayo",
    name: "SolarPoint Bulawayo",
    kind: "company",
    category: "solar",
    city: "Bulawayo",
    suburb: "Belmont",
    province: "Bulawayo Metropolitan",
    owner: "Nkosana Dube",
    submitted: "2026-10-20",
    tagline: "Solar for shops, schools and clinics",
    description: "Solar systems and battery backup for shops, schools and clinics, with maintenance plans.",
    services: ["Commercial solar", "Battery backup", "Maintenance plans"],
  },
  {
    id: "rutendo-maths",
    name: "Rutendo Maths Lessons",
    kind: "freelancer",
    category: "education",
    city: "Mutare",
    suburb: "Murambi",
    province: "Manicaland",
    owner: "Rutendo Makoni",
    submitted: "2026-10-19",
    tagline: "O and A Level maths, one to one",
    description: "One-to-one and small-group maths lessons for O and A Level, at home or online.",
    services: ["O Level maths", "A Level maths", "Exam practice"],
  },
];

// Small businesses asking for the Verified badge after registering as a company (fictional).
export const verificationRequests = [
  { id: "city-of-kings-plumbing", note: "Registered as a private limited company in 2024. Certificate sent by email.", at: "2026-10-22" },
  { id: "sparkle-clean-harare", note: "Now a registered company with fifteen staff. Certificate and tax clearance sent.", at: "2026-10-20" },
];

// Reviews someone reported (fictional). review is a sample review id from withSampleReviews.
export const reviewReports = [
  { id: "r1", business: "aquaflow-plumbing", review: "aquaflow-plumbing-s2", by: "The business", reason: "We have no job booked under this name.", at: "2026-10-21" },
  { id: "r2", business: "brightline-electrical", review: "brightline-electrical-s2", by: "The business", reason: "The customer changed the time, so we weren't late.", at: "2026-10-19" },
  { id: "r3", business: "savanna-table", review: "savanna-table-s1", by: "A visitor", reason: "Looks like the owner wrote it.", at: "2026-10-17" },
];
