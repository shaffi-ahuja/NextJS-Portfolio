// RSC — no interactivity, pure display
import WorkCard from './ui/WorkCard';
import { WorkExperienceItem } from '@/lib/schema';

export default function WorkExperience({ data }: { data: WorkExperienceItem[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className='section-container'>
      <h1 className='section-heading'>My Work Experience</h1>
      <div className='px-4 mt-10'>
        {data.map((work, i) => (
          <WorkCard
            key={`${work.company}-${i}`}
            image={work.image}
            company={work.company}
            title={work.title}
            startYear={work.startYear}
            endYear={work.endYear}
            description={work.description}
          />
        ))}
      </div>
    </section>
  );
}
