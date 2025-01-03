import Image from 'next/image'
import React from 'react'

const Card = ({ image, title, detail }: { image: string, title: string, detail: any }) => {
    return (
        <div className='border-zinc-800 border rounded-md py-2 h-full flex flex-col'>
            <div className='flex-grow -mb-24 xs:-mb-10'>
                <Image className="mx-auto w-full xs:mb-1 " src={image} alt='Card Image' height={320} width={320} />
            </div>
            <div className='text-xl font-bold mb-3 px-3'>{title}</div>
            <div className='text-md px-3'>{detail}</div>
        </div>
    )
}

export default Card