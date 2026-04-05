import About from "@/components/About";
import BuildPortfolio from "@/components/BuildPortfolio";
import ContactMe from "@/components/ContactMe";
import Education from "@/components/Education";
import Certifications from "@/components/Certifications";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import WorkExperience from "@/components/WorkExperience";
import ShaffiAhuja from "@/data/ShaffiAhuja";
import { getSectionVisibility } from "@/lib/schema";

export default function Home() {
  const vis = getSectionVisibility(ShaffiAhuja as any);

  return (
    <>
      <Hero data={ShaffiAhuja.Intro} />
      <About data={ShaffiAhuja.AboutMe as any} intro={ShaffiAhuja.Intro} workExperience={ShaffiAhuja.WorkExperience} />
      {vis.showProjectsInPortfolio && ShaffiAhuja.Projects && <Projects data={ShaffiAhuja.Projects} />}
      {vis.showWorkInPortfolio && <WorkExperience data={ShaffiAhuja.WorkExperience} />}
      {vis.showEducationInPortfolio && <Education data={ShaffiAhuja.Education} />}
      {vis.showCertsInPortfolio && <Certifications data={ShaffiAhuja.Certifications} />}
      {vis.showBuildSection && <BuildPortfolio />}
      {vis.showContactInPortfolio && <ContactMe data={ShaffiAhuja.ContactMe} />}
    </>
  );
}
