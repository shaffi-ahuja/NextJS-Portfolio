import React from 'react'
import Heading from './ui/Heading'
import WorkCard from './ui/WorkCard'
import { WorkData } from '@/data/WorkExperienceData'

const WorkExperience = () => {
  const workhistory = WorkData.data;
  return (
    <section className='xl:px-32 lg:px-24 md:px-16 px-8 bg-black'>
      <Heading>
        My Work Experience
      </Heading>
      <div className=' px-4 mt-10'>

        {workhistory.map((data) =>
          <WorkCard
            key={data.id}
            image={data.image}
            company={data.company}
            title={data.title}
            duration={data.duration}
            description={data.description}
          />)}

      </div>

    </section>
  )
}

export default WorkExperience