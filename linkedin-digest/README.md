# LinkedIn digests

Static pages for <https://joshtapley.github.io/linkedin-digest/>. Plain HTML, CSS, and JavaScript. GitHub Pages serves the files as they are; there is no build step.

## Add a digest

1. Add `data/YYYY-MM-DD.json`, using `data/2026-10-21.json` as the shape.
2. Add `{ "date": "YYYY-MM-DD" }` to the `digests` array in `data/manifest.json`.
3. Copy `2026-10-21/index.html` to `YYYY-MM-DD/index.html`. That file is identical for every date. It reads the date from the URL and loads `data/YYYY-MM-DD.json`.

The index sorts dates newest first, so the new manifest entry can go anywhere in the array.

## URLs

- `/linkedin-digest/` lists every digest.
- `/linkedin-digest/YYYY-MM-DD/` is that day's page.

## JSON fields

- `date`, `title`, `source`, `theme` fill the header. `theme` is shown as the theme line.
- `categoryNotes` is an optional map of category name to a note. The note is shown once, above the first visible card in that category.
- `items` is the card list, in display order. Each item has `author`, `summary`, `url`, `category`, and `tags`.

Filter chips are `AI & dashboards`, `Tableau`, `Power BI`, `Data engineering`, and `Jobs`. Set `category` to one of those.

`tags` name tools: `Tableau`, `Power BI`, `AI`, and `Data eng`. A chip matches an item when `category` is that chip, or when a tag maps to it (`AI` maps to AI & dashboards, `Data eng` maps to Data engineering). Tag the section's own tool, and add another tool tag when the post names that tool too, so the other chip includes it.
