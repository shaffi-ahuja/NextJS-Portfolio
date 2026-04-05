"use client";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PortfolioFormData, formDataToPortfolio } from "@/lib/schema";
import { generateSlug } from "@/lib/storage";
import AIAssistButton from "./ui/AIAssistButton";

const SKILLS = [
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
  "figma",
  "dotnet",
  "cs",
  "python",
  "aws",
  "docker",
  "terraform",
  "sqlite",
  "git",
  "angular",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const emptyProject = () => ({
  title: "",
  description: "",
  techstack: [] as string[],
  link: "",
});
const emptyWork = () => ({
  company: "",
  title: "",
  startMonth: "",
  startYear: "",
  endMonth: "",
  endYear: "",
  isCurrentJob: false,
  description: "",
});
const emptyEdu = () => ({
  type: "degree" as const,
  institutionName: "",
  fieldOfStudy: "",
  startYear: "",
  endYear: "",
  grade: "",
  location: "",
});
const emptyCert = () => ({
  name: "",
  organization: "",
  date: "",
  credentialUrl: "",
});

const defaultSections = () => ({
  projects: { showInResume: true, showInPortfolio: true },
  workExperience: { showInResume: true, showInPortfolio: true },
  education: { showInResume: true, showInPortfolio: true },
  certifications: { showInResume: true, showInPortfolio: true },
  contact: { showInResume: false, showInPortfolio: true },
  buildSection: { showInPortfolio: true },
});

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 text-sm mt-1">{msg}</p>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-semibold mt-8 mb-2 border-b border-zinc-300 dark:border-zinc-700 pb-2">
      {children}
    </h3>
  );
}

// Toggle switch shared component
function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-zinc-800 dark:bg-zinc-200" : "bg-zinc-300 dark:bg-zinc-600"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

type SlugStatus = "idle" | "checking" | "available" | "taken" | "invalid";

function SlugIndicator({ status }: { status: SlugStatus }) {
  if (status === "idle") return null;
  const map: Record<SlugStatus, { color: string; text: string }> = {
    idle: { color: "", text: "" },
    checking: { color: "text-zinc-400", text: "⏳ Checking..." },
    available: { color: "text-green-500", text: "✓ Available" },
    taken: {
      color: "text-red-500",
      text: "✗ Already taken — choose a different URL",
    },
    invalid: {
      color: "text-yellow-500",
      text: "⚠ Only lowercase letters, numbers, hyphens (min 3 chars)",
    },
  };
  const { color, text } = map[status];
  return <p className={`text-sm mt-1 ${color}`}>{text}</p>;
}

