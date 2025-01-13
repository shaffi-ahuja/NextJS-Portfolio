"use client"

import React, { useState } from 'react'
import ProjectCard from './ui/ProjectCard'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/Carousel'

const Projects = ({ data }: { data: any }) => {

  const projects = data.length;
  const [index, setIndex] = useState(Math.floor(projects / 2));
  // Set state at middle index
  // Keeping projects as top 3 projects for now
  // const project = data[index];
  const nextClickHandler = () => {
    index >= 0 && index < projects - 1 && setIndex((prevIndex) => prevIndex + 1);
  }
  const prevClickHandler = () => {
    index >= projects - 2 && index <= projects - 1 && setIndex((prevIndex) => prevIndex - 1);
  }
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
      {/* <div >
        <Carousel onNext={nextClickHandler} onPrev={prevClickHandler} index={index}>
          <ProjectCard
            icon={project.icon}
            title={project.title}
            description={project.description}
            techstack={project.techstack}
            link={project.link}
          />
        </Carousel>

      </div> */}
    </section>
  )
}

export default Projects