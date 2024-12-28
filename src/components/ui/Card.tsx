import Image from 'next/image'
import React from 'react'

const Card = ({ image, title, detail }: { image: string, title: string, detail: string }) => {
    return (
        <div className='border-zinc-700 border rounded-md p-2 h-full '>
            <Image className="w-full " src={image} alt='Card Image' height={1000} width={1000} />
            <div className='mt-1 text-xl font-bold'>{title}</div>
            <div className='text-md '>{detail}</div>
        </div>
    )
}

export default Card