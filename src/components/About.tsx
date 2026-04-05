// RSC shell — AnimatedSection is client
import Image from 'next/image';
import Link from 'next/link';
import Card from './ui/Card';
import AnimatedSection from './ui/AnimatedSection';
import { AboutMeData, IntroData, WorkExperienceItem } from '@/lib/schema';
import { calculateYearsOfExperience } from '@/lib/utils';

export default function About({
  data,
  intro,
  workExperience,
}: {
  data: AboutMeData;
  intro?: IntroData;
  workExperience?: WorkExperienceItem[];
}) {
  const hasCustomPhoto = intro?.profileImage && intro.profileImage.trim() !== '';
  const genderImage = data.gender === 'male' ? '/aboutmeM.png' : '/aboutMeF.png';

  // Compute years dynamically from work history — fall back to stored value
  const yearsOfExperience = workExperience && workExperience.length > 0
    ? calculateYearsOfExperience(workExperience)
    : (data.experience.yearsOfExperience ?? 0);

  // Format nicely: "5" not "5.0", "5.5" stays as "5.5"
  const yearsDisplay = Number.isInteger(yearsOfExperience)
    ? yearsOfExperience.toString()
    : yearsOfExperience.toFixed(1);

  return (
    <AnimatedSection className="section-container" direction="up" id="AboutMe">
      <div className="about-me-grid">

        <div className='xl:row-span-3'>
          <div className='card'>
            <div className='card-image-div'>
              {hasCustomPhoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={intro!.profileImage}
                  alt={`${intro!.FirstName} ${intro!.LastName}`}
                  className="card-image rounded-md object-cover"
                />
              ) : (
                <Image
                  className="card-image"
                  src={genderImage}
                  alt="Profile illustration"
                  height={320}
                  width={320}
                />
              )}
            </div>
            <div className='card-title'>{`With ${yearsDisplay}+ years of experience`}</div>
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
                <Link
                  className="text-xl hover:underline focus-visible:underline"
                  href={`mailto:${data.email}`}
                  aria-label={`Send email to ${data.email}`}
                >
                  {data.email}
                </Link>
              </div>
            }
          />
        </div>

      </div>
    </AnimatedSection>
  );
}
