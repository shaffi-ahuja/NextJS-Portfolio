'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import ToggleButton from './ui/ToggleButton';
import DownloadResumeButton from './DownloadResumeButton';

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#AboutMe', label: 'About' },
  { href: '#Projects', label: 'Work' },
  { href: '#ContactMe', label: 'Contact' },
];

export default function Navbar({ data, resumeSlug }: { data: any; resumeSlug?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <nav
      className={`navbar relative transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <Link className="nav-logo transition-opacity hover:opacity-70" href="/" aria-label="Home">
        {data?.FirstName}{data?.LastName}
      </Link>

      {/* Desktop links */}
      <ul className="nav-links" role="list">
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="hover:text-black dark:hover:text-white transition-colors duration-150 relative group"
            >
              {l.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-current transition-all duration-200 group-hover:w-full" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 ml-auto sm:ml-0">
        {/* Download resume button — desktop only */}
        {resumeSlug && (
          <div className="hidden sm:block">
            <DownloadResumeButton slug={resumeSlug} />
          </div>
        )}
        <ToggleButton />

        {/* Hamburger — mobile only */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-1 rounded focus-visible:ring-2 focus-visible:ring-current"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      <ul
        id="mobile-menu"
        role="list"
        aria-label="Mobile navigation"
        className={`sm:hidden absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 flex flex-col z-50 transition-all duration-200 overflow-hidden ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        {NAV_LINKS.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block px-8 py-4 text-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border-b border-zinc-100 dark:border-zinc-800 last:border-0 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          </li>
        ))}
        {/* Download button in mobile menu too */}
        {resumeSlug && (
          <li className="px-8 py-4 border-b border-zinc-100 dark:border-zinc-800">
            <DownloadResumeButton slug={resumeSlug} />
          </li>
        )}
      </ul>
    </nav>
  );
}
