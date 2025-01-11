"use client"

import Link from "next/link";
import React from "react";
import ToggleButton from "../components/ui/ToggleButton";

const Navbar = () => {

    return (
        <nav className="navbar">
            <Link className="nav-logo" href="/">
                Shaffi Ahuja
            </Link>
            <ul className="nav-links">
                <li>
                    <Link href="#home">Home</Link>
                </li>
                <li>
                    <Link href="#AboutMe">About</Link>
                </li>
                <li>
                    <Link href="#Projects">Work</Link>
                </li>
                <li>
                    <Link href="#ContactMe">Contact</Link>
                </li>
            </ul>
            <ToggleButton />

        </nav>
    );
};

export default Navbar;
