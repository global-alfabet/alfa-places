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
3. **Forms →** turn on email notifications for `add-business`, so new businesses reach you. The email's subject
   comes from the form's hidden `subject` field ("New listing · Add your business form · finda.globalalfabet.com
   (Alfa Finda): <business name>"), so don't set a subject there. The hidden `source` field is listed with the others.
4. **Confirmation emails →** `netlify/functions/submission-created.mjs` emails whoever adds a business to say we've
   received it. It sends through [Resend](https://resend.com); add these in Site configuration → Environment
   variables (scope Functions). Without `RESEND_API_KEY` nothing is sent.

   | Variable | What |
   | --- | --- |
   | `RESEND_API_KEY` | A Resend API key. globalalfabet.com must be verified in Resend. |
   | `MAIL_FROM` | Optional. Default `Global Alfabet <hello@globalalfabet.com>`. |
   | `REPLY_TO` | Optional. Default `hello@globalalfabet.com`. |

## Analytics, cookies and social links
- Google Analytics 4 runs only after a visitor presses Accept on the cookie banner (`src/lib/consent.js`, the same
  file on every Global Alfabet site). Paste the measurement ID (`G-…`) into `analytics.ga4` in `src/config.js`; while
  it's empty there's no banner and nothing is measured. "Cookie settings" in the footer changes the answer.
- The footer links to our social profiles from `social` in `src/config.js`. "#" is a placeholder until the real links
  are in; an empty value hides that network.

### Moving from Alfa Places
Alfa Finda was called Alfa Places and lived at places.globalalfabet.com. Keep `places.globalalfabet.com` on the
Netlify site as a domain alias: `netlify.toml` redirects every old address to the same page on
finda.globalalfabet.com. The GitHub repository can be renamed from `alfa-places` to `alfa-finda` in its settings;
GitHub forwards the old address. Saved trips live in each visitor's browser, so ones saved on the old address
don't move to the new one.

Working with Claude Code: [`CLAUDE.md`](CLAUDE.md). Started from the BizDirect prototype.
