import { z } from "zod";

// ─── Months helper ────────────────────────────────────────────────────────────
const MONTHS = ["", "January","February","March","April","May","June",
  "July","August","September","October","November","December"] as const;

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

export const ProjectSchema = z.object({
  icon: z.string().optional().default(""),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  techstack: z.array(z.string()).default([]),
  link: z.string().url().or(z.literal("")).optional().default(""),
});

export const WorkExperienceSchema = z.object({
  image: z.string().optional().default(""),
  company: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  startMonth: z.string().default(""),
  startYear: z.string().min(4, "Start year is required"),
  endMonth: z.string().default(""),
  endYear: z.string().default(""),
  isCurrentJob: z.boolean().default(false),
  description: z.string().min(1, "Description is required"),
});

export const EducationSchema = z.object({
  type: z.enum(["degree", "12th", "10th", "diploma", "other"]).default("degree"),
  institutionName: z.string().min(1, "Institution name is required"),
  fieldOfStudy: z.string().default(""),
  startYear: z.string().default(""),
  endYear: z.string().default(""),
  grade: z.string().default(""),
  location: z.string().default(""),
});

export const CertificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  organization: z.string().min(1, "Organization is required"),
  date: z.string().default(""),
  credentialUrl: z.string().url().or(z.literal("")).optional().default(""),
});

// ─── Section visibility — per resume and per portfolio ────────────────────────
export const SectionVisibilitySchema = z.object({
  showInResume: z.boolean().default(true),
  showInPortfolio: z.boolean().default(true),
});

export const SectionTogglesSchema = z.object({
  projects:       SectionVisibilitySchema.default({}),
  workExperience: SectionVisibilitySchema.default({}),
  education:      SectionVisibilitySchema.default({}),
  certifications: SectionVisibilitySchema.default({}),
  contact:        SectionVisibilitySchema.default({}),
  buildSection:   z.object({ showInPortfolio: z.boolean().default(true) }).default({}),
});

