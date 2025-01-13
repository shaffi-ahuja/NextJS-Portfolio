"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShaffiAhuja } from "@/data/ShaffiAhuja";
import { usePathname } from "next/navigation";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    console.log("pathname", pathname)
    // Exclude paths where the footer shouldn't appear
    const excludePaths = ["/user/"];
    return (
        <html lang="en">
            <body
                className={`antialiased text-black bg-white dark:text-white dark:bg-black font-sans`}
            >
                {!excludePaths.some((path) => pathname?.startsWith(path)) && <Navbar data={ShaffiAhuja.Intro} />}
                {children}
                {!excludePaths.some((path) => pathname?.startsWith(path)) && <Footer data={ShaffiAhuja.Footer} />}
            </body>
        </html>
    );
}
