import React from 'react'

const Carousel = ({ children }: { children: any }) => {
    return (
        <div className='grid grid-rows-2-[80%]'>
            <div className='p-3 flex flex-cols-3 '>
                <div className='mr-5 content-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 cursor-pointer block border rounded-full p-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>
                {children}
                <div className='ml-5 content-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 cursor-pointer block border rounded-full p-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>
            <div className=' mt-5 flex justify-center gap-2 '>

                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-circle-fill cursor-pointer size-3" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-circle-fill cursor-pointer size-3" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-circle-fill cursor-pointer size-3" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8" />
                </svg>
            </div>


        </div>
    )
}

export default Carousel