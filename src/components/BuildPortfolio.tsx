"use client";

import React from 'react'
import { CgProfile } from 'react-icons/cg';
import Link from 'next/link';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/Carousel'
import profile1 from "../../public/profile1.png";
import profile2 from "../../public/profile2.png";
import Image from 'next/image';
const BuildPortfolio = () => {

    return (
        <section className='section-container justify-items-center text-center'>
            <h1 className='pt-20 text-2xl font-bold '>
                Look how far you've come!
           
            </h1>
            <p className='text-lg'>
                Now, take it to the next level by crafting your very own portfolio with a personalized theme that reflects your unique style!
            </p>
            <button className='hero-section-button mb-5'>
                <Link href="/user/create">
                    Let's Go!
                </Link>
            </button>
            <p>
                Still not convinced, look how these folks crafted theirs
            </p>
            {/* <Carousel className='carousel-container mt-2'>
                <CarouselContent>
                    {Array.from({ length: 3 }).map((_, index) =>
                        <CarouselItem key={index}> */}
            <div className='mt-5'>
            <button className='rounded size-10 mx-2' >
                    <Link href="https://my-digitall-portfolio.vercel.app/user/sahilahuja1729">
                    <Image src={profile2} alt="profile" />
                </Link>
            </button>
            <button className='rounded size-10 mx-2' >
                    <Link href="https://my-digitall-portfolio.vercel.app/user/nimishmadan">
                    <Image src={profile1} alt="profile" />
                </Link>
            </button>
            </div>
            {/* </CarouselItem>)
                    }
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel> */}
        </section>
    )
}

export default BuildPortfolio