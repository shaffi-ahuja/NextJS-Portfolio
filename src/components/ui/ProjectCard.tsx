import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ProjectCard = ({ icon, title, description, techstack, link }: { icon: string, title: string, description: string, techstack: string, link: string }) => {
    return (
        <div className='border-zinc-700 border rounded-md p-5 lg:h-[400] md:h-[500] sm:h-[600] bg-gradient-to-t from-zinc-800 to-[#000] '>
            <div className='grid grid-rows-3'>
                <div className='grid grid-row-2'>
                    <Image src={icon} alt={title} height={100} width={100} />
                    <h2 className='text-xl font-bold'>{title}</h2>
                </div>
                <div className='mt-2'>{description}</div>
                <div className='grid grid-cols-2 gap-2 mt-10'>
                    <div>{techstack}</div>
                    <Link href={link}
                        className='flex justify-end cursor-pointer'>
                        Check Live Site
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProjectCard