import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProjectCard = ({ icon, title, description, techstack, link }: { icon: string, title: string, description: string, techstack: string[], link: string }) => {
    return (
        <div className='project-card-container'>
            <div className='flex flex-col'>
                <Image src={icon} alt={title} height={100} width={100} className='rounded-md mb-3' />
                <h2 className='card-title'>{title}</h2>
                <div className='mt-2'>{description}</div>
                <div className=' mt-5 sm:flex'>
                    <div className="flex gap-2 grow">
                        {techstack.map((skill: string) => (
                            <img key={skill} className='size-8' src={`https://skillicons.dev/icons?i=${skill}`} />
                        ))}
                    </div>
                    <Link href={link}
                        target='_blank'
                        className=' flex cursor-pointer xs:mt-10'>
                        <p>
                            Check Live Site
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="orange" className="go-to-arrow ">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard