# places.globalalfabet.com: guide for Claude Code

Alfa Places is a Global Alfabet product: businesses, attractions and places to visit across Zimbabwe, in one search.
Version 1 is frontend only (React 18 + Vite + react-router, plain JavaScript). No server, no database, no accounts.
Sign-in, reviews and business dashboards arrive later with the shared Global Alfabet Account.

## Layout
```
src/config.js               contact details and links (edit content here, not in components)
src/content/businesses.js   business listings. Today: labelled EXAMPLES only (see rules)
src/content/categories.js   categories (+ the words people search with), towns, provinces
src/content/destinations.js places to visit: real places, keep every fact accurate
src/lib/search.js           plain-language search ("vets in Harare" → category + town)
src/lib/planner.js          trip planner: picks places near each other and builds the days
src/lib/trip.js             places a visitor saved, kept in their browser only
src/components/Scene.jsx    drawn illustrations of each destination, shown when its photo is missing or fails to load
src/components/DestinationArt.jsx  a destination's photo (destinations.js `photo`), falling back to the illustration
src/pages/                  Home, Search, Categories, Business, Destinations, Destination, Plan, AddBusiness, Privacy,
                            Credits (photo credits)
src/styles/site.css         all styles; brand tokens at the top
public/                     logos from the brand kit (github.com/global-alfabet/brand). Don't redraw them here
```

## Commands
- `npm run dev`: live reload at http://localhost:5173
- `npm run check`: ESLint + production build. Must pass before any commit.

## Rules
- Design language: the Global Alfabet look, based on business.apple.com. White and #f5f5f7 sections, Inter, large
  confident headings, pill buttons, rounded 28px cards. Alfa Places coral is the one accent: `--accent` for fills and
  icons, `--accent-strong` for text and buttons. No new colours.
- Product names are always written in full: Alfa Places, Alfa Maps, Alfa Shop, Global Alfabet Account.
- Listings must be honest:
  - Example listings have `example: true`, are labelled "Example" everywhere, and never show contact details,
    ratings or reviews.
  - Real listings come from the "Add your business" form after Julius approves them. Only publish what the business sent.
  - Never invent ratings, reviews, phone numbers, addresses or "verified" badges.
- Photos must be free-licensed (Wikimedia Commons: CC0, CC BY, CC BY-SA) or licensed by Julius (Adobe Stock). Never
  use a photo copied from another website. Keep each photo's author, licence and source in `destinations.js`: the
  destination page shows the credit and `/credits` lists them all.
- Destination facts must be true and checkable. Don't add prices or opening times that change; link to official
  sources instead.
- Copy: plain, specific, short sentences. Say "places to visit", "businesses", "plan a trip".
- Forms are Netlify Forms. Any field change goes in both `src/pages/AddBusiness.jsx` and the hidden form in `index.html`.
- Browser storage is only for the visitor's saved places. Wrap every read and write (see `src/lib/storage.js`).
- Check layout at 1440px and 390px wide. No horizontal scrolling on phones.
- Never commit secrets. This site has none and needs none.
- Work on a branch and open a pull request. Julius approves every merge; `main` deploys to Netlify.
- Commit messages: conventional style, e.g. `feat(search): match towns`, `fix(plan): day count`.

## Adding a real business
Take the details from the Netlify form submission and add an entry to `src/content/businesses.js` with
`example: false`, plus `contact: { phone, whatsapp, email, website, address }`. The business page shows contact
details only for real listings. When there are enough real ones, delete the examples and `ExampleNote`.
