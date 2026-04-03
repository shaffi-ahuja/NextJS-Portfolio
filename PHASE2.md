# Phase 2 — Architecture

## RSC vs Client Component boundary

Every component was audited and classified:

| Component | Type | Reason |
|---|---|---|
| `layout.tsx` | **RSC** | No interactivity — was wrongly `'use client'` |
| `Hero` | **RSC** | Pure display, no state |
| `About` | **RSC** | Pure display, no state |
| `Projects` | **Client** | Carousel requires DOM interaction |
| `WorkExperience` | **RSC** | Pure display, no state |
| `ContactMe` | **RSC** shell | Wraps ContactForm (client) |
| `ContactForm` | **Client** | Form state, submission |
| `Footer` | **RSC** | Pure display |
| `Navbar` | **Client** | Mobile menu toggle state |
| `BuildPortfolio` | **Client** | Fetches dynamic users on mount |
| `ToggleButton` | **Client** | localStorage theme state |
| `UserForm` | **Client** | All form state |

**Rule:** Components are RSC by default. Only add `'use client'` when you need:
- `useState` / `useEffect` / `useRef`
- Browser APIs (localStorage, FileReader)
- Event handlers beyond simple `<Link>` clicks

## Schema-driven rendering

Sections render conditionally based on data presence AND feature flags:

```tsx
// Nothing hardcoded — data drives the layout
{features.showProjects && data.Projects && data.Projects.length > 0 && (
  <Projects data={data.Projects} />
)}
```

This is the same pattern used in multi-tenant SaaS platforms — Publicis Re:Sources uses
identical logic to show/hide features per client tenant.

## Feature flags per user

Each portfolio has a `features` object stored in Redis alongside the data:

```ts
features: {
  showProjects: boolean       // show/hide projects section
  showWorkExperience: boolean // show/hide work history
  showContact: boolean        // show/hide contact form
  showBuildSection: boolean   // show/hide "build your own" CTA
}
```

Users set these at creation time via toggles in the form.
Defaults: everything on except `showBuildSection` on user portfolios.

## TypeScript — no more `any`

All component props now use types derived directly from the Zod schema:

```ts
// Derived from Zod — single source of truth
export type IntroData = Portfolio["Intro"];
export type AboutMeData = Portfolio["AboutMe"];
export type ContactMeData = Portfolio["ContactMe"];
export type FooterData = Portfolio["Footer"];
export type WorkExperienceItem = z.infer<typeof WorkExperienceSchema>;
```

Change the schema → types update everywhere automatically.
