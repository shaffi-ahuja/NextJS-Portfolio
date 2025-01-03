import Skill from './Skill'
import React from 'react'

const SkillCard = ({ skills, title, detail }: { skills: any, title: string, detail: any }) => {
    return (
        <div className='border-zinc-800 border rounded-md py-2 h-full flex flex-col justify-center xs:px-auto'>
            <div className="flex flex-wrap gap-10 p-5 xs:gap-5 xs:p-7">
                {skills.map((skill:any) => (
                    <img key={skill} src={`https://skillicons.dev/icons?i=${skill}`} />
                ))}

            </div>
            <div className='text-xl font-bold mb-3 px-3 mt-10'>{title}</div>
            <div className='text-md px-3'>{detail}</div>
        </div>
    )
}

export default SkillCard