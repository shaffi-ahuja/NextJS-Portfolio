import "./globals.css";
import type { Metadata } from "next";
import ShaffiAhuja from "@/data/ShaffiAhuja";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shaffi Ahuja — Frontend Developer",
  description: "Senior Frontend Developer with 5+ years experience in React, Next.js and TypeScript.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-black bg-white dark:text-white dark:bg-black font-sans">
        <Navbar data={ShaffiAhuja.Intro} />
        {children}
        <Footer data={ShaffiAhuja.Footer} />
      </body>
    </html>
  );
}
