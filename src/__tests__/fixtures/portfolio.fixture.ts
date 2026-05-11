/**
 * Fixtures for Tests
 * Place at: src/__tests__/fixtures/portfolio.fixture.ts
 */

import { Portfolio, Project, WorkExperienceItem, EducationItem, CertificationItem } from '@/lib/schema';

export const minimalValidPortfolio: Portfolio = {
  slug: 'testuser123',
  features: {
    showProjects: true,
    showWorkExperience: true,
    showContact: true,
    showBuildSection: true,
  },
  sections: {
    projects: { showInResume: true, showInPortfolio: true },
    workExperience: { showInResume: true, showInPortfolio: true },
    education: { showInResume: true, showInPortfolio: true },
    certifications: { showInResume: true, showInPortfolio: true },
    contact: { showInResume: false, showInPortfolio: true },
    buildSection: { showInPortfolio: true },
  },
  Intro: {
    FirstName: 'John',
    LastName: 'Doe',
    OneLinerIntro: 'Senior Frontend Developer with 5+ years',
    Theme: 'dark',
    profileImage: '',
    phone: '',
  },
  AboutMe: {
    gender: 'male',
    experience: {
      yearsOfExperience: 5,
      experienceSummary: 'I have extensive experience building scalable web applications',
    },
    locationOfWork: {
      timeZone: 'EST',
      locatedAt: 'New York, USA',
    },
    passion: {
      passionTitle: 'Frontend Architecture',
      passionDescription: 'I am passionate about building scalable frontend systems',
      description: 'I am passionate about building scalable frontend systems',
    },
    skills: ['react', 'typescript', 'next'],
    email: 'john@example.com',
  },
  ContactMe: {
    contactMeFor: 'I am open to new opportunities',
    email: 'john@example.com',
  },
  Projects: [
    {
      icon: '',
      title: 'Portfolio Builder',
      role: 'Solo Developer',
      description: 'A multi-tenant SaaS platform for creating portfolios',
      techstack: ['next', 'typescript', 'tailwind'],
      link: 'https://example.com',
      githubUrl: 'https://github.com/example/portfolio',
    },
  ],
  WorkExperience: [
    {
      image: '',
      company: 'Tech Corp',
      title: 'Senior Frontend Engineer',
      location: 'New York, USA',
      startMonth: 'January',
      startYear: '2021',
      endMonth: '',
      endYear: '',
      isCurrentJob: true,
      description: 'Lead frontend development for multiple projects',
    },
  ],
  Education: [
    {
      type: 'degree',
      institutionName: 'State University',
      fieldOfStudy: 'Computer Science',
      startYear: '2015',
      endYear: '2019',
      grade: '3.8 GPA',
      location: 'USA',
    },
  ],
  Certifications: [
    {
      name: 'AWS Solutions Architect',
      organization: 'Amazon Web Services',
      date: '2023',
      credentialUrl: 'https://example.com/cert',
    },
  ],
  Footer: {
    FirstName: 'John',
    LastName: 'Doe',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    leetcode: 'https://leetcode.com/johndoe',
  },
};

export const invalidPortfolio = {
  slug: '', // Missing
  FirstName: '', // Wrong structure
  // Missing almost everything
};

export const portfolioFormData = {
  profileImage: '',
  phone: '',
  slug: 'newuser123',
  firstName: 'Jane',
  lastName: 'Smith',
  oneLinerIntro: 'Frontend Developer with passion for clean code',
  theme: 'light' as const,
  gender: 'female' as const,
  experienceSummary: 'Over 3 years of experience in React and TypeScript development',
  locatedAt: 'San Francisco, USA',
  timeZone: 'PST',
  passionTitle: 'Building Accessible UIs',
  passionDescription: 'I love creating interfaces that are accessible to everyone',
  skills: ['react', 'typescript', 'tailwind'],
  email: 'jane@example.com',
  contactMeFor: 'Interested in freelance projects and collaborations',
  projects: [
    {
      icon: '',
      title: 'E-commerce Platform',
      role: 'Lead Developer',
      description: 'Built a full-stack e-commerce platform',
      techstack: ['react', 'typescript', 'next'],
      link: 'https://example-shop.com',
      githubUrl: '',
    },
  ],
  workExperiences: [
    {
      image: '',
      company: 'Design Studio',
      title: 'Frontend Developer',
      location: 'Remote',
      startMonth: 'June',
      startYear: '2021',
      endMonth: '',
      endYear: '',
      isCurrentJob: true,
      description: 'Developing responsive web applications',
    },
  ],
  education: [],
  certifications: [],
  github: 'https://github.com/janesmith',
  linkedin: 'https://linkedin.com/in/janesmith',
  leetcode: '',
  sections: {
    projects: { showInResume: true, showInPortfolio: true },
    workExperience: { showInResume: true, showInPortfolio: true },
    education: { showInResume: true, showInPortfolio: true },
    certifications: { showInResume: true, showInPortfolio: true },
    contact: { showInResume: false, showInPortfolio: true },
    buildSection: { showInPortfolio: true },
  },
};

export const edgeCasePortfolios = {
  maxLength: {
    ...minimalValidPortfolio,
    slug: 'a'.repeat(40), // Max length slug
    Intro: {
      ...minimalValidPortfolio.Intro,
      FirstName: 'A'.repeat(100),
      LastName: 'B'.repeat(100),
      OneLinerIntro: 'X'.repeat(500),
    },
  },
  specialCharacters: {
    ...minimalValidPortfolio,
    slug: 'test-user-123-valid',
    Intro: {
      ...minimalValidPortfolio.Intro,
      FirstName: "O'Connor", // Apostrophe
      OneLinerIntro: 'Developer & Designer (with symbols) — plus—dash',
    },
  },
  unicode: {
    ...minimalValidPortfolio,
    Intro: {
      ...minimalValidPortfolio.Intro,
      FirstName: 'José',
      LastName: 'García',
      OneLinerIntro: 'Développeur 中文 العربية',
    },
  },
  emptyOptional: {
    ...minimalValidPortfolio,
    Projects: null,
    Education: [],
    Certifications: [],
  },
};
