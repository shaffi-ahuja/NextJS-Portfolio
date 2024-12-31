import React from 'react'

const Skill = ({ label, type }: { label: string, type?: 'submit' }) => {
    return (
        <div className='border border-zinc-900 bg-zinc-600 px-2 py-1 rounded-md w-fit h-fit items-center justify-center'>{label}</div>
    )
}

export default Skill