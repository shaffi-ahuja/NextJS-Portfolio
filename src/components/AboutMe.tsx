import React from 'react'
import Card from './ui/Card'
import Heading from './ui/Heading'

const AboutMe = () => {
    return (
        <section className='px-10 bg-gradient-to-b from-zinc-800 to-[#000] ' id='AboutMe'>
            <Heading>
                About me
            </Heading>
            <div className=' p-1  grid grid-cols-2 '>
                <div className=' p-1  grid-rows-2'>
                    <div className='grid grid-cols-2 '>
                        <div className=' p-1 '>
                            <Card image='/aboutme.png'
                                title='Hi, I’m Shaffi Ahuja'
                                detail='With 5 years of experience, I have honed my skills in frontend dev, creating dynamic and responsive websites. ' />
                        </div>
                        <div className=' p-1 '><Card
                            image='/techstack.png'
                            title='Tech Stack'
                            detail='I specialize in a variety of languages, frameworks, and tools that allow me to build robust and scalable applications'
                        /></div>
                    </div>
                    <div className=' p-1 '>
                        <Card
                            image='/passion.png'
                            title='My Passion for Coding'
                            detail={`I love solving problems and building things through code. Programming isn't just my profession—it's my passion. I enjoy exploring new technologies, and enhancing my skills.`}
                        />
                    </div>
                </div>
                <div
                    className='grid grid-rows-1  p-1 '>
                    <div
                        className=' p-1 '>
                        <Card
                            image='/globalcontact.png'
                            title='I’m very flexible with time zone communications & locations'
                            detail={`I'm based in Haryana, India and open to remote work worldwide.`}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AboutMe