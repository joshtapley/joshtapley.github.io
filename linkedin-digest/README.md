# LinkedIn digests

Static pages for <https://joshtapley.github.io/linkedin-digest/>. Plain HTML, CSS, and JavaScript. GitHub Pages serves the files as they are; there is no build step.

## Add a digest

1. Add `data/<id>.json`. Use `YYYY-MM-DD` for a single daily digest, or `YYYY-MM-DD-am` and `YYYY-MM-DD-pm` for the 8 AM and 5 PM ET runs. `data/2026-10-21.json` and `data/2026-10-22-am.json` are the examples.
2. Add `{ "date": "<id>" }` to the `digests` array in `data/manifest.json`.
3. Copy `2026-10-21/index.html` to `<id>/index.html`. That file is identical for every digest. It reads the id from the URL and loads `data/<id>.json`.

The index sorts ids newest first (`2026-10-22-pm` before `2026-10-22-am` before `2026-10-21`), so the new manifest entry can go anywhere in the array.

## URLs

- `/linkedin-digest/` lists every digest.
- `/linkedin-digest/<id>/` is that digest. Oct 21 stays at `/linkedin-digest/2026-10-21/`.

## JSON fields

- `date` is the id above.
- `label` is the index heading when the id needs one, such as `Oct 22, 2026 (morning)`. A plain date falls back to `Oct 21, 2026`.
- `title`, `source`, and `theme` fill the header. `theme` is shown as the theme line when present.
- `categoryNotes` is an optional map of category name to a note. The note is shown once, above the first visible card in that category.
- `items` is the card list, in display order. Each item has `author`, `summary`, `category`, and `tags`. `url` is optional. Leave it out when LinkedIn did not return a link; the card is rendered without one.
- `image` is optional, a path relative to `linkedin-digest/` such as `images/2026-10-22-pm/filename.png`. Older digests without it still render. The card shows the image lazy-loaded, capped at 280px tall. Alt text is the author or company plus the first sentence of the summary. Crop off a top "Followed by …" line before committing a screenshot; that line names the viewer's connections.

Chips are the categories on that digest, in first-seen order, plus `AI & dashboards`, `Tableau`, `Power BI`, `Data engineering`, and `Jobs` when a tag or category matches them.

`tags` name tools: `Tableau`, `Power BI`, `AI`, and `Data eng`. A chip matches an item when `category` is that chip, or when a tag maps to it (`AI` maps to AI & dashboards, `Data eng` maps to Data engineering). Add a tool tag when the text names that tool.
