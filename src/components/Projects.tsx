"use client"

import React, { useState } from 'react'
import ProjectCard from './ui/ProjectCard'
import { ProjectData } from '@/data/ProjectData'
import Carousel from './ui/Carousel'

const Projects = () => {

  const projects = ProjectData.projects.length;
  const [index, setIndex] = useState(1);
  // Set state at middle index
  // Keeping projects as top 3 projects for now
  const project = ProjectData.projects[index];
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
      <div >
        <Carousel onNext={nextClickHandler} onPrev={prevClickHandler} index={index}>
          <ProjectCard
            icon={project.icon}
            title={project.title}
            description={project.description}
            techstack={project.techstack}
            link={project.link}
          />
        </Carousel>
 
      </div>
    </section>
  )
}

export default Projects