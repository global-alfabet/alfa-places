# Alfa Places

**Find places worth knowing.** Businesses, attractions and places to visit across Zimbabwe, by
[Global Alfabet](https://www.globalalfabet.com). Lives at places.globalalfabet.com.

- Search in plain language: "vets in Harare", "hotels in Victoria Falls", "waterfalls".
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
1. In Netlify: **Add new site → Import from Git →** choose `global-alfabet/alfa-places`. `netlify.toml` has the
   build settings.
2. **Domain management → Add a domain →** `places.globalalfabet.com`. The DNS is on Netlify, so it sets itself up.
3. **Forms →** turn on email notifications for `add-business`, so new businesses reach you.

Working with Claude Code: [`CLAUDE.md`](CLAUDE.md). Started from the BizDirect prototype.
