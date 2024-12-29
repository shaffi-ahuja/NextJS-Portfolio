import React from 'react'
import Heading from './ui/Heading'
import WorkCard from './ui/WorkCard'
import { WorkData } from '@/data/WorkExperienceData'

const WorkExperience = () => {
  const workhistory = WorkData.data;
  return (
    <section className='px-10 bg-black'>
      <Heading>
        My Work Experience
      </Heading>
      <div className='flex flex-row px-4 mt-10'>
        <div className='basis-1/3'>
        {/* Any Image */}
        </div>
        <div className='basis-2/3 flex flex-col'>
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
      </div>

    </section>
  )
}

export default WorkExperience