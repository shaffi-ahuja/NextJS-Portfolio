/**
 * Extracted form section components to reduce main component size
 * and allow for independent memoization
 */
import React, { memo } from "react";
import { MONTHS } from "@/lib/schema";
import AIAssistButton from "./ui/AIAssistButton";
import { SkillMultiSelect } from "./FormComponents";
import type {
  Project,
  WorkExperienceSchema,
  EducationSchema,
  CertificationSchema,
} from "@/lib/schema";
import { z } from "zod";

type WorkExperience = z.infer<typeof WorkExperienceSchema>;
type Education = z.infer<typeof EducationSchema>;
type Certification = z.infer<typeof CertificationSchema>;

interface FormErrors {
  [key: string]: string;
}

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

const Toggle = memo(function Toggle({ checked, onChange, label }: ToggleProps) {
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
});

const FieldError = memo(function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 text-sm mt-1">{msg}</p>;
});

// ─── ProjectForm ───────────────────────────────────────────────────────────

interface ProjectFormProps {
  index: number;
  project: Project;
  errors: FormErrors;
  isStreaming: boolean;
  streamValue: string;
  onUpdate: (field: keyof Project, value: unknown) => void;
  onRemove: () => void;
  onStream: (text: string) => void;
  canRemove: boolean;
}

export const ProjectForm = memo(function ProjectForm({
  index,
  project,
  errors,
  isStreaming,
  streamValue,
  onUpdate,
  onRemove,
  onStream,
  canRemove,
}: ProjectFormProps) {
  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded-md p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">Project {index + 1}</p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
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
          onChange={(e) => onUpdate("title", e.target.value)}
          placeholder="Portfolio Builder — Multi-Tenant SaaS"
        />
      </div>
      <div className="input-div">
        <label>
          Your role{" "}
          <span className="text-zinc-500 font-normal text-sm">(optional)</span>
        </label>
        <input
          className="input"
          value={project.role ?? ""}
          onChange={(e) => onUpdate("role", e.target.value)}
          placeholder="Solo Developer / Frontend Lead"
        />
      </div>
      <div className="input-div">
        <label>Description</label>
        <textarea
          className="input"
          rows={4}
          value={isStreaming ? streamValue + "▌" : project.description}
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="What did you build and why does it matter..."
          disabled={isStreaming}
        />
        <AIAssistButton
          label={isStreaming ? "Writing..." : "Improve this description"}
          disabled={!project.description.trim() || isStreaming}
          onResult={(text) => {
            onUpdate("description", text);
            onStream(text);
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
          onChange={(s) => onUpdate("techstack", s)}
        />
      </div>
      <div className="input-div">
        <label>Live URL</label>
        <input
          className="input"
          value={project.link}
          onChange={(e) => onUpdate("link", e.target.value)}
          placeholder="https://yourproject.vercel.app"
        />
      </div>
      <div className="input-div">
        <label>
          GitHub URL{" "}
          <span className="text-zinc-500 font-normal text-sm">(optional)</span>
        </label>
        <input
          className="input"
          value={project.githubUrl ?? ""}
          onChange={(e) => onUpdate("githubUrl", e.target.value)}
          placeholder="https://github.com/yourname/project"
        />
      </div>
    </div>
  );
});

// ─── WorkForm ───────────────────────────────────────────────────────────────

interface WorkFormProps {
  index: number;
  work: WorkExperience;
  errors: FormErrors;
  isStreaming: boolean;
  streamValue: string;
  onUpdate: (field: keyof WorkExperience, value: unknown) => void;
  onRemove: () => void;
  onStream: (text: string) => void;
  onToggleCurrentJob: () => void;
  canRemove: boolean;
}

export const WorkForm = memo(function WorkForm({
  index,
  work,
  errors,
  isStreaming,
  streamValue,
  onUpdate,
  onRemove,
  onStream,
  onToggleCurrentJob,
  canRemove,
}: WorkFormProps) {
  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded-md p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">Position {index + 1}</p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
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
          onChange={(e) => onUpdate("company", e.target.value)}
          placeholder="Publicis Re:Sources"
          data-error={!!errors[`work_company_${index}`]}
        />
        <FieldError msg={errors[`work_company_${index}`]} />
      </div>
      <div className="input-div">
        <label>Job title *</label>
        <input
          className="input"
          value={work.title}
          onChange={(e) => onUpdate("title", e.target.value)}
          placeholder="Senior Frontend Engineer"
          data-error={!!errors[`work_title_${index}`]}
        />
        <FieldError msg={errors[`work_title_${index}`]} />
      </div>
      <div className="input-div">
        <label>
          Location{" "}
          <span className="text-zinc-500 font-normal text-sm">(optional)</span>
        </label>
        <input
          className="input"
          value={work.location ?? ""}
          onChange={(e) => onUpdate("location", e.target.value)}
          placeholder="Gurugram, India / Remote"
        />
      </div>
      <div className="input-div">
        <label>Start date *</label>
        <div className="flex gap-3 mt-3">
          <select
            className="input flex-1"
            value={work.startMonth}
            onChange={(e) => onUpdate("startMonth", e.target.value)}
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
            onChange={(e) => onUpdate("startYear", e.target.value)}
            placeholder="2022"
            aria-label="Start year"
            data-error={!!errors[`work_start_${index}`]}
          />
        </div>
        <FieldError msg={errors[`work_start_${index}`]} />
      </div>
      <div className="input-div">
        <div className="flex items-center justify-between mt-3">
          <label className="text-sm font-medium">I currently work here</label>
          <Toggle
            checked={work.isCurrentJob}
            onChange={onToggleCurrentJob}
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
              onChange={(e) => onUpdate("endMonth", e.target.value)}
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
              onChange={(e) => onUpdate("endYear", e.target.value)}
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
          onChange={(e) => onUpdate("description", e.target.value)}
          placeholder="Lead with impact — what did you build, improve, or ship?"
          data-error={!!errors[`work_desc_${index}`]}
          disabled={isStreaming}
        />
        <AIAssistButton
          label={isStreaming ? "Writing..." : "Improve this description"}
          disabled={!work.description.trim() || isStreaming}
          onResult={(text) => {
            onUpdate("description", text);
            onStream(text);
          }}
          buildRequest={() => ({
            action: "improve_description",
            text: work.description,
            context: `${work.title} at ${work.company}`,
          })}
        />
        <FieldError msg={errors[`work_desc_${index}`]} />
      </div>
    </div>
  );
});

