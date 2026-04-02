"use client"

import Link from "next/link";
import React, { useState } from "react";
import ToggleButton from "../components/ui/ToggleButton";

const Navbar = ({ data }: { data: any }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "#home", label: "Home" },
    { href: "#AboutMe", label: "About" },
    { href: "#Projects", label: "Work" },
    { href: "#ContactMe", label: "Contact" },
  ];

  return (
    <nav className="navbar relative">
      {/* Logo */}
      <Link className="nav-logo" href="/">
        {data?.FirstName}{data?.LastName}
      </Link>

      {/* Desktop links */}
      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-black dark:hover:text-white transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 ml-auto sm:ml-0">
        <ToggleButton />

        {/* Hamburger — mobile only */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-transform duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-opacity duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-transform duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <ul className="sm:hidden absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 flex flex-col z-50">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block px-8 py-4 text-lg text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
