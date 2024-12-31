import Skill from './Skill'
import React from 'react'

const SkillCard = ({ skills, title, detail }: { skills: any, title: string, detail: any }) => {
    return (
        <div className='border-zinc-700 border rounded-md py-2 h-full flex flex-col justify-center'>
            <div className="flex flex-wrap gap-10 p-5">
                {skills.map((skill:any) => (
                    // <Skill label={skill} key={skill} className='capitalize' />
                    <img key={skill} src={`https://skillicons.dev/icons?i=${skill}`} />
                ))}

            </div>
            <div className='text-xl font-bold mb-3 px-3 mt-10'>{title}</div>
            <div className='text-md px-3'>{detail}</div>
        </div>
    )
}

export default SkillCard