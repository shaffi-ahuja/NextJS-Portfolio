// RSC — no interactivity, pure display
import Image from 'next/image';
import Link from 'next/link';
import Card from './ui/Card';
import { AboutMeData, IntroData } from '@/lib/schema';

export default function About({ data, intro }: { data: AboutMeData; intro?: IntroData }) {
  const hasCustomPhoto = intro?.profileImage && intro.profileImage.trim() !== '';
  const genderImage = data.gender === 'male' ? '/aboutmeM.png' : '/aboutMeF.png';

  return (
    <section className="section-container" id="AboutMe">
      <div className="about-me-grid">

        <div className='xl:row-span-3'>
          <div className='card'>
            <div className='card-image-div'>
              {hasCustomPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={intro!.profileImage} alt="Profile" className="card-image rounded-md object-cover" />
              ) : (
                <Image className="card-image" src={genderImage} alt="Profile" height={320} width={320} />
              )}
            </div>
            <div className='card-title'>{`With ${data.experience.yearsOfExperience}+ years of experience`}</div>
            <div>{data.experience.experienceSummary}</div>
          </div>
        </div>

        <div className='xl:row-span-3'>
          <Card
            image="/globalcontact.png"
            title={`I'm very flexible with ${data.locationOfWork.timeZone} time zone communications & locations`}
            description={`I'm based in ${data.locationOfWork.locatedAt} and open to remote work worldwide.`}
          />
        </div>

        <div className='xl:row-span-4'>
          <Card
            skills={data.skills}
            title="Tech Stack"
            description="I specialise in a variety of languages, frameworks, and tools that allow me to build robust and scalable applications."
          />
        </div>

        <div className='xl:row-span-3 xl:col-span-2'>
          <Card
            image="/passion.png"
            title={`My Passion for ${data.passion.passionTitle}`}
            description={data.passion.description}
          />
        </div>

        <div className='xl:row-span-2'>
          <Card
            image="/contact.png"
            title=''
            description={
              <div className='text-center'>
                <div className='text-lg'>Contact Me</div>
                <Link className="text-xl hover:underline" href={`mailto:${data.email}`}>
                  {data.email}
                </Link>
              </div>
            }
          />
        </div>

      </div>
    </section>
  );
}
