import Footer from "@/components/Footer";
import "../../globals.css";
import Navbar from "@/components/Navbar";
import { getPortfolio } from "@/lib/storage";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

// Legacy static users — same fallback as page.tsx
async function getLegacyUser(id: string) {
  const legacyMap: Record<string, () => Promise<{ default: unknown }>> = {
    nimishmadan: () => import("@/data/NimishMadan"),
    sahilahuja1729: () => import("@/data/SahilAhuja"),
  };
  const loader = legacyMap[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default as any;
}

export default async function UserLayout({ params, children }: Props) {
  const { id } = await params;

  // 1. Try Upstash first (new users from the form)
  let userData: any = await getPortfolio(id);

  // 2. Fall back to legacy static files
  if (!userData) {
    userData = await getLegacyUser(id);
  }

  // 3. If still nothing, render a minimal shell — page.tsx will show notFound()
  if (!userData) {
    return (
      <div className="antialiased text-black bg-white dark:text-white dark:bg-black font-sans">
        {children}
      </div>
    );
  }

  const { Intro, Footer: FooterData } = userData;

  return (
    <div className="antialiased text-black bg-white dark:text-white dark:bg-black font-sans">
      <Navbar data={Intro} resumeSlug={id} />
      {children}
      <Footer data={FooterData} />
    </div>
  );
}
