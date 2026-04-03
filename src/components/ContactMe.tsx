// RSC shell — AnimatedSection + ContactForm (client)
import Image from "next/image";
import ContactForm from "./ui/ContactForm";
import AnimatedSection from "./ui/AnimatedSection";
import { ContactMeData } from "@/lib/schema";

export default function ContactMe({ data }: { data: ContactMeData }) {
  return (
    <AnimatedSection
      className="section-container pt-10 xs:px-5"
      direction="up"
      id="ContactMe"
    >
      <div className="mail-header-image">
        <Image
          src="/contactMeHeader.png"
          alt="Contact section header"
          height={10}
          width={2480}
          className="w-full"
          aria-hidden="true"
        />
        <ContactForm contactMeFor={data.contactMeFor} sendTo={data.email} />
      </div>
    </AnimatedSection>
  );
}
