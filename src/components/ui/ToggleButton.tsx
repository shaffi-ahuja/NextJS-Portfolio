'use client';

import React, { useEffect, useState } from "react";

const ToggleButton = () => {
    const [theme, setTheme] = useState<string | null>(null);

    // Sync theme with localStorage or set default
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
        if (theme) {
            setTheme(theme === "dark" ? "light" : "dark");
        }
    };

    // Render nothing until theme is initialized
    if (!theme) return null;

    return (
        <div className="flex items-center space-x-3">
            <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${theme === "dark" ? "bg-zinc-500" : "bg-gray-900"
                    }`}
            >
                <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${theme === "dark" ? "translate-x-6" : "translate-x-1"
                        }`}
                ></span>
            </button>
        </div>
    );
};

export default ToggleButton;
