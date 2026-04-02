import React from 'react'
import Image from 'next/image'

const WorkCard = ({
  image,
  company,
  title,
  duration,
  startYear,
  endYear,
  description,
}: {
  image?: string
  company: string
  title: string
  duration?: string       // legacy field — existing users
  startYear?: string      // new field — form-created users
  endYear?: string
  description: string
}) => {
  const hasImage = image && image.trim() !== ''

  // Support both old duration string and new startYear/endYear
  const durationDisplay = startYear
    ? `${startYear} — ${endYear ?? 'Present'}`
    : (duration ?? '')

  return (
    <div className='flex flex-row gap-3 mb-8'>

      {/* Company logo or initial fallback */}
      <div className='company-logo flex-shrink-0'>
        {hasImage ? (
          <Image
            src={image!}
            alt={company}
            width={40}
            height={40}
            className='rounded-md object-contain'
          />
        ) : (
          <div className='w-[40px] h-[40px] rounded-md bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-bold text-zinc-600 dark:text-zinc-300'>
            {company.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className='basis-11/12'>
        <p className='text-xl font-semibold'>{company}</p>
        <p className='text-sm text-zinc-500 mt-0.5'>
          <span className='uppercase tracking-wide'>{title}</span>
          {durationDisplay && (
            <>
              <span className='mx-2 text-zinc-300 dark:text-zinc-600'>·</span>
              <span className='font-medium text-zinc-400'>{durationDisplay}</span>
            </>
          )}
        </p>
        <ul className='work-exp-desc-list ml-4 mt-2'>
          {description.split('\n').filter(Boolean).map((pointer, i) => (
            <li key={i} className='mb-1'>{pointer}</li>
          ))}
        </ul>
      </div>

    </div>
  )
}

export default WorkCard
