import React from 'react'
import ProjectCard from './ui/ProjectCard'
import Heading from './ui/Heading'
import { ProjectData } from '@/data/ProjectData'
import Carousel from './ui/Carousel'

const Projects = () => {

  const projects = ProjectData.projects[0];
  return (
    <section className='px-10 bg-black ' id='Projects'>
      <Heading>
        My Selected Work
      </Heading>
      <div className=''>

        <Carousel>
          <ProjectCard
            icon={projects.icon}
            title={projects.title}
            description={projects.description}
            techstack={projects.techstack}
            link={projects.link}
          />

        </Carousel>


      </div>
    </section>
  )
}

export default Projects