// ─── Main portfolio schema ────────────────────────────────────────────────────
export const PortfolioSchema = z.object({
  slug: z.string()
    .min(3, "Slug must be at least 3 characters")
    .max(40, "Slug must be under 40 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),

  // Legacy feature flags — kept for backward compat with existing user portfolios
  features: z.object({
    showProjects:       z.boolean().default(true),
    showWorkExperience: z.boolean().default(true),
    showContact:        z.boolean().default(true),
    showBuildSection:   z.boolean().default(true),
  }).default({}),

  // New granular section toggles
  sections: SectionTogglesSchema.default({}),

  Intro: z.object({
    FirstName:    z.string().min(1, "First name is required"),
    LastName:     z.string().min(1, "Last name is required"),
    OneLinerIntro:z.string().min(10, "Intro must be at least 10 characters"),
    Theme:        z.enum(["light", "dark"]).default("dark"),
    profileImage: z.string().optional().default(""),
    phone:        z.string().optional().default(""),
  }),

  AboutMe: z.object({
    gender: z.enum(["male", "female", "other"]),
    experience: z.object({
      yearsOfExperience: z.number().min(0).max(50).optional().default(0),
      experienceSummary: z.string().min(20, "Summary must be at least 20 characters"),
    }),
    locationOfWork: z.object({
      timeZone: z.string().min(1, "Timezone is required"),
      locatedAt: z.string().min(1, "Location is required"),
    }),
    passion: z.object({
      passionTitle:       z.string().min(1, "Passion title is required"),
      passionDescription: z.string().optional().default(""),
      description:        z.string().optional().default(""), // legacy alias
    }),
    skills: z.array(z.string()).min(1, "Select at least one skill"),
    email:  z.string().email("Must be a valid email"),
  }),

  ContactMe: z.object({
    contactMeFor: z.string().min(10, "Contact description must be at least 10 characters"),
    email:        z.string().email("Must be a valid email"),
  }),

  Projects:       z.array(ProjectSchema).nullable().default(null),
  WorkExperience: z.array(WorkExperienceSchema).min(1, "Add at least one work experience"),
  Education:      z.array(EducationSchema).optional().default([]),
  Certifications: z.array(CertificationSchema).optional().default([]),

  Footer: z.object({
    FirstName: z.string(),
    LastName:  z.string(),
    github:    z.string().url().or(z.literal("")).optional().default(""),
    linkedin:  z.string().url().or(z.literal("")).optional().default(""),
    leetcode:  z.string().url().or(z.literal("")).optional().default(""),
  }),
});

// ─── Derived types ────────────────────────────────────────────────────────────
export type Portfolio        = z.infer<typeof PortfolioSchema>;
export type Project          = z.infer<typeof ProjectSchema>;
export type WorkExperienceItem = z.infer<typeof WorkExperienceSchema>;
export type EducationItem    = z.infer<typeof EducationSchema>;
export type CertificationItem = z.infer<typeof CertificationSchema>;
export type SectionToggles   = z.infer<typeof SectionTogglesSchema>;
export type SectionVisibility = z.infer<typeof SectionVisibilitySchema>;
export type IntroData        = Portfolio["Intro"];
export type AboutMeData      = Portfolio["AboutMe"];
export type ContactMeData    = Portfolio["ContactMe"];
export type FooterData       = Portfolio["Footer"];

// ─── Section visibility helpers ───────────────────────────────────────────────
// Resolves legacy `features` flags for backward compat with old user portfolios
export function getSectionVisibility(portfolio: Portfolio) {
  const s = portfolio.sections;
  const f = portfolio.features;
  return {
    showProjectsInPortfolio:
      s?.projects?.showInPortfolio ?? f?.showProjects ?? true,
    showWorkInPortfolio:
      s?.workExperience?.showInPortfolio ?? f?.showWorkExperience ?? true,
    showContactInPortfolio:
      s?.contact?.showInPortfolio ?? f?.showContact ?? true,
    showBuildSection:
      s?.buildSection?.showInPortfolio ?? f?.showBuildSection ?? true,
    showEducationInPortfolio:
      s?.education?.showInPortfolio ?? true,
    showCertsInPortfolio:
      s?.certifications?.showInPortfolio ?? true,
    showProjectsInResume:
      s?.projects?.showInResume ?? true,
    showWorkInResume:
      s?.workExperience?.showInResume ?? true,
    showEducationInResume:
      s?.education?.showInResume ?? true,
    showCertsInResume:
      s?.certifications?.showInResume ?? true,
  };
}

// ─── Form state ───────────────────────────────────────────────────────────────
export type PortfolioFormData = {
  profileImage: string;
  phone: string;
  slug: string;
  firstName: string;
  lastName: string;
  oneLinerIntro: string;
  theme: "light" | "dark";
  gender: "male" | "female" | "other";
  experienceSummary: string;
  locatedAt: string;
  timeZone: string;
  passionTitle: string;
  passionDescription: string;
  skills: string[];
  email: string;
  contactMeFor: string;
  projects: { title: string; description: string; techstack: string[]; link: string }[];
  workExperiences: {
    company: string; title: string;
    startMonth: string; startYear: string;
    endMonth: string; endYear: string;
    isCurrentJob: boolean; description: string;
  }[];
  education: {
    type: "degree" | "12th" | "10th" | "diploma" | "other";
    institutionName: string; fieldOfStudy: string;
    startYear: string; endYear: string;
    grade: string; location: string;
  }[];
  certifications: {
    name: string; organization: string; date: string; credentialUrl: string;
  }[];
  github: string;
  linkedin: string;
  leetcode: string;
  // Section toggles
  sections: {
    projects:       { showInResume: boolean; showInPortfolio: boolean };
    workExperience: { showInResume: boolean; showInPortfolio: boolean };
    education:      { showInResume: boolean; showInPortfolio: boolean };
    certifications: { showInResume: boolean; showInPortfolio: boolean };
    contact:        { showInResume: boolean; showInPortfolio: boolean };
    buildSection:   { showInPortfolio: boolean };
  };
};

// ─── Form → Portfolio converter ───────────────────────────────────────────────
export function formDataToPortfolio(data: PortfolioFormData): Portfolio {
  return {
    slug: data.slug,
    features: {
      showProjects:       data.sections.projects.showInPortfolio,
      showWorkExperience: data.sections.workExperience.showInPortfolio,
      showContact:        data.sections.contact.showInPortfolio,
      showBuildSection:   data.sections.buildSection.showInPortfolio,
    },
    sections: data.sections,
    Intro: {
      FirstName:     data.firstName,
      LastName:      data.lastName,
      OneLinerIntro: data.oneLinerIntro,
      Theme:         data.theme,
      profileImage:  data.profileImage ?? "",
      phone:         data.phone ?? "",
    },
    AboutMe: {
      gender: data.gender,
      experience: {
        yearsOfExperience: 0,
        experienceSummary: data.experienceSummary,
      },
      locationOfWork: { timeZone: data.timeZone, locatedAt: data.locatedAt },
      passion: {
        passionTitle:       data.passionTitle,
        passionDescription: data.passionDescription,
        description:        data.passionDescription,
      },
      skills: data.skills,
      email:  data.email,
    },
    ContactMe: { contactMeFor: data.contactMeFor, email: data.email },
    Projects: data.projects.filter(p => p.title).length > 0
      ? data.projects.filter(p => p.title).map(p => ({
          icon: "", title: p.title, description: p.description,
          techstack: p.techstack, link: p.link,
        }))
      : null,
    WorkExperience: data.workExperiences.map(w => ({
      image: "", company: w.company, title: w.title,
      startMonth: w.startMonth, startYear: w.startYear,
      endMonth: w.endMonth, endYear: w.endYear,
      isCurrentJob: w.isCurrentJob, description: w.description,
    })),
    Education: data.education.map(e => ({
      type: e.type, institutionName: e.institutionName,
      fieldOfStudy: e.fieldOfStudy, startYear: e.startYear,
      endYear: e.endYear, grade: e.grade, location: e.location,
    })),
    Certifications: data.certifications.map(c => ({
      name: c.name, organization: c.organization,
      date: c.date, credentialUrl: c.credentialUrl,
    })),
    Footer: {
      FirstName: data.firstName, LastName: data.lastName,
      github: data.github, linkedin: data.linkedin, leetcode: data.leetcode,
    },
  };
}
