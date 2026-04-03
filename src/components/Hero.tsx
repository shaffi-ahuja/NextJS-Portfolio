// RSC — no interactivity, pure display
import Link from 'next/link';
import { IntroData } from '@/lib/schema';

export default function Hero({ data }: { data: IntroData }) {
  return (
    <section className='section-container min-h-[400px] md:h-[500px] grid justify-items-center content-center py-16 md:py-0 text-center' id='home'>
      <p className='hero-section-heading'>
        Hi, I&apos;m {data.FirstName}{' '}
        <span className="inline-block animate-wave" role="img" aria-label="waving hand">👋</span>
      </p>
      <p className='hero-section-sub-heading px-4'>{data.OneLinerIntro}</p>
      <Link className='hero-section-button mt-10' href="#ContactMe">
        <span className="relative flex h-3 w-3 mr-2">
          <span className="animate-ping-green" />
          <span className="ping-green" />
        </span>
        Let&apos;s Work Together
      </Link>
    </section>
  );
}
