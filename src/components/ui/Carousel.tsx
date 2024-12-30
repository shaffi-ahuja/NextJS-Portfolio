import React from 'react'

//TODO
type CarouselProps = {
    children: string,//React Node
    onPrev: string,//function
    onNext: string,
    index: number
};

const Carousel = ({ children, onPrev, onNext, index }: any) => {

    return (
        <div className=''>
            <div className='p-3 flex flex-cols-3 '>
                <div className='mr-5 content-center '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={index == 0 ? '#1f2937' : "currentColor"} className={`size-7  block border rounded-full p-1 ${index == 0 ? 'border-gray-800' : 'cursor-pointer'}`} onClick={() => onPrev()}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>
                {children}
                <div className='ml-5 content-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={index == 2 ? '#1f2937' : "currentColor"} className={`size-7  block border rounded-full p-1 ${index == 2 ? 'border-gray-800' : 'cursor-pointer'}`} onClick={() => onNext()} >
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>

            <div className=' mt-5 flex justify-center gap-2 '>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={index == 0 ? "currentColor" : "gray"} className="bi bi-circle-fill  size-3" viewBox="0 0 16 16" >
                    <circle cx="8" cy="8" r="8" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                    fill={index == 1 ? "currentColor" : "gray"}
                    className="bi bi-circle-fill  size-3" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={index == 2 ? "currentColor" : "gray"}
                    className="bi bi-circle-fill  size-3" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8" />
                </svg>
            </div>
        </div>
    )
}

export default Carousel