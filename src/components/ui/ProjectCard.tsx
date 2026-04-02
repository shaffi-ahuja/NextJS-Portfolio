import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const DefaultProjectIcon = () => (
  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="white" className="w-10 h-10">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
    </svg>
  </div>
)

const ProjectCard = ({
  icon,
  title,
  description,
  techstack,
  link,
}: {
  icon?: string
  title: string
  description: string
  techstack: string[]
  link?: string
}) => {
  const hasIcon = icon && icon.trim() !== ''
  const hasLink = link && link.trim() !== ''

  return (
    <div className='project-card-container'>
      <div className='flex flex-col h-full'>

        {/* Icon or default */}
        {hasIcon ? (
          <Image
            src={icon!}
            alt={title}
            height={80}
            width={80}
            className='rounded-2xl mb-3 object-contain'
          />
        ) : (
          <DefaultProjectIcon />
        )}

        <h2 className='card-title'>{title}</h2>
        <p className='mt-2 text-sm leading-relaxed flex-grow text-zinc-600 dark:text-zinc-400'>
          {description}
        </p>

        <div className='mt-5 flex flex-wrap items-center gap-3'>
          <div className='flex gap-2 flex-wrap grow'>
            {techstack.map((skill: string) => (
              <img
                key={skill}
                className='size-8'
                src={`https://skillicons.dev/icons?i=${skill}`}
                alt={skill}
              />
            ))}
          </div>

          {hasLink && (
            <Link
              href={link!}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 cursor-pointer hover:underline text-sm font-medium'
            >
              <p>Check Live Site</p>
              <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'
                strokeWidth={1.5} stroke='orange' className='size-4'>
                <path strokeLinecap='round' strokeLinejoin='round'
                  d='m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25' />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
