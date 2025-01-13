import React from 'react'
import WorkCard from './ui/WorkCard';

const WorkExperience = ({ data }: { data: any }) => {

  
  return (
    <section className='section-container'>
      <h1 className='section-heading'>
        My Work Experience
      </h1>
      <div className=' px-4 mt-10'>
        {data.map((work: any) =>
          <WorkCard
            key={work.company}
            image={work.image}
            company={work.company}
            title={work.title}
            duration={work.duration}
            description={work.description}
          />)}

      </div>

    </section>
  )
}

export default WorkExperience