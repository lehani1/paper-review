# Paper Review

A growing series of interactive companions to research papers. Each review preserves the paper’s argument while making its mechanisms, comparisons, evaluation, and terminology easier to explore.

## Current reviews

- [Retrieval-Augmented Generation for Large Language Models: A Survey](./app/rag/page.tsx) — route `/rag`

## Project structure

- `app/page.tsx` — searchable paper library
- `app/papers.ts` — paper metadata registry
- `app/<slug>/page.tsx` — interactive paper reviews
- `skills/paper-review-design-skill/` — reusable design and authoring workflow
- `AGENTS.md` — complete repository instructions

## Development

```sh
npm ci
npm run dev
```

On Windows PowerShell, run vinext directly with the required environment variable:

```powershell
$env:WRANGLER_LOG_PATH='.wrangler/wrangler.log'
& '.\node_modules\.bin\vinext.cmd' dev
```

## Builds

- `npm run build` builds the Sites/Cloudflare version.
- `npm run build:pages` creates the static GitHub Pages export in `out/` when run with `GITHUB_ACTIONS=true`.

GitHub Pages deploys automatically from `main` through `.github/workflows/pages.yml`.
