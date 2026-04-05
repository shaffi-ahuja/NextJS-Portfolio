// RSC shell — AnimatedSection is client
import WorkCard from './ui/WorkCard';
import AnimatedSection from './ui/AnimatedSection';
import { WorkExperienceItem } from '@/lib/schema';

export default function WorkExperience({ data }: { data: WorkExperienceItem[] }) {
  if (!data || data.length === 0) return null;

  return (
    <AnimatedSection className="section-container" direction="up">
      <h1 className='section-heading'>My Work Experience</h1>
      <div className='px-4 mt-10' role="list" aria-label="Work experience">
        {data.map((work, i) => (
          <div key={`${work.company}-${i}`} role="listitem">
            <WorkCard
              image={work.image}
              company={work.company}
              title={work.title}
              startMonth={work.startMonth}
              startYear={work.startYear}
              endMonth={work.endMonth}
              endYear={work.endYear}
              isCurrentJob={work.isCurrentJob}
              description={work.description}
            />
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
