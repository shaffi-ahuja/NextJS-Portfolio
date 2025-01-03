'use client';
import Link from 'next/link';
import React from 'react'

const Hero = () => {
    return (
        <section className='xs:px-5 px-10 sm:px-10 md:px-16  h-[500px] grid justify-items-center content-center ' id='home'>
            <p className='text-2xl md:text-3xl sm:text-2xl'>Hi, I'm Shaffi <span
                className="inline-block animate-wave"
                role="img"
                aria-label="waving hand"
            >
                👋
            </span>
            </p>
            <p className='text-xl md:text-4xl mt-3 sm:text-3xl'>Frontend web developer from India.</p>
            <Link className='border border-zinc-900 bg-zinc-800 px-5 py-3 rounded-md mt-10 flex items-center justify-center hover:bg-zinc-900 font-bold' href="#ContactMe">
                <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Let's Work Together</Link>
        </section>

    )
}

export default Hero