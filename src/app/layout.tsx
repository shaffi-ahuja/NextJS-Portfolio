import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shaffi Ahuja — Frontend Developer",
  description: "Senior Frontend Developer with 5+ years experience in React, Next.js and TypeScript.",
};

// Root layout — minimal shell only. 
// Navbar/Footer are added by each sub-layout:
//   src/app/(main)/layout.tsx  → main portfolio (Shaffi's)
//   src/app/user/[id]/layout.tsx → user portfolios
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-black bg-white dark:text-white dark:bg-black font-sans">
        {children}
      </body>
    </html>
  );
}
