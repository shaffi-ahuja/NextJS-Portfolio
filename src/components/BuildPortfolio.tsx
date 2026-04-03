"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import profile1 from "../../public/profile1.png";
import profile2 from "../../public/profile2.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type UserPreview = {
  slug: string;
  firstName: string;
  lastName: string;
  oneLinerIntro: string;
  profileImage?: string;
  name?: string;
};

const STAGGER_DELAYS = [
  "delay-0",
  "delay-75",
  "delay-100",
  "delay-150",
  "delay-200",
  "delay-300",
  "delay-500",
  "delay-700",
];
const LEGACY_USERS = [
  {
    slug: "sahilahuja1729",
    href: "https://my-digitall-portfolio.vercel.app/user/sahilahuja1729",
    image: profile2,
    name: "Sahil Ahuja",
  },
  {
    slug: "nimishmadan",
    href: "https://my-digitall-portfolio.vercel.app/user/nimishmadan",
    image: profile1,
    name: "Nimish Madan",
  },
];

function InitialAvatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-teal-500",
  ];
  const colorIndex =
    (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length;
  return (
    <div
      className={`size-16 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-xl font-bold`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export default function BuildPortfolio() {
  const [dynamicUsers, setDynamicUsers] = useState<UserPreview[]>([]);
  const { ref, visible } = useScrollAnimation();

  useEffect(() => {
    fetch("/api/portfolio/list")
      .then((r) => r.json())
      .then((data) => setDynamicUsers(data.slugs ?? []))
      .catch(() => {});
  }, []);

  const allUsers: any = [
    ...LEGACY_USERS,
    ...dynamicUsers.map((u) => ({
      slug: u.slug,
      href: `/user/${u.slug}`,
      image: null,
      name: `${u.firstName} ${u.lastName}`,
      profileImage: u.profileImage,
      firstName: u.firstName,
      lastName: u.lastName,
    })),
  ];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`section-container py-20 text-center transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      aria-labelledby="build-portfolio-heading"
    >
      <h2 id="build-portfolio-heading" className="text-2xl font-bold mb-3">
        Your portfolio, your style — live in minutes.
      </h2>
      <p className="text-lg text-zinc-500 mb-6">
        Fill in a form, pick your theme, and get a fully deployed portfolio at
        your own URL. No code needed.
      </p>

      <Link
        href="/user/create"
        className="hero-section-button inline-flex mb-10"
        aria-label="Create your portfolio"
      >
        Build My Portfolio
      </Link>

      <p className="text-zinc-500 mb-6">See what others have built</p>

      <div
        className="flex flex-wrap gap-6 justify-center"
        role="list"
        aria-label="Portfolios built by others"
      >
        {allUsers.map((user: any, i: number) => (
          <Link
            key={user.slug}
            href={user.href}
            target={user.href.startsWith("http") ? "_blank" : undefined}
            rel={
              user.href.startsWith("http") ? "noopener noreferrer" : undefined
            }
            role="listitem"
            aria-label={`View ${user.name}'s portfolio`}
            className={`flex flex-col items-center gap-2 transition-all duration-500 ease-out hover:scale-105 ${
              STAGGER_DELAYS[i] ?? "delay-700"
            } ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
          >
            {"image" in user && user.image && !("profileImage" in user) ? (
              <Image
                src={user.image}
                alt={`${user.name}'s profile photo`}
                className="size-16 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                width={64}
                height={64}
              />
            ) : "profileImage" in user && user.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImage}
                alt={`${user.name}'s profile photo`}
                className="size-16 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
              />
            ) : "image" in user && user.image ? (
              <Image
                src={user.image}
                alt={`${user.name}'s profile photo`}
                className="size-16 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-700"
                width={64}
                height={64}
              />
            ) : (
              <InitialAvatar
                firstName={
                  "firstName" in user ? user.firstName : user.name.split(" ")[0]
                }
                lastName={
                  "lastName" in user
                    ? user.lastName
                    : (user.name.split(" ")[1] ?? "")
                }
              />
            )}
            <span className="text-sm font-medium">{user.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
