# Paper Review Series — Agent Instructions

## Mission

Build a growing library of faithful, accessible, interactive companions to research papers. The site should make difficult papers easier to understand without flattening their nuance or inventing claims.

## Required skill

For any paper addition or series UI change, use the repository skill at `skills/paper-review-design-skill/SKILL.md`. Read its `references/design-system.md` before editing the interface. A personal installed copy may exist, but the repository copy is canonical.

## Application structure

- `/` is the paper library.
- `/<slug>` is one complete interactive paper review.
- `app/papers.ts` is the single source of truth for library metadata.
- `app/globals.css` contains the shared visual system and reusable components.
- `app/<slug>/page.tsx` contains paper-specific content and interactions.
- `skills/paper-review-design-skill/` defines the reusable series design workflow.
- `.openai/hosting.json` contains the Sites project binding; preserve it.

The first paper is `/rag`, implemented in `app/rag/page.tsx`.

## Adding a paper

1. Read the primary paper completely. Use the official HTML, PDF, or publisher page as the factual source.
2. Map its abstract, central problem, contributions, architecture or method, experiments, evaluation, limitations, and future work.
3. Choose a short lowercase URL slug such as `rag`, `transformer`, or `lora`.
4. Add a `Paper` entry to `app/papers.ts`. Do not hardcode the same library metadata elsewhere.
5. Create `app/<slug>/page.tsx` using the existing RAG page as structural guidance, not as content boilerplate.
6. Set the paper header wordmark to `paper-review/<slug>` and link it back to `/`. Include an “All papers” link on desktop.
7. Add interactions that clarify this paper’s ideas: process steppers, comparisons, state diagrams, conceptual simulations, result explorers, or glossaries. Each interaction must teach something specific.
8. Link the original source, include a citation, and label illustrative calculations that are not reported results.
9. Build and verify before publishing.

## Content standard

- Cover the whole paper through structured paraphrase and progressive disclosure.
- Start each concept in plain language, then expose technical detail.
- Preserve caveats, failure modes, and uncertainty.
- Never invent experimental values, datasets, quotes, or conclusions.
- Keep quotations short and necessary; prefer paraphrase.
- Distinguish the paper’s findings from editorial interpretation.
- Write for technically curious readers who may be new to the topic.

## Design contract

- Canvas `#efede5`; paper `#fffdf8`; ink `#20211f`; annotation blue `#1f4fc9`.
- Georgia/Times for editorial reading, system sans for controls, monospace for labels and metadata.
- Use fine rules, square corners, restrained shadows, and generous reading margins.
- Avoid generic dashboards, gradients, glass effects, ornamental imagery, large pill controls, or unexplained icons.
- Blue means navigation, annotation, or current state. Red is reserved for warnings or trade-offs.
- Use 180–250ms motion and honor `prefers-reduced-motion`.
- Keep paper routes visually consistent. Add paper-specific styling only when the concept cannot be expressed with shared components.

## Required paper anatomy

- Sticky series header and reading progress.
- Paper title and source identity.
- Abstract or thesis.
- Contributions.
- Interactive explanation of the core mechanism.
- Major technical sections.
- Evaluation and limitations.
- Future directions.
- Glossary.
- Citation and original source.

Adapt labels to the paper; do not force a section the source does not contain.

## Accessibility and responsive behavior

- Use semantic landmarks, headings in order, native links/buttons, and useful accessible names.
- Keep visible focus styles and keyboard-operable interactions.
- Never communicate selected state by color alone.
- Collapse side rails on tablets and stack comparisons on mobile.
- Maintain at least 24px mobile gutters and readable text sizes.
- Ensure React list keys are unique.

## Validation

The normal build command is:

```sh
npm run build
```

On Windows PowerShell, the starter’s POSIX environment assignment requires:

```powershell
$env:WRANGLER_LOG_PATH='.wrangler/wrangler.log'
& '.\node_modules\.bin\vinext.cmd' build
```

Fix build errors and browser console errors before publishing. Do not add dependencies unless the feature genuinely needs them. Preserve the existing vinext, Vite, and Sites structure.

## Completion checklist

- The paper appears in `app/papers.ts` and on `/`.
- Its card opens the correct `/<slug>` route.
- The interactive review covers the complete source.
- Source links and citation are present.
- Shared design tokens and components are preserved.
- Keyboard, reduced-motion, tablet, and mobile behavior are accounted for.
- The production build succeeds.

