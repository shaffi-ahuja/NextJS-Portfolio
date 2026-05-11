import Image from "next/image";
import Link from "next/link";
import React from "react";

const DefaultProjectIcon = () => (
  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.8}
      stroke="white"
      className="w-10 h-10"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5"
      />
    </svg>
  </div>
);

const ProjectCard = ({
  icon,
  title,
  role,
  description,
  techstack,
  link,
  githubUrl,
}: {
  icon?: string;
  title: string;
  role?: string;
  description: string;
  techstack: string[];
  link?: string;
  githubUrl?: string;
}) => {
  const hasIcon = icon && icon.trim() !== "";
  const hasLink = link && link.trim() !== "";
  const hasGithub = githubUrl && githubUrl.trim() !== "";

  return (
    <div className="project-card-container w-full">
      <div className="flex flex-col h-full">
        {hasIcon ? (
          <Image
            src={icon!}
            alt={title}
            height={80}
            width={80}
            className="rounded-2xl mb-3 object-contain"
          />
        ) : (
          <DefaultProjectIcon />
        )}

        <h2 className="card-title">{title}</h2>
        {role && <p className="text-xs text-zinc-400 mb-2 -mt-1">{role}</p>}

        <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="flex gap-2 flex-wrap grow">
            {techstack.map((skill) => (
              <img
                key={skill}
                className="size-8"
                src={`https://skillicons.dev/icons?i=${skill}`}
                alt={skill}
              />
            ))}
          </div>
          <div className="flex gap-3">
            {hasGithub && (
              <Link
                href={githubUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline text-sm text-zinc-500"
                aria-label={`GitHub repo for ${title}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-4"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
                </svg>
                Code
              </Link>
            )}
            {hasLink && (
              <Link
                href={link!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline text-sm font-medium"
              >
                Live Site
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="orange"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
