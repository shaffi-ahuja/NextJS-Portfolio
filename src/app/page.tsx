import AboutMe from "@/components/AboutMe";
import ContactMe from "@/components/ContactMe";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import WorkExperience from "@/components/WorkExperience";

export default function Home() {
  return (
    <>
      <Hero />
      <AboutMe />
      <Projects />
      <WorkExperience />
      <ContactMe />
    </>
  );
}
