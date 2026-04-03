import React from 'react'
import Image from 'next/image'

const WorkCard = ({ image, company, title, duration, description }: { image: string, company: string, title: string, duration: string, description: string }) => {
    return (
        <div className='flex flex-row'>
            <div className='company-logo'>
                <Image src={image} alt='project1' width={30} height={30} className='rounded-md' />
            </div>

            <div className='basis-11/12'>
                <p className='text-xl'>{company}</p>
                <p className='text-sm text-zinc-500'>
                    <span className='uppercase '>
                        {title}
                    </span> - {duration}
                </p>
                <ul className='work-exp-desc-list'>
                    {description.split('\n').map((pointer, i) =>
                        <li key={i}>{pointer}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default WorkCard