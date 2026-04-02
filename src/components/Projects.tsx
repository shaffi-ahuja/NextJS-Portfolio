"use client"

import React from 'react'
import ProjectCard from './ui/ProjectCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/Carousel'

const Projects = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null

  const isMultiple = data.length > 1

  return (
    <section className='section-container' id='Projects'>
      <h1 className='section-heading'>My Recent Work</h1>

      <div className='px-10'>
        <Carousel className='carousel-container'>
          <CarouselContent>
            {data.map((project: any) => (
              <CarouselItem key={project.title}>
                <ProjectCard
                  icon={project.icon}
                  title={project.title}
                  description={project.description}
                  techstack={project.techstack}
                  link={project.link}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Only show arrows when there are multiple projects */}
          {isMultiple && <CarouselPrevious />}
          {isMultiple && <CarouselNext />}
        </Carousel>
      </div>
    </section>
  )
}

export default Projects
