/**
 * Reusable form components extracted from UserForm
 */
import React, { useState, memo } from "react";
import { SKILLS } from "@/lib/schema";

interface FieldErrorProps {
  msg?: string;
}

export const FieldError = memo(function FieldError({ msg }: FieldErrorProps) {
  if (!msg) return null;
  return <p className="text-red-500 text-sm mt-1">{msg}</p>;
});

interface SectionHeadingProps {
  children: React.ReactNode;
}

export const SectionHeading = memo(function SectionHeading({
  children,
}: SectionHeadingProps) {
  return (
    <h3 className="text-lg font-semibold mt-8 mb-2 border-b border-zinc-300 dark:border-zinc-700 pb-2">
      {children}
    </h3>
  );
});

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export const Toggle = memo(function Toggle({
  checked,
  onChange,
  label,
}: ToggleProps) {
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

type SlugStatus = "idle" | "checking" | "available" | "taken" | "invalid";

interface SlugIndicatorProps {
  status: SlugStatus;
}

export const SlugIndicator = memo(function SlugIndicator({
  status,
}: SlugIndicatorProps) {
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
});

interface SkillMultiSelectProps {
  selected: string[];
  onChange: (s: string[]) => void;
}

export const SkillMultiSelect = memo(function SkillMultiSelect({
  selected,
  onChange,
}: SkillMultiSelectProps) {
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
          className={`w-5 h-5 flex-shrink-0 ml-2 transition-transform ${
            open ? "rotate-180" : ""
          }`}
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
              className={`px-4 py-3 cursor-pointer capitalize flex items-center gap-2 dark:hover:bg-zinc-700 hover:bg-zinc-300 ${
                selected.includes(skill) ? "dark:bg-zinc-700 bg-zinc-300" : ""
              }`}
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
});
