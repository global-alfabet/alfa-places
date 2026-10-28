# Alfa Finda

**Find places worth knowing.** Businesses, attractions and places to visit, by
[Global Alfabet](https://www.globalalfabet.com). Lives at finda.globalalfabet.com.

- Search in plain language: "vets", "hotels", "waterfalls", or a kind of business with a town.
- Browse businesses by category, and places to visit with what to do and when to go.
- Plan a trip: pick interests, days and budget; get a day-by-day route that doesn't zig-zag across the country.
  Plans are shareable links.
- Businesses add themselves with a form (Netlify Forms). Every listing is checked before it goes live.

Frontend only: React 18 + Vite, no server. Accounts, reviews and business dashboards come later with the
Global Alfabet Account. Business listings are labelled examples until real businesses sign up.

```bash
npm ci
npm run dev      # http://localhost:5173
npm run check    # lint + build
```

## Put it online (Netlify)
1. In Netlify: **Add new site → Import from Git →** choose `global-alfabet/alfa-finda`. `netlify.toml` has the
   build settings.
2. **Domain management → Add a domain →** `finda.globalalfabet.com`, and make it the primary domain. The DNS is on
   Netlify, so it sets itself up.
3. **Forms →** turn on email notifications for `add-business`, so new businesses reach you.

### Moving from Alfa Places
Alfa Finda was called Alfa Places and lived at places.globalalfabet.com. Keep `places.globalalfabet.com` on the
Netlify site as a domain alias: `netlify.toml` redirects every old address to the same page on
finda.globalalfabet.com. The GitHub repository can be renamed from `alfa-places` to `alfa-finda` in its settings;
GitHub forwards the old address. Saved trips live in each visitor's browser, so ones saved on the old address
don't move to the new one.

Working with Claude Code: [`CLAUDE.md`](CLAUDE.md). Started from the BizDirect prototype.
