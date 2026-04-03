import { z } from "zod";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

export const ProjectSchema = z.object({
  icon: z.string().optional().default(""),
  title: z.string().min(1, "Project title is required"),
  description: z.string().min(1, "Project description is required"),
  techstack: z.array(z.string()).default([]),
  link: z.string().url("Must be a valid URL").or(z.literal("")).optional().default(""),
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

export const FeatureFlagsSchema = z.object({
  showProjects: z.boolean().default(true),
  showWorkExperience: z.boolean().default(true),
  showContact: z.boolean().default(true),
  showBuildSection: z.boolean().default(true),
});

// ─── Main portfolio schema ────────────────────────────────────────────────────

export const PortfolioSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(40, "Slug must be under 40 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),

  features: FeatureFlagsSchema.default({}),

  Intro: z.object({
    FirstName: z.string().min(1, "First name is required"),
    LastName: z.string().min(1, "Last name is required"),
    OneLinerIntro: z.string().min(10, "Intro must be at least 10 characters"),
    Theme: z.enum(["light", "dark"]).default("dark"),
    profileImage: z.string().optional().default(""),
  }),

  AboutMe: z.object({
    gender: z.enum(["male", "female", "other"]),
    experience: z.object({
      yearsOfExperience: z.number().min(0).max(50),
      experienceSummary: z.string().min(20, "Summary must be at least 20 characters"),
    }),
    locationOfWork: z.object({
      timeZone: z.string().min(1, "Timezone is required"),
      locatedAt: z.string().min(1, "Location is required"),
    }),
    passion: z.object({
      passionTitle: z.string().min(1, "Passion title is required"),
      description: z.string().min(20, "Description must be at least 20 characters"),
    }),
    skills: z.array(z.string()).min(1, "Select at least one skill"),
    email: z.string().email("Must be a valid email"),
  }),

  ContactMe: z.object({
    contactMeFor: z.string().min(10, "Contact description must be at least 10 characters"),
    email: z.string().email("Must be a valid email"),
  }),

  Projects: z.array(ProjectSchema).nullable().default(null),
  WorkExperience: z.array(WorkExperienceSchema).min(1, "Add at least one work experience"),

  Footer: z.object({
    FirstName: z.string(),
    LastName: z.string(),
    github: z.string().url().or(z.literal("")).optional().default(""),
    linkedin: z.string().url().or(z.literal("")).optional().default(""),
    leetcode: z.string().url().or(z.literal("")).optional().default(""),
  }),
});

// ─── Derived types ────────────────────────────────────────────────────────────

export type Portfolio = z.infer<typeof PortfolioSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type WorkExperienceItem = z.infer<typeof WorkExperienceSchema>;
export type FeatureFlags = z.infer<typeof FeatureFlagsSchema>;
export type IntroData = Portfolio["Intro"];
export type AboutMeData = Portfolio["AboutMe"];
export type ContactMeData = Portfolio["ContactMe"];
export type FooterData = Portfolio["Footer"];

// ─── Form state ───────────────────────────────────────────────────────────────

export type PortfolioFormData = {
  profileImage: string;
  slug: string;
  firstName: string;
  lastName: string;
  oneLinerIntro: string;
  theme: "light" | "dark";
  gender: "male" | "female" | "other";
  yearsOfExperience: number;
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
    company: string;
    title: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    isCurrentJob: boolean;
    description: string;
  }[];
  github: string;
  linkedin: string;
  leetcode: string;
  // feature flags
  showProjects: boolean;
  showWorkExperience: boolean;
  showContact: boolean;
};

// ─── Form → Portfolio converter ───────────────────────────────────────────────

export function formDataToPortfolio(data: PortfolioFormData): Portfolio {
  return {
    slug: data.slug,
    features: {
      showProjects: data.showProjects,
      showWorkExperience: data.showWorkExperience,
      showContact: data.showContact,
      showBuildSection: true,
    },
    Intro: {
      FirstName: data.firstName,
      LastName: data.lastName,
      OneLinerIntro: data.oneLinerIntro,
      Theme: data.theme,
      profileImage: data.profileImage ?? "",
    },
    AboutMe: {
      gender: data.gender,
      experience: {
        yearsOfExperience: data.yearsOfExperience,
        experienceSummary: data.experienceSummary,
      },
      locationOfWork: { timeZone: data.timeZone, locatedAt: data.locatedAt },
      passion: { passionTitle: data.passionTitle, description: data.passionDescription },
      skills: data.skills,
      email: data.email,
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
      isCurrentJob: w.isCurrentJob,
      description: w.description,
    })),
    Footer: {
      FirstName: data.firstName, LastName: data.lastName,
      github: data.github, linkedin: data.linkedin, leetcode: data.leetcode,
    },
  };
}
