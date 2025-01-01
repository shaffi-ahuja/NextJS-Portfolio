import Image from 'next/image'
import React from 'react'

const Hero = () => {
    return (
        <section className='xs:px-5 px-10 sm:px-10 md:px-16 bg-gradient-to-t from-zinc-800 to-[#000] h-[500px] grid justify-items-center content-center '>
            <p className='text-2xl md:text-3xl sm:text-2xl'>Hi, I'm Shaffi 👋</p>
            <p className='text-xl md:text-4xl mt-3 sm:text-3xl'>Frontend web developer from India.</p>
        </section>

    )
}

export default Hero