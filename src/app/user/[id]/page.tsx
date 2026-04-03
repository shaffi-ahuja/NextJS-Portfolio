// RSC — fetches data server-side, renders schema-driven layout
import { getPortfolio, incrementViews } from "@/lib/storage";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import WorkExperience from "@/components/WorkExperience";
import ContactMe from "@/components/ContactMe";
import BuildPortfolio from "@/components/BuildPortfolio";
import type { Portfolio } from "@/lib/schema";

async function getLegacyUser(id: string): Promise<Portfolio | null> {
  const legacyMap: Record<string, () => Promise<{ default: unknown }>> = {
    nimishmadan: () => import("@/data/NimishMadan"),
    sahilahuja1729: () => import("@/data/SahilAhuja"),
  };
  const loader = legacyMap[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default as Portfolio;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserPortfolioPage({ params }: Props) {
  const { id } = await params;

  // 1. Upstash first (form users)
  let userData: Portfolio | null = await getPortfolio(id);
  // 2. Legacy static fallback
  if (!userData) userData = await getLegacyUser(id);
  // 3. 404
  if (!userData) notFound();

  // Track views — fire and forget
  incrementViews(id).catch(() => {});

  // Feature flags — default all true for legacy users without flags
  const features = userData.features ?? {
    showProjects: true,
    showWorkExperience: true,
    showContact: true,
    showBuildSection: false, // don't show "build your own" on user portfolios by default
  };

  const { Intro, AboutMe, Projects: MyProjects, WorkExperience: MyWork, ContactMe: MyContact } = userData;

  return (
    <>
      {Intro && <Hero data={Intro} />}
      {AboutMe && <About data={AboutMe} intro={Intro} />}
      {features.showProjects && MyProjects && MyProjects.length > 0 && (
        <Projects data={MyProjects} />
      )}
      {features.showWorkExperience && MyWork && MyWork.length > 0 && (
        <WorkExperience data={MyWork} />
      )}
      {features.showBuildSection && <BuildPortfolio />}
      {features.showContact && MyContact && (
        <ContactMe data={MyContact} />
      )}
    </>
  );
}
