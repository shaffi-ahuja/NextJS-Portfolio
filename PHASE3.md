# Phase 3 — Design & UX

## Scroll-triggered animations

Every section fades and slides in as it enters the viewport using a custom `useScrollAnimation` hook built on the native Intersection Observer API — zero external dependencies.

```
src/hooks/useScrollAnimation.ts   — Intersection Observer, fires once per element
src/components/ui/AnimatedSection.tsx — wrapper with direction (up/left/right) + delay
```

Sections animate with staggered delays where applicable (e.g. BuildPortfolio user cards each have an 80ms offset).

## Skeleton loading states

Three skeleton components match the exact layout of their real counterparts:

```
src/components/ui/Skeleton.tsx
  WorkCardSkeleton      — matches WorkCard layout
  ProjectCardSkeleton   — matches ProjectCard layout  
  AboutGridSkeleton     — matches About grid layout
```

Use these in `Suspense` boundaries or loading states as the project grows.

## Micro-interactions

All applied via CSS — no JS overhead:

| Interaction | Where | Implementation |
|---|---|---|
| Card hover lift | All cards | `hover:-translate-y-1 hover:shadow-lg` |
| Button press | All buttons | `active:scale-95` |
| Nav link underline | Desktop nav | CSS width `0 → 100%` on hover |
| Nav scroll shadow | Navbar | JS scroll listener → `shadow-md` |
| Footer icon scale | Social links | `hover:scale-110` |
| Theme transition | `<html>` | `transition: background-color 0.3s, color 0.3s` |
| Mobile menu | Hamburger | `max-h` animation `0 → 64` |

## WCAG accessibility

| Element | Fix |
|---|---|
| Theme toggle | `role="switch"` + `aria-checked` + `aria-label` + ☀/☾ icons |
| Navbar hamburger | `aria-expanded` + `aria-controls` + Escape key closes |
| Nav links | Visible `focus-visible` ring |
| Footer social links | `aria-label` with name + "(opens in new tab)" |
| WorkExperience list | `role="list"` + `role="listitem"` |
| Projects carousel | `aria-label="Project showcase"` |
| BuildPortfolio | `aria-labelledby` heading + `role="list"` on user grid |
| Contact header image | `aria-hidden="true"` (decorative) |
| Hero CTA | `aria-label="Jump to contact section"` |
