# Paper Review Design System

## Visual character

The series is an annotated academic paper: quiet, credible, tactile, and highly legible. Avoid generic dashboard chrome, gradients, glass-heavy cards, oversized pills, decorative illustrations, and dense iconography.

## Tokens

| Role | Value |
| --- | --- |
| Canvas | `#efede5` |
| Paper | `#fffdf8` |
| Warm inset | `#f7f4ea` |
| Ink | `#20211f` |
| Muted ink | `#6f716b` |
| Rule | `#d9d5c9` |
| Strong rule | `#b9b5aa` |
| Annotation blue | `#1f4fc9` |
| Pale blue | `#e9eefc` |
| Blue wash | `#f4f6fd` |
| Warning/trade-off | `#b84d3b` |

- Editorial type: Georgia, then Times New Roman.
- Interface type: Arial/Helvetica/system sans.
- Metadata type: SFMono-Regular/Consolas/system monospace.
- Main paper width: about `860px`; side rails are optional and disappear responsively.
- Use one-pixel rules, restrained shadows, square corners, and spacing built from 8–16px increments.

## Shared composition

### Library page

- Sticky series header.
- Introductory editorial block naming the collection.
- Small series statistics and a search/filter control when useful.
- Paper cards presented like bibliography entries: index, field, title, authors, year, concise thesis, coverage tags, and a clear open action.
- Include a subtle “next review” placeholder only when it explains how the series will grow.

### Paper page

- Header wordmark: `paper-review/<slug>`.
- Left table of contents, central paper sheet, optional right annotations.
- Research labels use monospace uppercase text with generous letter spacing.
- The first viewport should establish title, source, and central question without promotional copy.

## Interaction language

- Blue indicates current state, navigation, or annotation.
- Use borders and background changes before shadows or scale.
- Motion lasts 180–250ms; disable it for `prefers-reduced-motion`.
- Every interactive diagram needs a nearby explanatory sentence that updates with state.
- Sliders and calculated scores must say when they are conceptual rather than empirical.
- Use native links for navigation and native `details` for optional technical depth where possible.

## Responsive and accessibility

- Preserve a comfortable reading measure and at least 24px mobile gutters.
- Collapse side rails below tablet widths.
- Reflow comparisons to one column; do not shrink text or diagrams until illegible.
- Maintain visible focus styles, semantic landmarks, useful accessible names, and sufficient contrast.
- Do not rely on color alone to convey selected state.
