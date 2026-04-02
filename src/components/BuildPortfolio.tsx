"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import profile1 from "../../public/profile1.png";
import profile2 from "../../public/profile2.png";

type UserPreview = {
  slug: string;
  firstName: string;
  lastName: string;
  oneLinerIntro: string;
  profileImage?: string;
};

// Legacy hardcoded users always shown
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

// Avatar with initials fallback for dynamic users
function InitialAvatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const colors = [
    "bg-blue-500", "bg-purple-500", "bg-green-500",
    "bg-orange-500", "bg-pink-500", "bg-teal-500",
  ];
  // Pick a consistent color based on name
  const colorIndex = (firstName.charCodeAt(0) + lastName.charCodeAt(0)) % colors.length;

  return (
    <div className={`size-16 rounded-full ${colors[colorIndex]} flex items-center justify-center text-white text-xl font-bold`}>
      {initials}
    </div>
  );
}

const BuildPortfolio = () => {
  const [dynamicUsers, setDynamicUsers] = useState<UserPreview[]>([]);

  useEffect(() => {
    fetch('/api/portfolio/list')
      .then((r) => r.json())
      .then((data) => setDynamicUsers(data.slugs ?? []))
      .catch(() => {}); // fail silently — legacy users still show
  }, []);

  return (
    <section className='section-container py-20 text-center'>
      <h1 className='text-2xl font-bold mb-3'>
        Your portfolio, your style — live in minutes.
      </h1>
      <p className='text-lg text-zinc-500 mb-6'>
        Fill in a form, pick your theme, and get a fully deployed portfolio at your own URL. No code needed.
      </p>

      <Link
        href="/user/create"
        className='hero-section-button inline-flex mb-10'
      >
        Build My Portfolio
      </Link>

      <p className='text-zinc-500 mb-6'>See what others have built</p>

      <div className='flex flex-wrap gap-6 justify-center'>
        {/* Legacy users with real profile images */}
        {LEGACY_USERS.map((user) => (
          <Link
            key={user.slug}
            href={user.href}
            target="_blank"
            className='flex flex-col items-center gap-2 hover:opacity-80 transition-opacity'
          >
            <Image
              src={user.image}
              alt={user.name}
              className='size-16 rounded-full object-cover'
              width={64}
              height={64}
            />
            <span className='text-sm font-medium'>{user.name}</span>
          </Link>
        ))}

        {/* Dynamically created users — shown with initials avatar */}
        {dynamicUsers.map((user) => (
          <Link
            key={user.slug}
            href={`/user/${user.slug}`}
            className='flex flex-col items-center gap-2 hover:opacity-80 transition-opacity'
          >
            {user.profileImage && user.profileImage.trim() !== '' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.profileImage}
                alt={`${user.firstName} ${user.lastName}`}
                className='size-16 rounded-full object-cover'
              />
            ) : (
              <InitialAvatar firstName={user.firstName} lastName={user.lastName} />
            )}
            <span className='text-sm font-medium'>
              {user.firstName} {user.lastName}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BuildPortfolio;
