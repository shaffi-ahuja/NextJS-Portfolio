import React from "react";
import Image from "next/image";

const WorkCard = ({
  image,
  company,
  title,
  // Legacy field — existing static users (ShaffiAhuja, NimishMadan, SahilAhuja)
  duration,
  // New fields — form-created users
  startMonth,
  startYear,
  endMonth,
  endYear,
  isCurrentJob,
  description,
}: {
  image?: string;
  company: string;
  title: string;
  duration?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  isCurrentJob?: boolean;
  description: string;
}) => {
  const hasImage = image && image.trim() !== "";

  // Build duration display string
  let durationDisplay = "";
  if (startYear) {
    const start = [startMonth, startYear].filter(Boolean).join(" ");
    const end = isCurrentJob
      ? "Present"
      : [endMonth, endYear].filter(Boolean).join(" ") || "Present";
    durationDisplay = `${start} — ${end}`;
  } else if (duration) {
    durationDisplay = duration;
  }

  return (
    <div className="flex flex-row gap-3 mb-8">
      {/* Company logo or initial fallback */}
      <div className="company-logo flex-shrink-0">
        {hasImage ? (
          <Image
            src={image!}
            alt={`${company} logo`}
            width={40}
            height={40}
            className="rounded-md object-contain"
          />
        ) : (
          <div
            className="w-[40px] h-[40px] rounded-md bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-300"
            aria-hidden="true"
          >
            {company.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="basis-11/12">
        <p className="text-xl font-semibold">{company}</p>
        <p className="text-sm text-zinc-500 mt-0.5">
          <span className="uppercase tracking-wide">{title}</span>
          {durationDisplay && (
            <>
              <span
                className="mx-2 text-zinc-300 dark:text-zinc-600"
                aria-hidden="true"
              >
                ·
              </span>
              <span className="font-medium text-zinc-400">
                {durationDisplay}
              </span>
            </>
          )}
          {isCurrentJob && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Current
            </span>
          )}
        </p>
        <ul className="work-exp-desc-list ml-4 mt-2">
          {description
            .split("\n")
            .filter(Boolean)
            .map((pointer, i) => (
              <li key={i} className="mb-1">
                {pointer}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkCard;
