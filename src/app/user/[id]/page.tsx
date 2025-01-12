import About from "@/components/About";
import BuildPortfolio from "@/components/BuildPortfolio";
import ContactMe from "@/components/ContactMe";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import WorkExperience from "@/components/WorkExperience";
import { NimishMadan } from "@/data/NimishMadan";
export default function UserHome() {
    return (
        <>
            <Hero data={NimishMadan.Intro} />
            <About data={NimishMadan.AboutMe} />
            <Projects data={NimishMadan.Projects} />
            <WorkExperience data={NimishMadan.WorkExperience} />
            <ContactMe data={NimishMadan.ContactMe} />
        </>
    );
}
