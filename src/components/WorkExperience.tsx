import React from 'react'
import WorkCard from './ui/WorkCard'
import { WorkData } from '@/data/WorkExperienceData'

const WorkExperience = () => {
  const workhistory = WorkData.data;
  return (
    <section className='section-container'>
      <h1 className='section-heading'>
        My Work Experience
      </h1>
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