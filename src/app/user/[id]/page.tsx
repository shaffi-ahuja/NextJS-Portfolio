import { getPortfolio, incrementViews } from "@/lib/storage";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import WorkExperience from "@/components/WorkExperience";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import ContactMe from "@/components/ContactMe";
import BuildPortfolio from "@/components/BuildPortfolio";
import type { Portfolio } from "@/lib/schema";
import { getSectionVisibility } from "@/lib/schema";

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

export default async function UserPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let userData: Portfolio | null = await getPortfolio(id);
  if (!userData) userData = await getLegacyUser(id);
  if (!userData) notFound();

  incrementViews(id).catch(() => {});

  const vis = getSectionVisibility(userData);
  const { Intro, AboutMe, Projects: MyProjects, WorkExperience: MyWork, ContactMe: MyContact } = userData;
  const Education_data   = userData.Education   ?? [];
  const Certs_data       = userData.Certifications ?? [];

  return (
    <>
      {Intro   && <Hero data={Intro} />}
      {AboutMe && <About data={AboutMe} intro={Intro} workExperience={MyWork} />}
      {vis.showProjectsInPortfolio && MyProjects && MyProjects.length > 0 && <Projects data={MyProjects} />}
      {vis.showWorkInPortfolio     && MyWork     && MyWork.length > 0       && <WorkExperience data={MyWork} />}
      {vis.showEducationInPortfolio && Education_data.length > 0            && <Education data={Education_data} />}
      {vis.showCertsInPortfolio    && Certs_data.length > 0                 && <Certifications data={Certs_data} />}
      {vis.showBuildSection        && <BuildPortfolio />}
      {vis.showContactInPortfolio  && MyContact                             && <ContactMe data={MyContact} />}
    </>
  );
}
