import React from 'react'
import Card from './ui/Card'
import Link from 'next/link'
const Skills = ['react', 'typescript', 'javascript', 'html', 'css', 'next', 'redux', 'mui', 'bootstrap', 'tailwind', 'git', 'figma'];
const About = () => {
    return (
        <section
            className="section-container"
            id="AboutMe"
        >
            <div className="about-me-grid">
                <div className='xl:row-span-3'>
                    <Card
                        image="/aboutMeF.png"
                        title="With 5+ years of experience"
                        description="I have honed my skills in frontend development, creating dynamic and responsive websites."
                    />
                </div>
                <div className='xl:row-span-3'>
                    <Card
                        image="/globalcontact.png"
                        title="I’m very flexible with time zone communications & locations"
                        description="I'm based in Haryana, India and open to remote work worldwide."
                    />
                </div>
                <div className='xl:row-span-4'>
                    <Card
                        skills={Skills}
                        title="Tech Stack"
                        description="I specialize in a variety of languages, frameworks, and tools that allow me to build robust and scalable applications. "
                    />
                </div>
                <div className='xl:row-span-3 xl:col-span-2'>
                    <Card
                        image="/passion.png"
                        title="My Passion for Coding"
                        description="I love solving problems and building things through code. Programming isn't just my profession—it's my passion. I enjoy exploring new technologies and enhancing my skills."
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
                                    href="mailto:shaffi.ahuja@gmail.com"
                                >
                                    shaffi.ahuja@gmail.com
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