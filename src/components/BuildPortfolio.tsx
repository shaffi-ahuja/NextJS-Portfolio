"use client";

import React from 'react'
import { CgProfile } from 'react-icons/cg';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/Carousel'

const BuildPortfolio = () => {

    return (
        <section className='section-container justify-items-center text-center'>
            <h1 className='pt-20 text-2xl font-bold '>
                Came so far, How about you create your own portfolio using your own theme
            </h1>
            <button className='hero-section-button mb-5'>
                <Link href="/user/create">
                    Let's Go!
                </Link>
            </button>
            <p>
                Still not convinced, look how these folks crafted theirs
            </p>
            <Carousel className='carousel-container mt-2'>
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) =>
                        <CarouselItem key={index}>
                            <button className='rounded size-10 ' >
                                <Link href="/user/nimishmadan">
                                    <CgProfile className='size-10 ' />
                                </Link>
                            </button>

                        </CarouselItem>)
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </section>
    )
}

export default BuildPortfolio