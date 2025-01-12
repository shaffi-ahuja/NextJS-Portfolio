import About from "@/components/About";
import BuildPortfolio from "@/components/BuildPortfolio";
import ContactMe from "@/components/ContactMe";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import WorkExperience from "@/components/WorkExperience";
import { ShaffiAhuja } from "@/data/ShaffiAhuja";
export default function Home() {
  return (
    <>
      <Hero data={ShaffiAhuja.Intro} />
      <About data={ShaffiAhuja.AboutMe} />
      <Projects data={ShaffiAhuja.Projects} />
      <WorkExperience data={ShaffiAhuja.WorkExperience} />
      <BuildPortfolio />
      <ContactMe data={ShaffiAhuja.ContactMe} />
    </>
  );
}
