"use client"

import Link from "next/link";
import React, { useState, useEffect } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="flex gap-2 flex-2 sm:h-15 py-5 sticky top-0 xs:justify-center sm:px-8 lg:px-32 bg-black z-10">
            <Link className="sm:text-2xl font-bold text-xl" href="/">
                Shaffi Ahuja
            </Link>
            <ul className="sm:flex gap-5 grow justify-end text-lg text-zinc-400 hidden">
                <li className="cursor-pointer">
                    <Link href="#home">Home</Link>
                </li>
                <li>
                    <Link href="#AboutMe">About</Link>
                </li>
                <li>
                    <Link href="#Projects">Work</Link>
                </li>
                <li>
                    <Link href="#ContactMe">Contact Me</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
