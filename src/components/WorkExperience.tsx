import React from 'react'
import WorkCard from './ui/WorkCard';

const WorkExperience = ({ data }: { data: any }) => {
  return (
    <section className='section-container'>
      <h1 className='section-heading'>
        My Work Experience
      </h1>
      <div className='px-4 mt-10'>
        {data.map((work: any, i: number) => (
          <WorkCard
            key={`${work.company}-${i}`}
            image={work.image}
            company={work.company}
            title={work.title}
            duration={work.duration}       // legacy users
            startYear={work.startYear}     // form-created users
            endYear={work.endYear}
            description={work.description}
          />
        ))}
      </div>
    </section>
  )
}

export default WorkExperience
