# Alfa Finda design in Figma

The original Alfa Finda design is the Figma file **ZimboBiz** (made when the product was called BizDirect):
https://www.figma.com/design/FxRp25rePeviDDzlnjsDuT/ZimboBiz

Figma limits how often Claude can read it on the Starter plan, so what matters is written down here. Read the file
again only for screens not covered below.

## What we took from it

- **Colour.** Alfa Finda's accent is Compass Blue `#005BBF`, the main blue in the design. It is the brand colour in
  the logo kit (github.com/global-alfabet/brand) and `--accent` in `src/styles/site.css`.
- **Home page layout** (Directory Home): search with a "what" field and a town field, Browse by category tiles,
  featured places, a row of listing cards, then a blue banner for business owners.
- **Look.** The site keeps the shared Global Alfabet look (pill buttons, 28px cards, `#f5f5f7` sections, Inter), as
  Julius decided. The Figma file's smaller corners and grey-violet backgrounds are not used.

![Directory Home (desktop)](figma/directory-home-desktop.png)

## Colours in the design

| Used for | Hex | Site token |
| --- | --- | --- |
| Main blue: buttons, links, banner | `#005BBF` | `--accent`, `--accent-strong` |
| Brighter blue: second button | `#1A73E8` | `--accent-bright` |
| Pale blue: category icon circles | `#D8E2FF` | `--accent-soft` |
| Page background | `#FAF9FD` | not used (we use white and `--soft`) |
| Category tiles | `#F4F3F7` | not used (`--soft`) |
| Footer | `#E3E2E6` | not used |
| Borders | `#C1C6D6` | not used (`--line`) |
| Text / secondary text | `#1A1B1E` / `#414754` | not used (`--ink`, `--ink-2`) |

Type in the design: Inter. Headlines 48px bold, section headings 32px semibold, card titles 20px, body 14 to 16px,
category labels 12px uppercase.

## Business profile and search results

Built from the Business Profile (`401:1386`) and Search Results (`401:2206`) desktop screens, in the shared look:

- **Business page:** cover photo with badges, rating, name, tagline, Share and Save; About, Services cards, photo
  gallery and Customer reviews on the left; a sticky column with price from, the main action and Send a message,
  contact details and hours, a location map and Quick info.
- **Search:** filters on the left (category, type of business, where and distance, minimum rating, price range,
  open now and more), wide result cards in the middle with pages of 8, and a map of the results on the right.

![Business profile (desktop)](figma/business-profile-desktop.png)
![Search results (desktop)](figma/search-results-desktop.png)

Ratings, reviews, Verified, Founding partner and Featured badges show on the fictional example listings in test
mode. Real listings get them only when they are real: reviews arrive with the Global Alfabet Account, and badges are
granted by Julius.

## Screens in the file

Desktop: Content and taxonomy management `401:3`, Super admin dashboard `401:669`, Business directory management
`401:1046`, Business profile `401:1386`, Directory home `401:1651`, Admin dashboard `401:1954`, Search results
`401:2206`.

Mobile: Super admin dashboard `401:321`, Business approvals `401:498`, Edit profile `401:5079`, Photo gallery
`401:5367`, Manage reviews `401:5554`, Admin dashboard `401:5854`, Business profile `401:6076`, Settings `401:6359`,
Search results `401:6542`, Directory home `401:6767`, Register business `401:7014`, Login `401:7099`, Messages
`401:7160`.

Read so far: Directory home, Business profile and Search results (desktop).
