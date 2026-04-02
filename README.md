# Portfolio Builder — Multi-Tenant SaaS

A production-ready SaaS platform where users generate and deploy fully personalised portfolio sites via a structured form. Each user gets their own unique live URL (`/user/[slug]`) with independent theming — built with the same multi-tenant architecture patterns used in real enterprise products.

🔗 **Live Demo:** [shaffi-ahuja.vercel.app](https://shaffi-ahuja.vercel.app)
👤 **Example user portfolio:** [/user/sahilahuja1729](https://my-digitall-portfolio.vercel.app/user/sahilahuja1729)


TechStack - ![My Skills](https://skillicons.dev/icons?i=react,typescript,javascript,html,css,next,bootstrap,tailwindcss,git,figma)

---

## What Makes This Different

Most portfolio sites are static. This one is a **platform** — any user can fill in a form and get their own deployed portfolio at a unique URL, with their own theme and content, without touching code.

This directly mirrors the multi-tenant frontend architecture patterns I work with professionally at Publicis Re:Sources — dynamic theming per tenant, reusable component layers, and per-user data isolation.

---

## Architecture

```
/src
├── app/
│   ├── page.tsx                 # Main portfolio (Shaffi Ahuja)
│   ├── user/
│   │   ├── [id]/page.tsx        # Dynamic per-user portfolio renderer
│   │   └── create/page.tsx      # Portfolio builder form
├── components/
│   ├── Hero.tsx                 # Reusable across all portfolio instances
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── WorkExperience.tsx
│   ├── BuildPortfolio.tsx       # SaaS CTA section
│   └── ui/                      # Atomic component library
├── data/
│   ├── ShaffiAhuja.ts           # Owner portfolio data
│   ├── SahilAhuja.ts            # User-generated portfolio
│   └── NimishMadan.ts           # User-generated portfolio
```

**Key architectural decisions:**
- All portfolio sections are driven by a typed data schema — swap the data object, get a completely different portfolio
- Theme (light/dark) is set per-user in their data config, not globally
- Components are designed to be data-agnostic and fully reusable across tenants

---

## Features

- **Multi-user portfolio generation** — form-driven, unique URL per user
- **Light / Dark theming** — per-user theme config, no hardcoded values
- **Fully responsive** — mobile-first layout across all sections
- **Email-integrated contact form** — via API route + email service
- **Reusable component library** — every section is composable and data-driven
- **Live in production** — real users have built portfolios on this platform

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| CMS (planned) | Sanity |
| Deployment | Vercel |

---

## Getting Started

```bash
git clone https://github.com/shaffi-ahuja/NextJS-Portfolio.git
cd NextJS-Portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

To create a user portfolio, visit [http://localhost:3000/user/create](http://localhost:3000/user/create)

---

## Roadmap

- [ ] Sanity CMS integration — dynamic content updates without code changes
- [ ] Custom colour theme picker per user (beyond light/dark)
- [ ] Resume PDF download generated from portfolio data
- [ ] Analytics per portfolio (views, contact form submissions)
- [ ] Public gallery of user-built portfolios

---

## About the Author

**Shaffi Ahuja** — Senior Frontend Developer with 6+ years of experience building scalable web applications at Publicis Re:Sources, HCL Technologies, and Wipro.

[LinkedIn](https://www.linkedin.com/in/shaffi-ahuja/) · [GitHub](https://github.com/shaffi-ahuja) · [Live Site](https://shaffi-ahuja.vercel.app)


## Future Plans

- Enhance the design with animations and interactive features.
- Optimize for SEO and performance.
- Add functionality for users to pick the color/theme of their portfolio.
- Enable users to download resumes based on the details provided.