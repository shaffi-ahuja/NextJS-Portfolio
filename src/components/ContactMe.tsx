// RSC shell — ContactForm inside is client (has form state)
import Image from 'next/image';
import ContactForm from './ui/ContactForm';
import { ContactMeData } from '@/lib/schema';

export default function ContactMe({ data }: { data: ContactMeData }) {
  return (
    <section className='section-container pt-10 xs:px-5' id='ContactMe'>
      <div className='mail-header-image'>
        <Image
          src="/contactMeHeader.png"
          alt="Contact header"
          height={10}
          width={2480}
          className='w-full'
        />
        <ContactForm contactMeFor={data.contactMeFor} sendTo={data.email} />
      </div>
    </section>
  );
}
