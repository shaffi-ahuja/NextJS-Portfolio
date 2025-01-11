import React, { useEffect, useState } from "react";

const ToggleButton = () => {
    const [theme, setTheme] = useState<string>(
        typeof window !== "undefined" && localStorage.theme
            ? localStorage.theme
            : "light"
    );

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

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
