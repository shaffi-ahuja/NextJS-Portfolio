"use client"

import React, { useState, useEffect } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="flex gap-2 flex-2 sm:h-15 py-5 bg-black sticky top-0 xs:px-[35%] sm:px-8 lg:px-32">
            <div className="sm:text-2xl font-bold text-xl">
                Shaffi Ahuja
            </div>
            <ul className="sm:flex gap-5 grow justify-end text-lg text-zinc-400 hidden">
                <li className="cursor-pointer">
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="#AboutMe">About</a>
                </li>
                <li>
                    <a href="#Projects">Work</a>
                </li>
                <li>
                    <a href="#ContactMe">Contact Me</a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
