// RSC — data fetching happens at build/request time
import About from "@/components/About";
import BuildPortfolio from "@/components/BuildPortfolio";
import ContactMe from "@/components/ContactMe";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import WorkExperience from "@/components/WorkExperience";
import ShaffiAhuja from "@/data/ShaffiAhuja";

export default function Home() {
  const features = ShaffiAhuja.features ?? {
    showProjects: true,
    showWorkExperience: true,
    showContact: true,
    showBuildSection: true,
  };

  return (
    <>
      <Hero data={ShaffiAhuja.Intro} />
      <About
        data={ShaffiAhuja.AboutMe}
        intro={ShaffiAhuja.Intro}
        workExperience={ShaffiAhuja.WorkExperience}
      />
      {features.showProjects && ShaffiAhuja.Projects && (
        <Projects data={ShaffiAhuja.Projects} />
      )}
      {features.showWorkExperience && (
        <WorkExperience data={ShaffiAhuja.WorkExperience} />
      )}
      {features.showBuildSection && <BuildPortfolio />}
      {features.showContact && <ContactMe data={ShaffiAhuja.ContactMe} />}
    </>
  );
}
