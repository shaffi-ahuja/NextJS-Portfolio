"use client";
import React, { useEffect, useState } from "react";

const ToggleButton = () => {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme) setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!theme) return null;

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-current ${
        isDark ? "bg-zinc-500" : "bg-gray-900"
      }`}
    >
      {/* Sun icon — light mode */}
      <span
        className={`absolute left-1 text-yellow-400 text-xs transition-opacity duration-200 ${isDark ? "opacity-0" : "opacity-100"}`}
        aria-hidden="true"
      >
        ☀
      </span>
      {/* Moon icon — dark mode */}
      <span
        className={`absolute right-1 text-blue-200 text-xs transition-opacity duration-200 ${isDark ? "opacity-100" : "opacity-0"}`}
        aria-hidden="true"
      >
        ☾
      </span>
      {/* Thumb */}
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
          isDark ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
};

export default ToggleButton;
