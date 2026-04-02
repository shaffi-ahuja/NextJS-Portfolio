import { getPortfolio, incrementViews } from "@/lib/storage";
import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import WorkExperience from "@/components/WorkExperience";
import ContactMe from "@/components/ContactMe";

async function getLegacyUser(id: string) {
  const legacyMap: Record<string, () => Promise<{ default: unknown }>> = {
    nimishmadan: () => import("@/data/NimishMadan"),
    sahilahuja1729: () => import("@/data/SahilAhuja"),
  };
  const loader = legacyMap[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserPortfolioPage({ params }: Props) {
  const { id } = await params;

  let userData = await getPortfolio(id);
  if (!userData) userData = (await getLegacyUser(id)) as typeof userData;
  if (!userData) notFound();

  incrementViews(id).catch(() => {});

  const { Intro, AboutMe, Projects: MyProjects, WorkExperience: MyWorkExperience, ContactMe: Contactme } = userData;

  return (
    <>
      {Intro && <Hero data={Intro} />}
      {AboutMe && <About data={AboutMe} intro={Intro} />}
      {MyProjects && MyProjects.length > 0 && <Projects data={MyProjects} />}
      {MyWorkExperience && <WorkExperience data={MyWorkExperience} />}
      {Contactme && <ContactMe data={Contactme} />}
    </>
  );
}
