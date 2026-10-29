# finda.globalalfabet.com: guide for Claude Code

Alfa Finda is a Global Alfabet product: businesses, attractions and places to visit, in one search. Its listings and
destinations are in Zimbabwe today. Global Alfabet is a global company: page copy, titles and examples don't name a
country or city (listings and destinations are data, and keep their real towns).
Version 1 is frontend only (React 18 + Vite + react-router, plain JavaScript). No server, no database, no accounts.
Sign-in, reviews and business dashboards arrive later with the shared Global Alfabet Account (test mode previews
them with example data).

## Layout
```
src/config.js               contact details and links (edit content here, not in components)
src/content/businesses.js   real business listings (from the Add your business form)
src/content/examples.js     fictional example businesses for test mode (site.demo). Delete at launch
src/content/photos.js       free-licensed photos used by example listings, with credits
src/content/demo-dashboard.js  test-mode extras: owners, enquiries, sample reviews, approvals, reports. Delete at launch
src/lib/store.js            test-mode state shared by the public pages and the dashboards (in memory only)
src/content/categories.js   categories (+ the words people search with), towns, provinces
src/content/destinations.js places to visit: real places, keep every fact accurate
src/lib/search.js           plain-language search ("vets in Harare" → category + town), filters, sorting, distance
src/lib/hours.js            opening hours and "Open now" in Zimbabwe time
src/components/BusinessMap.jsx  Leaflet map (lazy-loaded) for search results and business pages
src/lib/planner.js          trip planner: picks places near each other and builds the days
src/lib/trip.js             places a visitor saved, kept in their browser only
src/components/Scene.jsx    drawn illustrations of each destination, shown when its photo is missing or fails to load
src/components/DestinationArt.jsx  a destination's photo (destinations.js `photo`), falling back to the illustration
src/pages/                  Home, Search, Categories, Business, Destinations, Destination, Plan, AddBusiness, Privacy,
                            Credits (photo credits)
src/pages/dashboard/        test dashboards (site.demo only, lazy-loaded): SignIn, Owner* (/dashboard), Admin* (/admin)
src/components/dash/        dashboard shell, stat cards, switches, charts
src/styles/site.css         all styles; brand tokens at the top
public/                     logos from the brand kit (github.com/global-alfabet/brand). Don't redraw them here
```

## Commands
- `npm run dev`: live reload at http://localhost:5173
- `npm run check`: ESLint + production build. Must pass before any commit.

## Rules
- Design language: the Global Alfabet look, based on business.apple.com. White and #f5f5f7 sections, Inter, large
  confident headings, pill buttons, rounded 28px cards. Alfa Finda Compass Blue (`#005BBF`, from the Figma design:
  see docs/figma.md) is the one accent: `--accent` for fills and icons, `--accent-strong` for text and buttons,
  `--accent-soft` for tints. No new colours.
- Product names are always written in full: Alfa Finda, Alfa Maps, Alfa Shop, Global Alfabet Account.
- Listings must be honest:
  - Test mode (`demo: true` in src/config.js) adds the fictional businesses in src/content/examples.js so every feature
    can be tested: badges, sample ratings and reviews, hours, maps and photos. Every example is labelled "Example",
    the site shows a test banner, and example contact details are placeholders that reach nobody (no real-looking
    numbers: use `+263 00 000 0000` and `.example` emails). Set `demo: false` at launch to hide them all.
  - Real listings come from the "Add your business" form after Julius approves them. Only publish what the business sent.
  - Never invent ratings, reviews, phone numbers, addresses or badges for a real listing. Verified and Founding partner
    badges on real listings only when Julius grants them.
  - Business kinds: `company` (registered company, can be Verified), `small` (small business or sole trader),
    `freelancer` (works for themselves).
- Test dashboards (`/sign-in`, `/dashboard`, `/admin`) exist only in test mode. They work on example listings, keep
  every change in memory (src/lib/store.js), send nothing and save nothing, and say so on every page. Their numbers
  are samples, labelled as such. Real listings can't be changed from them. Don't add Billing, plans or prices until
  Julius decides them. Real dashboards arrive with the Global Alfabet Account.
- Photos must be free-licensed (CC0, CC BY, CC BY-SA, via Wikimedia Commons or Openverse; or the Unsplash License) or
  licensed by Julius (Adobe Stock). Never use a photo copied from another website. Keep each photo's author, licence
  and source with it (`destinations.js`, `photos.js`): `/credits` lists them all. Stock photos on example listings only
  show the kind of work; never present them as a real business's own photos.
- Destination facts must be true and checkable. Don't add prices or opening times that change; link to official
  sources instead.
- Copy: plain, specific, short sentences. Say "places to visit", "businesses", "plan a trip".
- Forms are Netlify Forms. Any field change goes in both `src/pages/AddBusiness.jsx` and the hidden form in `index.html`.
  Keep the hidden `subject` and `source` fields (they name the form and website in our notification email);
  `netlify/functions/submission-created.mjs` emails the sender a confirmation (needs RESEND_API_KEY in Netlify).
- Analytics: Google Analytics 4 only after the visitor accepts, through `src/lib/consent.js` (the same file on every
  Global Alfabet site; change it everywhere or nowhere). The ID goes in `analytics.ga4` in `src/config.js`. Never send
  names, emails, phone numbers or the visitor's location in events.
- Browser storage is only for the visitor's saved places and businesses. Wrap every read and write (see
  `src/lib/storage.js`). Never put the visitor's location in the address bar.
- Check layout at 1440px and 390px wide. No horizontal scrolling on phones.
- Never commit secrets. This site has none and needs none.
- Work on a branch and open a pull request. Julius approves every merge; `main` deploys to Netlify.
- Commit messages: conventional style, e.g. `feat(search): match towns`, `fix(plan): day count`.

## Adding a real business
Take the details from the Netlify form submission and add an entry to `src/content/businesses.js` with
`example: false`, plus `contact: { phone, whatsapp, email, website, address, map: [lat, lng] }` (`map` adds a Get directions link). If the business sends a logo, save it
as `public/logos/<id>.svg` (or `.png`, square) and add `logo: "/logos/<id>.svg"`; otherwise its category icon shows. The business page shows contact
details only for real listings. Add `kind`, and `tagline`, `services`, `hours`, `priceFrom` and `photos` when the
business sends them. When there are enough real ones, set `demo: false`, then delete examples.js and
demo-dashboard.js (and their imports in businesses.js), the example photos in photos.js and public/photos/examples,
and the test dashboards (src/pages/dashboard, src/components/dash, src/lib/store.js and their routes in App.jsx).
