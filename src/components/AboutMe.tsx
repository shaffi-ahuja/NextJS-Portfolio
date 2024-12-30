import React from 'react'
import Card from './ui/Card'
import Link from 'next/link'
import Skill from './ui/Skill'

const Skills = ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Next.js', 'Redux', 'MUI', 'Bootstrap', 'SCSS', 'Tailwind CSS', 'Git', 'Figma'];

const AboutMe = () => {
    return (
        <section
            className="px-32 bg-gradient-to-b from-zinc-800 to-[#000]"
            id="AboutMe"
        >
            <div className="p-1 grid grid-cols-3 gap-4">
                {/* Left Column */}
                <div className="grid grid-rows-2 col-span-2 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Card
                                image="/aboutMeF.png"
                                title="With 5+ years of experience"
                                detail="I have honed my skills in frontend development, creating dynamic and responsive websites."
                            />
                        </div>
                        <div>
                            <Card
                                image="/globalcontact.png"
                                title="I’m very flexible with time zone communications & locations"
                                detail="I'm based in Haryana, India and open to remote work worldwide."
                            />
                        </div>
                    </div>
                    <div>
                        <Card
                            image="/passion.png"
                            title="My Passion for Coding"
                            detail="I love solving problems and building things through code. Programming isn't just my profession—it's my passion. I enjoy exploring new technologies and enhancing my skills."
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="grid grid-rows-3 gap-4">
                    <div className='row-span-2'>
                        <Card
                            image="/techstack.png"
                            title="Tech Stack"
                            detail={
                                <>
                                    <div className="text-md mb-2">I specialize in a variety of languages, frameworks, and tools that allow me to build robust and scalable applications </div>
                                    <div className="flex flex-wrap gap-2">
                                        {Skills.map((skill) => (
                                            <Skill label={skill} key={skill} />
                                        ))}
                                    </div>
                                </>
                            }
                        />
                    </div>
                    <div>
                        <Card
                            image="/contact.png"
                            title=''
                            detail={
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
            </div>
        </section>

    )
}

export default AboutMe