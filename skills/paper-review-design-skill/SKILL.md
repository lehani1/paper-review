---
name: paper-review-design-skill
description: Build or extend the paper-review series with consistent interactive research-paper pages and a shared paper library. Use when adding a research paper, creating a paper route, updating the paper index, or changing the series-wide scholarly visual system, navigation, interactions, or content structure.
---

# Paper Review Design

Create accessible, interactive paper companions that feel like annotated academic papers rather than dashboards or marketing pages.

## Start with the repository contract

1. Read the repository `AGENTS.md` completely.
2. Read `references/design-system.md` before changing UI.
3. Inspect `app/papers.ts`, the library page, and one finished paper route.
4. Preserve the shared design language unless the user explicitly requests a series-wide redesign.

## Add a paper

1. Read the primary paper source and map every major section, contribution, method family, evaluation theme, limitation, and future direction.
2. Choose a short lowercase slug. Add one entry to `app/papers.ts`; treat this registry as the library source of truth.
3. Create `app/<slug>/page.tsx`. Reuse the existing paper anatomy and shared CSS instead of starting a new visual direction.
4. Make the wordmark `paper-review/<slug>` and include an obvious path back to all papers.
5. Use progressive disclosure: plain-language overview first, interactive model second, technical detail in expandable sections.
6. Add interactions that illuminate the paper’s actual ideas. Prefer tabs, comparison states, process steppers, conceptual simulators, glossaries, and reading progress. Do not add decorative controls.
7. Link the original paper and clearly distinguish paraphrase, interpretation, and any illustrative simulation from reported experimental results.
8. Verify keyboard access, focus visibility, reduced motion, responsive layouts, unique React keys, and a production build.

## Required paper anatomy

- Sticky series header and reading progress.
- Paper title and source identity.
- Abstract or central thesis.
- Contribution summary.
- Interactive explanation of the core mechanism.
- Major method or architecture sections.
- Evaluation, limitations, and future directions.
- Glossary for specialized terms.
- Citation and original-paper link.

Adapt headings to the source paper; do not force concepts the paper does not contain.

## Content rules

- Cover the whole paper through faithful compression, not copied prose.
- Use the paper itself as the primary source.
- Keep claims traceable and avoid invented benchmarks, numbers, or conclusions.
- Label conceptual UI calculations as illustrative when they are not paper results.
- Write for an informed reader who may not know the subfield.

## Series rules

- Keep paper metadata in `app/papers.ts`.
- Keep `/` as the paper library and `/<slug>` as the interactive paper.
- Preserve the ivory paper, charcoal ink, cobalt annotation system, serif editorial typography, compact monospace labels, fine rules, and restrained motion.
- Extend shared CSS components before adding paper-only styling. Namespace genuinely unique styles by paper slug.
- Never duplicate the global header, paper card, or library metadata logic when a shared component or registry entry can express it.

