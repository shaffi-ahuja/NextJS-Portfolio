'use client';
import Link from 'next/link';
import React from 'react'

const Hero = ({ data }: { data: any }) => {
    return (
        <section className='section-container h-[500px] grid justify-items-center content-center' id='home'>
            <p className='hero-section-heading'>Hi, I'm {data.FirstName}  <span
                className="inline-block animate-wave"
                role="img"
                aria-label="waving hand"
            >
                👋
            </span>
            </p>
            <p className='hero-section-sub-heading'>{data.OneLinerIntro}</p>
            <Link className='hero-section-button'
                href="#ContactMe">
                <span className="relative flex h-3 w-3 mr-2">
                    <span className="animate-ping-green"></span>
                    <span className="ping-green"></span>
                </span>
                Let's Work Together</Link>
        </section>

    )
}

export default Hero