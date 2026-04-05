// RSC — fetches data server-side, schema-driven layout
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

  let userData: Portfolio | null = await getPortfolio(id);
  if (!userData) userData = await getLegacyUser(id);
  if (!userData) notFound();

  incrementViews(id).catch(() => {});

  const features = userData.features ?? {
    showProjects: true,
    showWorkExperience: true,
    showContact: true,
    showBuildSection: false,
  };

  const { Intro, AboutMe, Projects: MyProjects, WorkExperience: MyWork, ContactMe: MyContact } = userData;

  return (
    <>
      {Intro && <Hero data={Intro} />}
      {AboutMe && (
        <About
          data={AboutMe}
          intro={Intro}
          workExperience={MyWork}
        />
      )}
      {features.showProjects && MyProjects && MyProjects.length > 0 && (
        <Projects data={MyProjects} />
      )}
      {features.showWorkExperience && MyWork && MyWork.length > 0 && (
        <WorkExperience data={MyWork} />
      )}
      {features.showBuildSection && <BuildPortfolio />}
      {features.showContact && MyContact && <ContactMe data={MyContact} />}
    </>
  );
}
