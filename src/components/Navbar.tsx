"use client"

import React, { useState, useEffect } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="flex gap-2 flex-2 h-15 p-10   bg-black">
            <div className="text-2xl">
                Shaffi Ahuja
            </div>
            <ul className="flex gap-10 grow justify-end text-xl">
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
