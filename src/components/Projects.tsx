import React from 'react'
import Card from './ui/Card'
import ProjectCard from './ui/ProjectCard'
import Heading from './ui/Heading'

const Projects = () => {
  return (
    <section className='px-10 bg-black ' id='Projects'>
      <Heading>
        My Selected Work
      </Heading>
      <div className='p-10 flex flex-cols-3 '>
        <div className='mr-5 content-center '>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 cursor-pointer block border rounded-full p-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </div>

        <ProjectCard
          icon='/project1.png'
          title='Podcastr - AI Podcast Platform'
          description='Podcastr is a revolutionary Software-as-a-Service platform that transforms the way podcasts are created. With advanced AI-powered features like text-to-multiple-voices functionality, it allows creators to generate diverse voiceovers from a single text input.
          Built as a unique Software-as-a-Service app with Next.js 14, Tailwind CSS, TypeScript, Framer Motion and Convex, Podcastr is designed for optimal performance and scalability.'
          techstack='React, Typescript, Tailwind'
          link=''
        />
        <div className='ml-5 content-center'>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 cursor-pointer block border rounded-full p-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>


      </div>
    </section>
  )
}

export default Projects