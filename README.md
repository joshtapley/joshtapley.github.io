# joshtapley site: first draft

A static personal landing page with no build step: plain HTML and CSS, plus a little inline JS for the light/dark toggle. It's ready for GitHub Pages.

## Deploy
1. Create a repo, e.g. `USERNAME.github.io`, and push the contents of this folder to `main`.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Replace `[SITE_URL]` in `index.html` (canonical, og:url, og:image, JSON-LD) with the live URL.
4. Optional custom domain: add a `CNAME` file, enforce HTTPS, and keep the domain on auto-renew.

Preview locally: `python3 -m http.server` → http://localhost:8000

## Placeholders to fill (search for `[` in index.html)
| Placeholder | Where | Notes |
|---|---|---|
| `[SITE_URL]` | `<head>` canonical / OG / JSON-LD | Final GitHub Pages or custom-domain URL |
| `[EMAIL]` | Contact "Email me" (mailto) | Public-facing email |
| `[RESUME_PDF]` | Header button + Experience | Add e.g. `assets/josh-tapley-resume.pdf` |
| `[GITHUB_URL]` | Contact social links | GitHub profile (the repo host) |
| `[HEADSHOT]` | About | Add `assets/img/headshot.jpg` and swap the JT placeholder for an `<img>` |
| `[CURRENT FOCUS / AI WORK]` | About → "Currently" box | Not on LinkedIn |
| `[KEY SCOPE & OUTCOMES AT OPTIMUM]` | Experience | No Optimum detail on LinkedIn |
| `[CONFIRM: SQL / Python / cloud / other BI tools]` | Skills | SQL, Python, BigQuery, ThoughtSpot, Looker, MicroStrategy and AI are not on the profile |
| `[ROLE IN PHILLYTUG]` | Community | Organizer, co-lead, or member? |
| `[EVENT · DATE · LINK]` | Talk "Are You Ready to Wear the Data Rockstar Shirt?" | |
| `[THUMBNAIL: Dashboard Color Tester]` | Work card | Screenshot of the Squirrel365 app |

## Link audit (Oct 23, 2026)
Old short links were resolved with `curl` over HTTPS. Plain-HTTP requests time out from the build box, but the HTTPS versions redirect fine.
- tabsoft.co/2zXyiyr → https://public.tableau.com/app/discover/solar-energy-us ✅
- tabsoft.co/2joGocj → https://public.tableau.com/app/discover/changing-diseases ✅
- tabsoft.co/2iTVNgZ → https://public.tableau.com/app/profile/josh.tapley/viz/PotUS/PotUS ✅
- tabsoft.co/1Lh3uIf → https://public.tableau.com/app/profile/josh.tapley/viz/ColorPaletteGenerator/ColorPaletteGenerator ✅
- bit.ly/1iSBdUb (Career Path) → http://data-ink.com/?p=1380 ❌ data-ink.com is unreachable. The site links the Tableau Public workbook CareerPath_0 instead.
- bit.ly/1rxwCij (Mobile Sales) → http://data-ink.com/?p=1365 ❌ unreachable. The site links the Tableau Public workbook Moble-Sales-Dashboard instead.
- bit.ly/42zLkM6 → https://cloud.squirrel365.io/viewer/9BA412CB946540C5B45603CD8036ECE7 ✅ (the app is titled "My Color Sampler")
- lnkd.in/esNgb5rf → https://youtu.be/3I8oHsdkuVE ✅ (YouTube title "Color Sampler App", channel @joshtapley)

Thumbnails in `assets/img/` (disease, solar, potus, palette) are Tableau Public's own preview images of Josh's workbooks, cropped and converted to WebP.
