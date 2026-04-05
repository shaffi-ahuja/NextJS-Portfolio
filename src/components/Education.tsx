// RSC — pure display
import AnimatedSection from './ui/AnimatedSection';
import type { EducationItem } from '@/lib/schema';

const TYPE_LABEL: Record<string, string> = {
  degree: 'Degree', '12th': 'Class XII', '10th': 'Class X',
  diploma: 'Diploma', other: 'Education',
};

export default function Education({ data }: { data: EducationItem[] }) {
  if (!data || data.length === 0) return null;

  return (
    <AnimatedSection className="section-container" direction="up">
      <h1 className="section-heading">Education</h1>
      <div className="px-4 mt-6 space-y-6">
        {data.map((edu, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div>
              <p className="font-semibold text-base">{edu.institutionName}</p>
              <p className="text-sm text-zinc-500 mt-0.5">
                {TYPE_LABEL[edu.type] ?? edu.type}
                {edu.fieldOfStudy && ` — ${edu.fieldOfStudy}`}
              </p>
              {edu.grade && (
                <p className="text-sm text-zinc-400 mt-0.5">Grade: {edu.grade}</p>
              )}
              {edu.location && (
                <p className="text-xs text-zinc-400 mt-0.5">{edu.location}</p>
              )}
            </div>
            {(edu.startYear || edu.endYear) && (
              <p className="text-sm text-zinc-400 sm:text-right whitespace-nowrap mt-1 sm:mt-0">
                {[edu.startYear, edu.endYear].filter(Boolean).join(' — ')}
              </p>
            )}
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
