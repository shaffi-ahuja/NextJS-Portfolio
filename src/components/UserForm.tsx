"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PortfolioFormData, formDataToPortfolio } from "@/lib/schema";
import { generateSlug } from "@/lib/storage";
import { useFormArray } from "@/hooks/useFormArray";
import { useSlugValidation } from "@/hooks/useSlugValidation";
import { validateForm, scrollToFirstError } from "@/lib/formValidation";
import {
  FieldError,
  SectionHeading,
  Toggle,
  SlugIndicator,
  SkillMultiSelect,
} from "./FormComponents";
import {
  ProjectForm,
  WorkForm,
  EducationForm,
  CertificationForm,
} from "./FormSections";
import AIAssistButton from "./ui/AIAssistButton";

const emptyProject = () => ({
  icon: "",
  title: "",
  role: "",
  description: "",
  techstack: [] as string[],
  link: "",
  githubUrl: "",
});

const emptyWork = () => ({
  image: "",
  company: "",
  title: "",
  location: "",
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

export default function UserForm() {
  const router = useRouter();

  // Core form state
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

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { slug, status: slugStatus, checkSlug } = useSlugValidation();
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [streamingMap, setStreamingMap] = useState<Record<string, string>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const streamText = useCallback(
    async (
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
    },
    [],
  );

  useEffect(() => {
    if (form.firstName && form.lastName && !form.slug) {
      const newSlug = generateSlug(form.firstName, form.lastName);
      setForm((f) => ({ ...f, slug: newSlug }));
      checkSlug(newSlug);
    }
  }, [form.firstName, form.lastName, checkSlug]);

  // Sync slug changes to validation hook
  useEffect(() => {
    setForm((f) => ({ ...f, slug }));
  }, [slug]);

  // Form array management using custom hook
  const projects = useFormArray<typeof form.projects[0]>(form.projects);
  const workExperiences = useFormArray<typeof form.workExperiences[0]>(form.workExperiences);
  const educations = useFormArray<typeof form.education[0]>(form.education);
  const certifications = useFormArray<typeof form.certifications[0]>(form.certifications);

  // Sync array state with main form
  useEffect(() => {
    setForm((f) => ({ ...f, projects: projects.items }));
  }, [projects.items]);

  useEffect(() => {
    setForm((f) => ({ ...f, workExperiences: workExperiences.items }));
  }, [workExperiences.items]);

  useEffect(() => {
    setForm((f) => ({ ...f, education: educations.items }));
  }, [educations.items]);

  useEffect(() => {
    setForm((f) => ({ ...f, certifications: certifications.items }));
  }, [certifications.items]);

  const set = useCallback((field: keyof PortfolioFormData, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }, []);

  const toggleSection = useCallback(
    (
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
    },
    [],
  );

  const validate = useCallback((): boolean => {
    const formErrors = validateForm(form, slugStatus);
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [form, slugStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) {
      scrollToFirstError();
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
          /user/{slug || "your-slug"}
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
              — /user/<strong>{slug || "your-slug"}</strong>
            </span>
          </label>
          <input
            id="slug"
            className="input font-mono"
            value={slug}
            onChange={(e) => checkSlug(e.target.value)}
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
        {projects.items.map((project, i) => {
          const projectKey = `project-${i}`;
          const isProjectDescStreaming = loadingMap[projectKey];
          const streamProjectDescValue = streamingMap[projectKey];
          return (
            <ProjectForm
              key={i}
              index={i}
              project={project}
              errors={errors}
              isStreaming={isProjectDescStreaming}
              streamValue={streamProjectDescValue}
              onUpdate={(field, value) => projects.update(i, field, value)}
              onRemove={() => projects.remove(i)}
              onStream={(text) => streamText(projectKey, text)}
              canRemove={projects.items.length > 1}
            />
          );
        })}
        <button
          type="button"
          onClick={() => projects.add(emptyProject())}
          className="mt-4 text-sm border border-zinc-400 px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          + Add another project
        </button>

        {/* ── Work Experience ── */}
        <SectionHeading>Work experience *</SectionHeading>
        {workExperiences.items.map((work, i) => {
          const workKey = `work-${i}`;
          const isStreaming = loadingMap[workKey];
          const streamValue = streamingMap[workKey];
          return (
            <WorkForm
              key={i}
              index={i}
              work={work}
              errors={errors}
              isStreaming={isStreaming}
              streamValue={streamValue}
              onUpdate={(field, value) => workExperiences.update(i, field, value)}
              onRemove={() => workExperiences.remove(i)}
              onStream={(text) => streamText(workKey, text)}
              onToggleCurrentJob={() =>
                workExperiences.update(i, "isCurrentJob", !work.isCurrentJob)
              }
              canRemove={workExperiences.items.length > 1}
            />
          );
        })}
        <button
          type="button"
          onClick={() => workExperiences.add(emptyWork())}
          className="mt-4 text-sm border border-zinc-400 px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          + Add another position
        </button>

        {/* ── Education ── */}
        <SectionHeading>Education (optional)</SectionHeading>
        {educations.items.map((edu, i) => (
          <EducationForm
            key={i}
            index={i}
            education={edu}
            errors={errors}
            onUpdate={(field, value) => educations.update(i, field, value)}
            onRemove={() => educations.remove(i)}
          />
        ))}
        <button
          type="button"
          onClick={() => educations.add(emptyEdu())}
          className="mt-4 text-sm border border-zinc-400 px-4 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          + Add education
        </button>

        {/* ── Certifications ── */}
        <SectionHeading>Certifications (optional)</SectionHeading>
        {certifications.items.map((cert, i) => (
          <CertificationForm
            key={i}
            index={i}
            certification={cert}
            errors={errors}
            onUpdate={(field, value) => certifications.update(i, field, value)}
            onRemove={() => certifications.remove(i)}
          />
        ))}
        <button
          type="button"
          onClick={() => certifications.add(emptyCert())}
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
