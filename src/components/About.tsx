import React from 'react'
import Card from './ui/Card'
import Link from 'next/link'
import Image from 'next/image'

const About = ({ data, intro }: { data: any; intro?: any }) => {
  // Profile image: base64 from form > gender fallback
  const profileImage = intro?.profileImage && intro.profileImage.trim() !== ''
    ? null // handled separately below
    : (data.gender === 'male' ? '/aboutmeM.png' : '/aboutMeF.png')

  const hasCustomPhoto = intro?.profileImage && intro.profileImage.trim() !== ''

  return (
    <section className="section-container" id="AboutMe">
      <div className="about-me-grid">

        {/* Experience card — with profile photo or gender image */}
        <div className='xl:row-span-3'>
          <div className='card'>
            {hasCustomPhoto ? (
              <div className='card-image-div'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={intro.profileImage}
                  alt="Profile"
                  className="card-image rounded-md object-cover"
                />
              </div>
            ) : (
              <div className='card-image-div'>
                <Image
                  className="card-image"
                  src={profileImage!}
                  alt='Card Image'
                  height={320}
                  width={320}
                />
              </div>
            )}
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
            description="I specialize in a variety of languages, frameworks, and tools that allow me to build robust and scalable applications."
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
  )
}

export default About
