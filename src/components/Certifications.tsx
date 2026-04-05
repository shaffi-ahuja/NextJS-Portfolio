// RSC — pure display
import AnimatedSection from './ui/AnimatedSection';
import type { CertificationItem } from '@/lib/schema';

export default function Certifications({ data }: { data: CertificationItem[] }) {
  if (!data || data.length === 0) return null;

  return (
    <AnimatedSection className="section-container" direction="up">
      <h1 className="section-heading">Certifications</h1>
      <div className="px-4 mt-6 space-y-4">
        {data.map((cert, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
            <div>
              <p className="font-semibold text-base">{cert.name}</p>
              <p className="text-sm text-zinc-500 mt-0.5">{cert.organization}</p>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                  aria-label={`View credential for ${cert.name}`}
                >
                  View credential →
                </a>
              )}
            </div>
            {cert.date && (
              <p className="text-sm text-zinc-400 sm:text-right whitespace-nowrap mt-1 sm:mt-0">
                {cert.date}
              </p>
            )}
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