interface EducationFormProps {
  index: number;
  education: Education;
  errors: FormErrors;
  onUpdate: (field: keyof Education, value: unknown) => void;
  onRemove: () => void;
}

export const EducationForm = memo(function EducationForm({
  index,
  education,
  errors,
  onUpdate,
  onRemove,
}: EducationFormProps) {
  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded-md p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">Education {index + 1}</p>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 text-sm hover:underline"
        >
          Remove
        </button>
      </div>
      <div className="input-div">
        <label>Type</label>
        <select
          className="input"
          value={education.type}
          onChange={(e) => onUpdate("type", e.target.value)}
        >
          <option value="degree">Degree (B.Tech / B.Sc / MBA etc.)</option>
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
          value={education.institutionName}
          onChange={(e) => onUpdate("institutionName", e.target.value)}
          placeholder="IIT Delhi / Your School Name"
          data-error={!!errors[`edu_name_${index}`]}
        />
        <FieldError msg={errors[`edu_name_${index}`]} />
      </div>
      <div className="input-div">
        <label>Field of study / Degree name</label>
        <input
          className="input"
          value={education.fieldOfStudy}
          onChange={(e) => onUpdate("fieldOfStudy", e.target.value)}
          placeholder="Bachelor of Technology — Computer Science"
        />
      </div>
      <div className="input-div">
        <label>Years</label>
        <div className="flex gap-3 mt-3">
          <input
            className="input flex-1"
            value={education.startYear}
            onChange={(e) => onUpdate("startYear", e.target.value)}
            placeholder="2015"
            aria-label="Start year"
          />
          <input
            className="input flex-1"
            value={education.endYear}
            onChange={(e) => onUpdate("endYear", e.target.value)}
            placeholder="2019"
            aria-label="End year"
          />
        </div>
      </div>
      <div className="input-div">
        <label>Grade / CGPA / Percentage</label>
        <input
          className="input"
          value={education.grade}
          onChange={(e) => onUpdate("grade", e.target.value)}
          placeholder="8.5 CGPA / 85%"
        />
      </div>
      <div className="input-div">
        <label>Location</label>
        <input
          className="input"
          value={education.location}
          onChange={(e) => onUpdate("location", e.target.value)}
          placeholder="New Delhi, India"
        />
      </div>
    </div>
  );
});

interface CertificationFormProps {
  index: number;
  certification: Certification;
  errors: FormErrors;
  onUpdate: (field: keyof Certification, value: unknown) => void;
  onRemove: () => void;
}

export const CertificationForm = memo(function CertificationForm({
  index,
  certification,
  errors,
  onUpdate,
  onRemove,
}: CertificationFormProps) {
  return (
    <div className="border border-zinc-300 dark:border-zinc-700 rounded-md p-4 mt-4">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">Certification {index + 1}</p>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 text-sm hover:underline"
        >
          Remove
        </button>
      </div>
      <div className="input-div">
        <label>Certification name *</label>
        <input
          className="input"
          value={certification.name}
          onChange={(e) => onUpdate("name", e.target.value)}
          placeholder="React — The Complete Guide"
          data-error={!!errors[`cert_name_${index}`]}
        />
        <FieldError msg={errors[`cert_name_${index}`]} />
      </div>
      <div className="input-div">
        <label>Issuing organization *</label>
        <input
          className="input"
          value={certification.organization}
          onChange={(e) => onUpdate("organization", e.target.value)}
          placeholder="Udemy / Coursera / Google"
          data-error={!!errors[`cert_org_${index}`]}
        />
        <FieldError msg={errors[`cert_org_${index}`]} />
      </div>
      <div className="input-div">
        <label>Date</label>
        <input
          className="input"
          value={certification.date}
          onChange={(e) => onUpdate("date", e.target.value)}
          placeholder="2023"
        />
      </div>
      <div className="input-div">
        <label>Credential URL</label>
        <input
          className="input"
          value={certification.credentialUrl}
          onChange={(e) => onUpdate("credentialUrl", e.target.value)}
          placeholder="https://coursera.org/verify/..."
        />
      </div>
    </div>
  );
});
