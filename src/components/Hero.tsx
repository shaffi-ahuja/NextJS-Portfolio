// RSC shell — AnimatedSection inside is client
import Link from 'next/link';
import { IntroData } from '@/lib/schema';
import AnimatedSection from './ui/AnimatedSection';

export default function Hero({ data }: { data: IntroData }) {
  return (
    <AnimatedSection
      className="section-container min-h-[400px] md:h-[500px] grid justify-items-center content-center py-16 md:py-0 text-center"
      direction="up"
      id="home"
    >
      <p className='hero-section-heading'>
        Hi, I&apos;m {data.FirstName}{' '}
        <span className="inline-block animate-wave" role="img" aria-label="waving hand">👋</span>
      </p>
      <p className='hero-section-sub-heading px-4'>{data.OneLinerIntro}</p>
      <Link
        className='hero-section-button mt-10 flex'
        href="#ContactMe"
        aria-label="Jump to contact section"
      >
        <span className="relative flex h-3 w-3 mr-2" aria-hidden="true">
          <span className="animate-ping-green" />
          <span className="ping-green" />
        </span>
        Let&apos;s Work Together
      </Link>
    </AnimatedSection>
  );
}
