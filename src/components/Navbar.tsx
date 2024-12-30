"use client"

import React, { useState, useEffect } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="flex gap-2 flex-2 h-15 py-5 px-32 bg-black sticky top-0 opacity-90">
            <div className="text-2xl font-bold">
                Shaffi Ahuja
            </div>
            <ul className="flex gap-5 grow justify-end text-lg text-zinc-400 ">
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
                    <a href="/">Contact Me</a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
