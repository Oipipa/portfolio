# Portfolio.exe — Windows 98–style portfolio

Static, GitHub Pages–ready portfolio site with a Windows 98 chrome. Desktop-first layout with mobile-friendly tabs and carousels for Experience, Projects, and Education, all powered by a single content file.

## Features
- Win98 window chrome with title bar, beveled tabs, and 3D buttons; optional status bar message.
- Three accessible tabs (Experience, Projects, Education) using correct ARIA, keyboard activation, and visible focus states.
- Carousels for all tabs with Prev/Next controls, indicator, mouse + keyboard support (Enter/Space, Arrow keys when focused).
- All editable text and links live in `content.json`; cards pull from that source automatically.
- Lightweight vanilla HTML/CSS/JS; no build step, fully static for GitHub Pages.
- Automated snake animation plays softly in the background without blocking interaction.

## Editing content (`content.json`)
- `name`, `tagline`: top header and title bar text.
- `contacts`: keys for `email`, `github`, `linkedin`, plus any additional link labels/URLs you add (values become buttons; `email` auto-uses `mailto:`).
- `experience`: array of roles with `role`, `company`, `dates`, `highlights` (2–5 bullets), optional `tags` list.
- `projects`: array with `name`, `summary`, `highlights` (2–5 bullets), `links` (`github` optional here), optional `tags`.
- `education`: array with `degree`, `institution`, `dates`, `highlights` (2–5 bullets), optional `tags`.
- `statusText`: short footer/status-bar message.

## Run locally
```bash
# from repo root
python3 -m http.server 8000
# open http://localhost:8000
```
Any basic static file server works; a server is recommended instead of opening `index.html` directly so `content.json` loads without CORS issues.

## Deploy to GitHub Pages
1) Commit/push the repository to GitHub.
2) In the repo settings, open **Pages** and set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. Save.
3) The site will be served at `https://<username>.github.io/<repo>/`. All assets use relative paths, so no extra base-path config is needed.

## Definition of Done
- Win98 theme is visible and consistent (title bar, beveled tabs/buttons, dialog-like cards).
- Three tabs (Experience, Projects, Education) switch content without reload; ARIA attributes and keyboard activation (Enter/Space) are in place.
- Each tab uses a carousel with Prev/Next buttons and an indicator; no autoplay.
- Layout is desktop-first, mobile usable with no horizontal scrolling and wrap-friendly controls.
- All displayed content is sourced from `content.json`.
- Background animation runs unobtrusively; static assets use relative paths so the site works on GitHub Pages.
