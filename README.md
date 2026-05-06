# CoPath Validation Engine

A static market-validation toolkit for Mississippi founders, built for Innovate Mississippi.

Pure HTML / CSS / vanilla JS — no build step, no backend. State lives in the browser
(`localStorage`); users can export their session as a JSON file and import it on another
device or browser.

## Modules

- **01 Market Validation** — log discovery interviews, score Commitment Currency, detect "polite lies"
- **02 Attribute Segmentation** — rank segments by Urgency × Budget × Accessibility
- **03 Bottom-Up Sizing** — funnel calculator using verified MS entity counts
- **04 CoPath Canvases** — discovery / synthesis / value-prop / riskiest-assumption canvases
- **05 Admin Command Center** — edit gold-standard hurdle rates, download updated JSON
- **06 Competitive Analysis** — moat builder with status-quo inertia check
- **07 Discovery Kit** — Mom Test grader + printable interview script

## Local Development

No dependencies. Just serve the directory with any static server (browsers block
`fetch()` of local JSON over `file://`):

```bash
# any of these will work
npx serve .
python3 -m http.server 8000
php -S localhost:8000
```

Then open `http://localhost:8000`.

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Select this repo and branch (`main` for production).
4. Build settings:
   - **Framework preset:** None
   - **Build command:** *(leave blank)*
   - **Build output directory:** `/`
5. Click **Save and Deploy**.

Cloudflare will redeploy automatically on every push. The `_headers` file at the
repo root controls cache and security headers.

### Deploy via Wrangler (optional)

```bash
npm i -g wrangler
wrangler pages deploy . --project-name=copath-validation
```

## Updating the Gold-Standard Data

The hurdle rates, MS node counts, and competitive incumbents live in `/data/*.json`.
Two ways to update them:

1. **Edit JSON directly** in this repo and push. Recommended for staff.
2. **Use the Admin Command Center** (`/modules/05-admin/`) to download a new JSON
   file, then commit it to `/data/` and push.

## Session Portability

Click the **Session** button (bottom-left) on any module to:

- **Download Session JSON** — bundles every saved draft into one file
- **Import…** — restores drafts from a previously exported file
- **Erase All Drafts** — wipes localStorage in this browser

This is how users move work between devices without a backend account.

## Project Layout

```
/
├── index.html              Launchpad
├── _headers                Cloudflare Pages config
├── shared/
│   ├── styles.css          Brand tokens + components
│   └── core.js             fetchData / saveDraft / session export-import
├── data/
│   ├── validation.json     Module 01
│   ├── sizing.json         Module 03
│   ├── competitive.json    Module 06
│   └── canvases.json       Module 04
└── modules/
    ├── 01-validation/
    ├── 02-segmentation/
    ├── 03-sizing/
    ├── 04-canvases/
    ├── 05-admin/
    ├── 06-competitive/
    └── 07-discovery/
```

## License

Internal Innovate Mississippi tool.
