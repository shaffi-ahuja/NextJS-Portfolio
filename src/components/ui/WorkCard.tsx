import React from 'react'
import Image from 'next/image'

const WorkCard = ({ image, company, title, duration, description }: { image: string, company: string, title: string, duration: string, description: string }) => {
    return (
        <div className='flex flex-cols'>
            <div className='basis-1/12 mr-3 justify-items-center'>
                <Image src={image} alt='project1' width={30} height={30} className='border rounded-md p-1' />
                {/* <div className="h-20 w-[0.1px] mt-1.5 bg-gray-600"></div> */}

            </div>

            <div className='basis-11/12'>
                <p className='text-xl'>{company}</p>
                <p className='text-sm text-gray-500'>
                    <span className='uppercase '>
                        {title}
                    </span> - {duration}
                </p>
                <ul className='text-gray-400 my-3 list-disc'>
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