const PortfolioTemplate = {
  features: {
    showProjects: true,
    showWorkExperience: true,
    showContact: true,
    showBuildSection: true,
  },

  sections: {
    projects:       { showInResume: true,  showInPortfolio: true },
    workExperience: { showInResume: true,  showInPortfolio: true },
    education:      { showInResume: true,  showInPortfolio: true },
    certifications: { showInResume: true,  showInPortfolio: true },
    contact:        { showInResume: false, showInPortfolio: true },
    buildSection:   { showInPortfolio: true },
  },

  Intro: {
    FirstName: "John",
    LastName: "Doe",
    OneLinerIntro: "Frontend Developer · React · Next.js · TypeScript",
    Theme: "light",
    profileImage: "/profile.jpg",
    phone: "+91-9876543210",
  },

  AboutMe: {
    gender: "male",
    experience: {
      yearsOfExperience: 4,
      experienceSummary:
        "Frontend developer specialising in scalable web apps, reusable component systems, and performance optimisation.",
    },

    locationOfWork: {
      timeZone: "IST",
      locatedAt: "Delhi, India",
    },

    passion: {
      passionTitle: "Building Delightful User Experiences",
      passionDescription:
        "I enjoy crafting fast, accessible, and visually consistent interfaces that users love.",
    },

    skills: [
      "react",
      "typescript",
      "javascript",
      "html",
      "css",
      "next",
      "redux",
      "tailwind",
      "mui",
      "git",
      "figma",
    ],

    email: "john.doe@example.com",
  },

  ContactMe: {
    contactMeFor:
      "Open to freelance projects, full-time roles, or collaborations.",
    email: "john.doe@example.com",
  },

  Projects: [
    {
      icon: "/project1.png",
      title: "E-commerce Dashboard",
      description: `Admin dashboard with analytics, order management, and role-based access.

Features:
- Real-time data visualisation
- Authentication & authorization
- Responsive UI`,
      techstack: ["react", "typescript", "tailwind"],
      link: "https://example.com/dashboard",
    },

    {
      icon: "/project2.png",
      title: "SaaS Landing Page",
      description: `High-converting marketing website built with modern UI practices.

Features:
- SEO optimized
- Fully responsive
- Reusable components`,
      techstack: ["next", "typescript", "tailwind"],
      link: "https://example.com/landing",
    },

    {
      icon: "/project3.png",
      title: "Chat Application",
      description: `Realtime chat app with notifications and message persistence.

Features:
- WebSocket integration
- User presence tracking
- Clean UI`,
      techstack: ["react", "node", "socket"],
      link: "https://example.com/chat",
    },
  ],

  WorkExperience: [
    {
      image: "/company1.png",
      company: "ABC Tech",
      title: "Frontend Developer",
      startMonth: "June",
      startYear: "2022",
      endMonth: "",
      endYear: "",
      isCurrentJob: true,
      description: `Developed scalable frontend architecture using React and TypeScript.
Improved performance by 30% through code splitting and lazy loading.
Collaborated with designers to implement pixel-perfect UI.`,
    },

    {
      image: "/company2.png",
      company: "XYZ Solutions",
      title: "Software Engineer",
      startMonth: "Jan",
      startYear: "2020",
      endMonth: "May",
      endYear: "2022",
      isCurrentJob: false,
      description: `Built reusable UI components and design systems.
Worked on enterprise dashboards and internal tools.
Improved development speed by introducing component libraries.`,
    },
  ],

  Education: [
    {
      type: "degree",
      institutionName: "ABC University",
      fieldOfStudy: "B.Tech Computer Science",
      startYear: "2016",
      endYear: "2020",
      grade: "8.2 CGPA",
      location: "India",
    },
  ],

  Certifications: [
    {
      name: "Full Stack Web Development",
      organization: "Coursera",
      date: "2022",
      credentialUrl: "https://example.com/certificate",
    },
  ],

  Footer: {
    FirstName: "John",
    LastName: "Doe",
    github: "https://github.com/johndoe",
    linkedin: "https://linkedin.com/in/johndoe",
    leetcode: "https://leetcode.com/johndoe",
  },
};

export default PortfolioTemplate;