function SkillMultiSelect({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (s: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (skill: string) =>
    onChange(
      selected.includes(skill)
        ? selected.filter((s) => s !== skill)
        : [...selected, skill],
    );
  return (
    <div className="relative w-full">
      <div
        onClick={() => setOpen(!open)}
        className="input flex justify-between items-center capitalize cursor-pointer"
      >
        <span className="truncate">
          {selected.length > 0 ? selected.join(", ") : "Select skills"}
        </span>
        <svg
          className={`w-5 h-5 flex-shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {open && (
        <ul className="absolute z-10 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto dark:bg-zinc-900 bg-zinc-200 border border-zinc-300 dark:border-zinc-700">
          {SKILLS.map((skill) => (
            <li
              key={skill}
              onClick={() => toggle(skill)}
              className={`px-4 py-3 cursor-pointer capitalize flex items-center gap-2 dark:hover:bg-zinc-700 hover:bg-zinc-300 ${selected.includes(skill) ? "dark:bg-zinc-700 bg-zinc-300" : ""}`}
            >
              <input
                type="checkbox"
                readOnly
                checked={selected.includes(skill)}
                className="mr-1"
              />
              {skill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function UserForm() {
  const router = useRouter();
  const [form, setForm] = useState<PortfolioFormData>({
    profileImage: "",
    phone: "",
    slug: "",
    firstName: "",
    lastName: "",
    oneLinerIntro: "",
    theme: "dark",
    gender: "male",
    experienceSummary: "",
    locatedAt: "",
    timeZone: "",
    passionTitle: "",
    passionDescription: "",
    skills: [],
    email: "",
    contactMeFor: "",
    projects: [emptyProject()],
    workExperiences: [emptyWork()],
    education: [],
    certifications: [],
    github: "",
    linkedin: "",
    leetcode: "",
    sections: defaultSections(),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const slugDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [streamingMap, setStreamingMap] = useState<Record<string, string>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const streamText = async (
    key: string,
    fullText: string,
    onComplete?: (text: string) => void,
  ) => {
    setLoadingMap((prev) => ({ ...prev, [key]: true }));
    setStreamingMap((prev) => ({ ...prev, [key]: "" }));

    for (let i = 0; i < fullText.length; i++) {
      await new Promise((r) => setTimeout(r, 10));

      setStreamingMap((prev) => ({
        ...prev,
        [key]: (prev[key] || "") + fullText[i],
      }));
    }

    setLoadingMap((prev) => ({ ...prev, [key]: false }));

    if (onComplete) onComplete(fullText);
  };

  useEffect(() => {
    if (form.firstName && form.lastName && !form.slug) {
      setForm((f) => ({ ...f, slug: generateSlug(f.firstName, f.lastName) }));
    }
  }, [form.firstName, form.lastName]);

  useEffect(() => {
    if (!form.slug) {
      setSlugStatus("idle");
      return;
    }
    const valid = /^[a-z0-9-]{3,40}$/.test(form.slug);
    if (!valid) {
      setSlugStatus("invalid");
      return;
    }
    setSlugStatus("checking");
    if (slugDebounceRef.current) clearTimeout(slugDebounceRef.current);
    slugDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/portfolio/check-slug?slug=${form.slug}`);
        const data = await res.json();
        setSlugStatus(data.available ? "available" : "taken");
      } catch {
        setSlugStatus("idle");
      }
    }, 500);
    return () => {
      if (slugDebounceRef.current) clearTimeout(slugDebounceRef.current);
    };
  }, [form.slug]);

  const set = (field: keyof PortfolioFormData, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  // Section toggle helper
  const toggleSection = (
    key: keyof typeof form.sections,
    subKey: "showInResume" | "showInPortfolio",
  ) => {
    setForm((f) => ({
      ...f,
      sections: {
        ...f.sections,
        [key]: {
          ...(f.sections[key] as any),
          [subKey]: !(f.sections[key] as any)[subKey],
        },
      },
    }));
  };

  // Projects
  const updateProject = (i: number, field: string, value: unknown) => {
    const updated = [...form.projects];
    updated[i] = { ...updated[i], [field]: value };
    setForm((f) => ({ ...f, projects: updated }));
  };
  const addProject = () =>
    setForm((f) => ({ ...f, projects: [...f.projects, emptyProject()] }));
  const removeProject = (i: number) =>
    setForm((f) => ({
      ...f,
      projects: f.projects.filter((_, idx) => idx !== i),
    }));

  // Work
  const updateWork = (i: number, field: string, value: string | boolean) => {
    const updated = [...form.workExperiences];
    updated[i] = { ...updated[i], [field]: value };
    setForm((f) => ({ ...f, workExperiences: updated }));
  };
  const addWork = () =>
    setForm((f) => ({
      ...f,
      workExperiences: [...f.workExperiences, emptyWork()],
    }));
  const removeWork = (i: number) =>
    setForm((f) => ({
      ...f,
      workExperiences: f.workExperiences.filter((_, idx) => idx !== i),
    }));

  // Education
  const updateEdu = (i: number, field: string, value: string) => {
    const updated = [...form.education];
    updated[i] = { ...updated[i], [field]: value };
    setForm((f) => ({ ...f, education: updated }));
  };
  const addEdu = () =>
    setForm((f) => ({ ...f, education: [...f.education, emptyEdu()] }));
  const removeEdu = (i: number) =>
    setForm((f) => ({
      ...f,
      education: f.education.filter((_, idx) => idx !== i),
    }));

  // Certifications
  const updateCert = (i: number, field: string, value: string) => {
    const updated = [...form.certifications];
    updated[i] = { ...updated[i], [field]: value };
    setForm((f) => ({ ...f, certifications: updated }));
  };
  const addCert = () =>
    setForm((f) => ({
      ...f,
      certifications: [...f.certifications, emptyCert()],
    }));
  const removeCert = (i: number) =>
    setForm((f) => ({
      ...f,
      certifications: f.certifications.filter((_, idx) => idx !== i),
    }));

  const validate = useCallback((): boolean => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.slug || !/^[a-z0-9-]{3,40}$/.test(form.slug))
      e.slug = "Invalid slug format";
    if (slugStatus === "taken") e.slug = "This URL is already taken";
    if (!form.oneLinerIntro || form.oneLinerIntro.length < 10)
      e.oneLinerIntro = "Intro must be at least 10 characters";
    if (!form.experienceSummary || form.experienceSummary.length < 20)
      e.experienceSummary = "Summary must be at least 20 characters";
    if (!form.locatedAt.trim()) e.locatedAt = "Location is required";
    if (!form.timeZone.trim()) e.timeZone = "Timezone is required";
    if (!form.passionTitle.trim()) e.passionTitle = "Passion title is required";
    if (!form.passionDescription || form.passionDescription.length < 20)
      e.passionDescription = "Description must be at least 20 characters";
    if (form.skills.length === 0) e.skills = "Select at least one skill";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email is required";
    if (!form.contactMeFor || form.contactMeFor.length < 10)
      e.contactMeFor = "Contact description required";
    form.workExperiences.forEach((w, i) => {
      if (!w.company.trim()) e[`work_company_${i}`] = "Company is required";
      if (!w.title.trim()) e[`work_title_${i}`] = "Job title is required";
      if (!w.startYear.trim()) e[`work_start_${i}`] = "Start year is required";
      if (!w.description.trim())
        e[`work_desc_${i}`] = "Description is required";
    });
    form.education.forEach((edu, i) => {
      if (!edu.institutionName.trim())
        e[`edu_name_${i}`] = "Institution name is required";
    });
    form.certifications.forEach((cert, i) => {
      if (!cert.name.trim())
        e[`cert_name_${i}`] = "Certification name is required";
      if (!cert.organization.trim())
        e[`cert_org_${i}`] = "Organization is required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [form, slugStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) {
      document
        .querySelector('[data-error="true"]')
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setPending(true);
    try {
      const portfolio = formDataToPortfolio(form);
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(portfolio),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong.");
        return;
      }
      router.push(`/user/${data.slug}`);
    } catch {
      setSubmitError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="user-form-container pb-20">
      <p className="font-bold mb-3 text-2xl">Build your portfolio</p>
      <p className="text-zinc-500 mb-6">
        Fill in the form below. Your portfolio will be live at{" "}
        <span className="font-mono dark:text-white text-black">
          /user/{form.slug || "your-slug"}
        </span>
      </p>

      {submitError && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-500 text-red-700 dark:text-red-400 rounded-md p-4 mb-6">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="form" noValidate>
        {/* ── Identity ── */}
        <SectionHeading>Your identity</SectionHeading>

        {/* Profile picture */}
        <div className="input-div items-center">
          <label className="self-start">
            Profile picture{" "}
            <span className="text-zinc-500 font-normal text-sm">
              (optional)
            </span>
          </label>
          <div className="flex items-center gap-5 mt-3">
            <div className="flex-shrink-0">
              {form.profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.profileImage}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-zinc-300 dark:border-zinc-600"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-zinc-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="profileImageInput"
                className="cursor-pointer border border-zinc-400 px-4 py-2 rounded-md text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 inline-block text-center"
              >
                {form.profileImage ? "Change photo" : "Upload photo"}
              </label>
              {form.profileImage && (
                <button
                  type="button"
                  onClick={() => set("profileImage", "")}
                  className="text-red-500 text-sm hover:underline text-left"
                >
                  Remove
                </button>
              )}
              <p className="text-xs text-zinc-500">
                JPG, PNG or WEBP · Max 2MB
              </p>
            </div>
          </div>
          <input
            id="profileImageInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 2 * 1024 * 1024) {
                setErrors((err) => ({
                  ...err,
                  profileImage: "Image must be under 2MB",
                }));
                return;
              }
              const reader = new FileReader();
              reader.onload = () =>
                set("profileImage", reader.result as string);
              reader.readAsDataURL(file);
            }}
          />
          <FieldError msg={errors.profileImage} />
        </div>

        <div className="input-div">
          <label htmlFor="firstName">First name *</label>
          <input
            id="firstName"
            className="input"
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="Shaffi"
            data-error={!!errors.firstName}
          />
          <FieldError msg={errors.firstName} />
        </div>
        <div className="input-div">
          <label htmlFor="lastName">Last name *</label>
          <input
            id="lastName"
            className="input"
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Ahuja"
            data-error={!!errors.lastName}
          />
          <FieldError msg={errors.lastName} />
        </div>
        <div className="input-div">
          <label htmlFor="phone">
            Phone number{" "}
            <span className="text-zinc-500 font-normal text-sm">
              (optional — shown in resume PDF)
            </span>
          </label>
          <input
            id="phone"
            type="tel"
            className="input"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+91-9876543210"
          />
        </div>
        <div className="input-div">
          <label htmlFor="slug">
            Portfolio URL *{" "}
            <span className="text-zinc-500 font-normal text-sm">
              — /user/<strong>{form.slug || "your-slug"}</strong>
            </span>
          </label>
          <input
            id="slug"
            className="input font-mono"
            value={form.slug}
            onChange={(e) =>
              set(
                "slug",
                e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
              )
            }
            placeholder="shaffiahuja"
            data-error={!!errors.slug}
          />
          <SlugIndicator status={slugStatus} />
          <FieldError msg={errors.slug} />
        </div>
        <div className="input-div">
          <label htmlFor="oneLinerIntro">One-liner intro *</label>
          <textarea
            id="oneLinerIntro"
            className="input"
            value={form.oneLinerIntro}
            onChange={(e) => set("oneLinerIntro", e.target.value)}
            placeholder="Senior Frontend Developer · React · Next.js · TypeScript"
            rows={2}
            data-error={!!errors.oneLinerIntro}
          />
          <FieldError msg={errors.oneLinerIntro} />
        </div>
        <div className="input-div">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            className="input"
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="input-div">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            className="input"
            value={form.theme}
            onChange={(e) => set("theme", e.target.value as "light" | "dark")}
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </div>

        {/* ── About ── */}
        <SectionHeading>About you</SectionHeading>
        <div className="input-div">
          <label htmlFor="experienceSummary">Experience summary *</label>
          <textarea
            id="experienceSummary"
            className="input"
            rows={3}
            value={form.experienceSummary}
            onChange={(e) => set("experienceSummary", e.target.value)}
            placeholder="I specialise in building scalable web applications..."
            data-error={!!errors.experienceSummary}
          />
          <AIAssistButton
            label="Generate from my experience"
            // disabled={form.workExperiences.every((w) => !w.company)}
            onResult={(text) => set("experienceSummary", text)}
            buildRequest={() => ({
              action: "generate_summary",
              workExperiences: form.workExperiences.filter((w) => w.company),
              skills: form.skills,
            })}
          />
          <FieldError msg={errors.experienceSummary} />
        </div>
        <div className="input-div">
          <label htmlFor="locatedAt">Location *</label>
          <input
            id="locatedAt"
            className="input"
            value={form.locatedAt}
            onChange={(e) => set("locatedAt", e.target.value)}
            placeholder="Haryana, India"
            data-error={!!errors.locatedAt}
          />
          <FieldError msg={errors.locatedAt} />
        </div>
        <div className="input-div">
          <label htmlFor="timeZone">Timezone *</label>
          <input
            id="timeZone"
            className="input"
            value={form.timeZone}
            onChange={(e) => set("timeZone", e.target.value)}
            placeholder="IST / any"
            data-error={!!errors.timeZone}
          />
          <FieldError msg={errors.timeZone} />
        </div>
        <div className="input-div">
          <label htmlFor="passionTitle">Passion title *</label>
          <input
            id="passionTitle"
            className="input"
            value={form.passionTitle}
            onChange={(e) => set("passionTitle", e.target.value)}
            placeholder="Crafting Exceptional UIs"
            data-error={!!errors.passionTitle}
          />
          <FieldError msg={errors.passionTitle} />
        </div>
        <div className="input-div">
          <label htmlFor="passionDescription">Passion description *</label>
          <textarea
            id="passionDescription"
            className="input"
            rows={3}
            value={form.passionDescription}
            onChange={(e) => set("passionDescription", e.target.value)}
            placeholder="What drives you professionally..."
            data-error={!!errors.passionDescription}
          />
          <FieldError msg={errors.passionDescription} />
        </div>
        <div className="input-div">
          <label>
            Skills *{" "}
            <span className="text-zinc-500 font-normal text-sm">
              (select all that apply)
            </span>
          </label>
          <div className="mt-3" data-error={!!errors.skills}>
            <SkillMultiSelect
              selected={form.skills}
              onChange={(s) => set("skills", s)}
            />
          </div>
          <FieldError msg={errors.skills} />
        </div>
        <div className="input-div">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            className="input"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            data-error={!!errors.email}
          />
          <FieldError msg={errors.email} />
        </div>
        <div className="input-div">
          <label htmlFor="contactMeFor">
            Why should someone contact you? *
          </label>
          <textarea
            id="contactMeFor"
            className="input"
            rows={2}
            value={form.contactMeFor}
            onChange={(e) => set("contactMeFor", e.target.value)}
            placeholder="Whether you need a scalable frontend or want to collaborate..."
            data-error={!!errors.contactMeFor}
          />
          <FieldError msg={errors.contactMeFor} />
        </div>

        {/* ── Projects ── */}
        <SectionHeading>Projects (optional)</SectionHeading>
        {form.projects.map((project, i) => {
          const projectKey = `project-${i}`;
          const isProjectDescStreaming = loadingMap[projectKey];
          const streamProjectDescValue = streamingMap[projectKey];
          return (
            <div
              key={i}
              className="border border-zinc-300 dark:border-zinc-700 rounded-md p-4 mt-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Project {i + 1}</p>
                {form.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProject(i)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="input-div">
                <label>Project title</label>
                <input
                  className="input"
                  value={project.title}
                  onChange={(e) => updateProject(i, "title", e.target.value)}
                  placeholder="Portfolio Builder — Multi-Tenant SaaS"
                />
              </div>
              <div className="input-div">
                <label>Description</label>
                <textarea
                  className="input"
                  rows={4}
                  value={
                    isProjectDescStreaming
                      ? streamProjectDescValue + "▌"
                      : project.description
                  }
                  onChange={(e) =>
                    updateProject(i, "description", e.target.value)
                  }
                  placeholder="What did you build and why does it matter..."
                  disabled={isProjectDescStreaming}
                />
                <AIAssistButton
                  label={
                    loadingMap[projectKey]
                      ? "Writing..."
                      : "Improve this description"
                  }
                  disabled={
                    !project.description.trim() || loadingMap[projectKey]
                  }
                  onResult={(text) => {
                    updateProject(i, "description", text);
                    streamText(projectKey, text);
                  }}
                  buildRequest={() => ({
                    action: "improve_description",
                    text: project.description,
                    context: project.title
                      ? `Project: ${project.title}`
                      : "Personal project",
                  })}
                />
              </div>
              <div className="input-div">
                <label>Tech stack</label>
                <SkillMultiSelect
                  selected={project.techstack}
                  onChange={(s) => updateProject(i, "techstack", s)}
                />
              </div>
              <div className="input-div">
                <label>Live URL</label>
                <input
                  className="input"
                  value={project.link}
                  onChange={(e) => updateProject(i, "link", e.target.value)}
                  placeholder="https://yourproject.vercel.app"
                />
              </div>
            </div>
          );
        })}
        <button
          type="button"
          onClick={addProject}
          className="mt-4 text-sm border border-zinc-400 px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          + Add another project
        </button>

        {/* ── Work Experience ── */}
        <SectionHeading>Work experience *</SectionHeading>
        {form.workExperiences.map((work, i) => {
          const workKey = `work-${i}`;
          const isStreaming = loadingMap[workKey];
          const streamValue = streamingMap[workKey];
          return (
            <div
              key={i}
              className="border border-zinc-300 dark:border-zinc-700 rounded-md p-4 mt-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Position {i + 1}</p>
                {form.workExperiences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWork(i)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="input-div">
                <label>Company *</label>
                <input
                  className="input"
                  value={work.company}
                  onChange={(e) => updateWork(i, "company", e.target.value)}
                  placeholder="Publicis Re:Sources"
                  data-error={!!errors[`work_company_${i}`]}
                />
                <FieldError msg={errors[`work_company_${i}`]} />
              </div>
              <div className="input-div">
                <label>Job title *</label>
                <input
                  className="input"
                  value={work.title}
                  onChange={(e) => updateWork(i, "title", e.target.value)}
                  placeholder="Senior Frontend Engineer"
                  data-error={!!errors[`work_title_${i}`]}
                />
                <FieldError msg={errors[`work_title_${i}`]} />
              </div>
              <div className="input-div">
                <label>Start date *</label>
                <div className="flex gap-3 mt-3">
                  <select
                    className="input flex-1"
                    value={work.startMonth}
                    onChange={(e) =>
                      updateWork(i, "startMonth", e.target.value)
                    }
                    aria-label="Start month"
                  >
                    <option value="">Month</option>
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <input
                    className="input flex-1"
                    value={work.startYear}
                    onChange={(e) => updateWork(i, "startYear", e.target.value)}
                    placeholder="2022"
                    aria-label="Start year"
                    data-error={!!errors[`work_start_${i}`]}
                  />
                </div>
                <FieldError msg={errors[`work_start_${i}`]} />
              </div>
              <div className="input-div">
                <div className="flex items-center justify-between mt-3">
                  <label className="text-sm font-medium">
                    I currently work here
                  </label>
                  <Toggle
                    checked={work.isCurrentJob}
                    onChange={() =>
                      updateWork(i, "isCurrentJob", !work.isCurrentJob)
                    }
                    label="Toggle current job"
                  />
                </div>
              </div>
              {!work.isCurrentJob && (
                <div className="input-div">
                  <label>End date</label>
                  <div className="flex gap-3 mt-3">
                    <select
                      className="input flex-1"
                      value={work.endMonth}
                      onChange={(e) =>
                        updateWork(i, "endMonth", e.target.value)
                      }
                      aria-label="End month"
                    >
                      <option value="">Month</option>
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <input
                      className="input flex-1"
                      value={work.endYear}
                      onChange={(e) => updateWork(i, "endYear", e.target.value)}
                      placeholder="2024"
                      aria-label="End year"
                    />
                  </div>
                </div>
              )}
              <div className="input-div">
                <label>What did you accomplish? *</label>
                <textarea
                  className="input"
                  rows={4}
                  value={isStreaming ? streamValue + "▌" : work.description}
                  onChange={(e) => updateWork(i, "description", e.target.value)}
                  placeholder="Lead with impact — what did you build, improve, or ship?"
                  data-error={!!errors[`work_desc_${i}`]}
                  disabled={isStreaming}
                />
                <AIAssistButton
                  label={
                    loadingMap[workKey]
                      ? "Writing..."
                      : "Improve this description"
                  }
                  disabled={!work.description.trim() || loadingMap[workKey]}
                  onResult={(text) => {
                    updateWork(i, "description", text);
                    streamText(workKey, text);
                  }}
                  buildRequest={() => ({
                    action: "improve_description",
                    text: work.description,
                    context: `${work.title} at ${work.company}`,
                  })}
                />
                <FieldError msg={errors[`work_desc_${i}`]} />
              </div>
            </div>
          );
        })}
        <button
          type="button"
          onClick={addWork}
          className="mt-4 text-sm border border-zinc-400 px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          + Add another position
        </button>

        {/* ── Education ── */}
        <SectionHeading>Education (optional)</SectionHeading>
        {form.education.map((edu, i) => (
          <div
            key={i}
            className="border border-zinc-300 dark:border-zinc-700 rounded-md p-4 mt-4"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">Education {i + 1}</p>
              <button
                type="button"
                onClick={() => removeEdu(i)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="input-div">
              <label>Type</label>
              <select
                className="input"
                value={edu.type}
                onChange={(e) => updateEdu(i, "type", e.target.value)}
              >
                <option value="degree">
                  Degree (B.Tech / B.Sc / MBA etc.)
                </option>
                <option value="12th">Class XII / 12th</option>
                <option value="10th">Class X / 10th</option>
                <option value="diploma">Diploma</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="input-div">
              <label>Institution name *</label>
              <input
                className="input"
                value={edu.institutionName}
                onChange={(e) =>
                  updateEdu(i, "institutionName", e.target.value)
                }
                placeholder="IIT Delhi / Your School Name"
                data-error={!!errors[`edu_name_${i}`]}
              />
              <FieldError msg={errors[`edu_name_${i}`]} />
            </div>
            <div className="input-div">
              <label>Field of study / Degree name</label>
              <input
                className="input"
                value={edu.fieldOfStudy}
                onChange={(e) => updateEdu(i, "fieldOfStudy", e.target.value)}
                placeholder="Bachelor of Technology — Computer Science"
              />
            </div>
            <div className="input-div">
              <label>Years</label>
              <div className="flex gap-3 mt-3">
                <input
                  className="input flex-1"
                  value={edu.startYear}
                  onChange={(e) => updateEdu(i, "startYear", e.target.value)}
                  placeholder="2015"
                  aria-label="Start year"
                />
                <input
                  className="input flex-1"
                  value={edu.endYear}
                  onChange={(e) => updateEdu(i, "endYear", e.target.value)}
                  placeholder="2019"
                  aria-label="End year"
                />
              </div>
            </div>
            <div className="input-div">
              <label>Grade / CGPA / Percentage</label>
              <input
                className="input"
                value={edu.grade}
                onChange={(e) => updateEdu(i, "grade", e.target.value)}
                placeholder="8.5 CGPA / 85%"
              />
            </div>
            <div className="input-div">
              <label>Location</label>
              <input
                className="input"
                value={edu.location}
                onChange={(e) => updateEdu(i, "location", e.target.value)}
                placeholder="New Delhi, India"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addEdu}
          className="mt-4 text-sm border border-zinc-400 px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          + Add education
        </button>

        {/* ── Certifications ── */}
        <SectionHeading>Certifications (optional)</SectionHeading>
        {form.certifications.map((cert, i) => (
          <div
            key={i}
            className="border border-zinc-300 dark:border-zinc-700 rounded-md p-4 mt-4"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">Certification {i + 1}</p>
              <button
                type="button"
                onClick={() => removeCert(i)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="input-div">
              <label>Certification name *</label>
              <input
                className="input"
                value={cert.name}
                onChange={(e) => updateCert(i, "name", e.target.value)}
                placeholder="React — The Complete Guide"
                data-error={!!errors[`cert_name_${i}`]}
              />
              <FieldError msg={errors[`cert_name_${i}`]} />
            </div>
            <div className="input-div">
              <label>Issuing organization *</label>
              <input
                className="input"
                value={cert.organization}
                onChange={(e) => updateCert(i, "organization", e.target.value)}
                placeholder="Udemy / Coursera / Google"
                data-error={!!errors[`cert_org_${i}`]}
              />
              <FieldError msg={errors[`cert_org_${i}`]} />
            </div>
            <div className="input-div">
              <label>Date</label>
              <input
                className="input"
                value={cert.date}
                onChange={(e) => updateCert(i, "date", e.target.value)}
                placeholder="2023"
              />
            </div>
            <div className="input-div">
              <label>Credential URL</label>
              <input
                className="input"
                value={cert.credentialUrl}
                onChange={(e) => updateCert(i, "credentialUrl", e.target.value)}
                placeholder="https://coursera.org/verify/..."
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addCert}
          className="mt-4 text-sm border border-zinc-400 px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          + Add certification
        </button>

        {/* ── Links ── */}
        <SectionHeading>Your links</SectionHeading>
        <div className="input-div">
          <label htmlFor="linkedin">LinkedIn</label>
          <input
            id="linkedin"
            className="input"
            value={form.linkedin}
            onChange={(e) => set("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/yourname"
          />
        </div>
        <div className="input-div">
          <label htmlFor="github">GitHub</label>
          <input
            id="github"
            className="input"
            value={form.github}
            onChange={(e) => set("github", e.target.value)}
            placeholder="https://github.com/yourname"
          />
        </div>
        <div className="input-div">
          <label htmlFor="leetcode">LeetCode</label>
          <input
            id="leetcode"
            className="input"
            value={form.leetcode}
            onChange={(e) => set("leetcode", e.target.value)}
            placeholder="https://leetcode.com/u/yourname"
          />
        </div>

        {/* ── Section Toggles ── */}
        <SectionHeading>Section visibility</SectionHeading>
        <p className="text-sm text-zinc-500 mb-4">
          Control where each section appears — resume PDF, portfolio website, or
          both.
        </p>

        <div className="border border-zinc-200 dark:border-zinc-700 rounded-md overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-3 text-xs font-semibold text-zinc-500 uppercase tracking-wide px-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-700">
            <span>Section</span>
            <span className="text-center">Resume</span>
            <span className="text-center">Portfolio</span>
          </div>

          {(
            [
              { key: "projects", label: "Projects", hasResume: true },
              {
                key: "workExperience",
                label: "Work Experience",
                hasResume: true,
              },
              { key: "education", label: "Education", hasResume: true },
              {
                key: "certifications",
                label: "Certifications",
                hasResume: true,
              },
              { key: "contact", label: "Contact Form", hasResume: false },
            ] as const
          ).map(({ key, label, hasResume }) => (
            <div
              key={key}
              className="grid grid-cols-3 items-center px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
            >
              <span className="text-sm font-medium">{label}</span>
              <div className="flex justify-center">
                {hasResume ? (
                  <Toggle
                    checked={(form.sections[key] as any).showInResume}
                    onChange={() => toggleSection(key, "showInResume")}
                    label={`Show ${label} in resume`}
                  />
                ) : (
                  <span className="text-xs text-zinc-400">n/a</span>
                )}
              </div>
              <div className="flex justify-center">
                <Toggle
                  checked={(form.sections[key] as any).showInPortfolio}
                  onChange={() => toggleSection(key, "showInPortfolio")}
                  label={`Show ${label} in portfolio`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Submit ── */}
        <div className="input-div mt-10">
          <button
            type="submit"
            disabled={
              pending || slugStatus === "taken" || slugStatus === "invalid"
            }
            className={`button ${pending || slugStatus === "taken" || slugStatus === "invalid" ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {pending ? (
              <span>Creating your portfolio...</span>
            ) : (
              <>
                <span>Launch my portfolio</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="go-to-arrow ml-2 size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
