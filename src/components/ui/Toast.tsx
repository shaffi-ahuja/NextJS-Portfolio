import React from 'react'

const Toast = ({ message, variant }: { message: string, variant: 'success' | 'error' }) => {
    return (
        <div className={`border rounded-md w-fit p-3 h-fit px-10 fixed right-5 bottom-16  ${variant === 'success' ? 'border-cyan-700 bg-cyan-700 ' : 'border-red-700 bg-red-700 '}  text-center content-center text-lg`} >
            <p className=''>
                {message}
            </p>
        </div>
    )
}

export default Toast