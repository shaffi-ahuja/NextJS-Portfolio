import React, { useState } from "react";

const MultiSelect = ({ options }: { options: string[] }) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionClick = (option: string) => {
        if (selectedOptions.includes(option)) {
            setSelectedOptions(selectedOptions.filter((item) => item !== option));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
    };

    return (
        <div className="relative w-full">
            <div
                onClick={toggleDropdown}
                className="border border-zinc-700 rounded-lg px-4 py-4 cursor-pointer bg-zinc-900 flex justify-between items-center capitalize"
            >
                <span>
                    {selectedOptions.length > 0
                        ? selectedOptions.join(", ")
                        : "Select options"}
                </span>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : "rotate-0"
                        }`}
                    xmlns="http://www.w3.org/2000/svg"
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

            {isOpen && (
                <ul className="absolute mt-1 border border-zinc-700 bg-zinc-900 rounded-lg shadow-lg max-h-40 overflow-y-auto w-full">
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            className={`px-4 py-4 cursor-pointer hover:bg-zinc-500 capitalize ${selectedOptions.includes(option) ? "bg-zinc-700" : ""
                                }`}
                        >
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option)}
                                onChange={() => handleOptionClick(option)}
                                className="mr-2"
                            />
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MultiSelect;
