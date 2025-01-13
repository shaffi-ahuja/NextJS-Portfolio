import React, { useState } from "react";

const MultiSelect = ({ options, id }: { options: string[], id: string }) => {
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
        <div className="relative w-full" id={id}>
            <div
                onClick={toggleDropdown}
                className="input flex justify-between items-center capitalize"
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
                <ul className="input rounded-lg shadow-lg max-h-40 overflow-y-auto w-full">
                    {options.map((option) => (
                        <li
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            className={`px-4 py-4 cursor-pointer dark:hover:bg-zinc-500 hover:bg-gray-300 capitalize ${selectedOptions.includes(option) ? "dark:bg-zinc-700 bg-gray-400" : ""
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
