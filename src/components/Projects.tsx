"use client"

import React from 'react'
import ProjectCard from './ui/ProjectCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/Carousel'

const Projects = ({ data }: { data: any }) => {

  return (
    <section className='section-container' id='Projects'>
      <h1 className='section-heading'>
        My Recent Work
      </h1>
      <div className='px-10'>
        <Carousel className='carousel-container'>
          <CarouselContent>
            {data.map((project: any) =>
              <CarouselItem key={project.title}>
                <ProjectCard
                  key={project.title}
                  icon={project.icon}
                  title={project.title}
                  description={project.description}
                  techstack={project.techstack}
                  link={project.link}
                />
              </CarouselItem>)
            }

          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

    </section>
  )
}

export default Projects