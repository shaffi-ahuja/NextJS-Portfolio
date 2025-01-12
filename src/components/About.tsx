import React from 'react'
import Card from './ui/Card'
import Link from 'next/link'

const About = ({ data }: { data: any }) => {
    return (
        <section
            className="section-container"
            id="AboutMe"
        >
            <div className="about-me-grid">
                <div className='xl:row-span-3'>
                    <Card
                        image={data.gender === 'male' ? '/aboutMeM.png' : '/aboutMeF.png'}
                        title={`With ${data.experience.yearsOfExperience}+ years of experience`}
                        description={data.experience.experienceSummary}
                    />
                </div>
                <div className='xl:row-span-3'>
                    <Card
                        image="/globalcontact.png"
                        title={`I’m very flexible with ${data.locationOfWork.timeZone} time zone communications & locations`}
                        description={`I'm based in ${data.locationOfWork.locatedAt} and open to remote work worldwide.`}
                    />
                </div>
                <div className='xl:row-span-4'>
                    <Card
                        skills={data.skills}
                        title="Tech Stack"
                        description="I specialize in a variety of languages, frameworks, and tools that allow me to build robust and scalable applications. "
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
                                    className="text-xl hover:underline"
                                    href={data.email}
                                >
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