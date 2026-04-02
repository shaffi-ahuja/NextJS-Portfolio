const ShaffiAhuja = {
  Intro: {
    FirstName: "Shaffi",
    LastName: "Ahuja",
    OneLinerIntro: "Senior Frontend Developer · React · Next.js · TypeScript",
    Theme: "dark",
  },
  AboutMe: {
    gender: "female",
    experience: {
      yearsOfExperience: 5,
      experienceSummary:
        "I specialise in building scalable, high-performance web applications — from multi-tenant SaaS platforms to GenAI-powered features — with a strong focus on UI consistency, accessibility, and reusable architecture.",
    },
    locationOfWork: {
      timeZone: "any",
      locatedAt: "Haryana, India",
    },
    passion: {
      passionTitle: "Crafting Exceptional UIs",
      description:
        "I care deeply about the details that make a product feel great — perceived performance, accessibility, and design consistency. Frontend isn't just presentation to me; it's the product. I enjoy owning complex UI problems end-to-end and building things that scale.",
    },
    skills: [
      "react",
      "typescript",
      "javascript",
      "html",
      "css",
      "next",
      "redux",
      "mui",
      "bootstrap",
      "tailwind",
      "git",
      "figma",
    ],
    email: "shaffi.ahuja@gmail.com",
  },
  ContactMe: {
    contactMeFor:
      "Whether you're looking to build a new product, scale an existing frontend, or bring a unique idea to life — I'm here to help.",
    email: "shaffi.ahuja@gmail.com",
  },
  Projects: [
    {
      icon: "/portfolio.png",
      title: "Portfolio Builder — Multi-Tenant SaaS",
      description: `A SaaS platform where users generate and deploy their own fully personalised portfolio sites via a structured form — each user gets a unique live URL (e.g. /user/sahilahuja). Supports light/dark theming, responsive layout, and a reusable component architecture that mirrors real-world multi-tenant systems.\n\nBuilt end-to-end: form-driven data collection, dynamic per-user rendering, theme switching, and email-integrated contact form. Live users are already using it in production.`,
      techstack: ["next", "typescript", "tailwind"],
      link: "https://shaffi-ahuja.vercel.app",
    },
    {
      icon: "/pitch.png",
      title: "Pitch — Startup Directory Platform",
      description: `A full-featured startup pitch platform built on Next.js 15 with Sanity's Live Content API — content updates in real time without a page reload. Features GitHub OAuth authentication, pitch submission and browsing, editor picks, view counters, search, and per-user profile pages.\n\nDemonstrates end-to-end ownership: auth, CMS integration, real-time data, and a clean minimalist UX optimised for readability.`,
      techstack: ["typescript", "tailwind", "react", "next", "sanity"],
      link: "https://pitch-project.vercel.app/",
    },
    {
      icon: "/hilink.svg",
      title: "HiLink — Travel Landing Page",
      description: `A high-fidelity, pixel-perfect travel landing page built with Next.js, Tailwind CSS, and TypeScript. Focused on responsive design, component reusability, and modern layout techniques — all built from scratch without UI kits.\n\nSections include Hero, Camp Exploration, Travel Guide, Feature highlights, Mobile App CTA, and Footer.`,
      techstack: ["next", "typescript", "tailwind"],
      link: "https://travel-app-gold-nine.vercel.app/",
    },
  ],
  WorkExperience: [
    {
      image: "/publicisresources_logo.jpeg",
      company: "Publicis Re:Sources",
      title: "Associate L2",
      startYear: "2023", endYear: "Present",
      description: `Built scalable multi-tenant frontend architecture with dynamic theming — enabling faster client onboarding across multiple environments.\nDeveloped key product features: Onboarding UI, Immediate Action Widget, Personalized Feed, and GenAI integrations (Ask Client).\nImproved UI consistency post design-system rollout, reducing inconsistencies by ~30% across the platform.\nResolved 50+ critical defects across TST/Preprod, reducing QA cycle delays by ~25%.\nDesigned base architecture for complex modules (Create/Edit Post), enabling seamless handoff across teams.\nMentored junior developers and conducted code reviews, improving team velocity and code quality.\nCollaborated cross-functionally to ensure consistent UX and seamless feature integration across tenants.`,
    },
    {
      image: "/hcltech_logo.jpeg",
      company: "HCL Technologies",
      title: "Senior Software Engineer",
      startYear: "2022", endYear: "2023",
      description: `Developed accessible, reusable UI components using React, MUI, and RJSF for a healthcare client — fully WCAG compliant.\nBuilt and maintained a Storybook component library, improving UI consistency and reducing development effort by ~20%.\nImplemented responsive applications and improved reliability through unit testing with Jest.\nLed a React.js training programme for 20+ freshers, accelerating onboarding and improving team capability.\nConducted code reviews and enforced best practices across the engineering team.`,
    },
    {
      image: "/wipro_logo.jpeg",
      company: "Wipro",
      title: "Project Engineer",
      startYear: "2019", endYear: "2022",
      description: `Developed multiple enterprise portals on Wipro's in-house devNXT platform — COE Governance, Project Management, MyLearning, SME Dashboard, and more.\nBuilt UI for NHS application with login, document creation, approval workflows, and admin functionalities.\nEnhanced UI for enterprise clients including Oracle and UBS, improving usability and performance.\nCreated 10+ automated rules for a remediation tool, reducing manual code review effort significantly.\nDeveloped features for analytics, reports, forum interactions, blogs, and notifications.`,
    },
  ],
  Footer: {
    FirstName: "Shaffi",
    LastName: "Ahuja",
    github: "https://github.com/shaffi-ahuja",
    linkedin: "https://www.linkedin.com/in/shaffi-ahuja/",
    leetcode: "https://leetcode.com/u/user8200MW/",
  },
};
export default ShaffiAhuja;
