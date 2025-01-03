import React from 'react'
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai';
import { PiCircleFill } from 'react-icons/pi';


//TODO
type CarouselProps = {
    children: string,//React Node
    onPrev: string,//function
    onNext: string,
    index: number
};

const Carousel = ({ children, onPrev, onNext, index }: any) => {

    return (
        <>
            <div className='p-3 flex flex-cols-3 '>
                <div className='sm:mr-5 mr-2 content-center '>
                    <AiOutlineLeftCircle className={`size-10  block p-1 ${index == 0 ? 'fill-gray-800' : 'cursor-pointer'}`}
                        onClick={() => onPrev()}
                    />
                </div>
                {children}
                <div className='ml-2 sm:ml-5 content-center'>
                    <AiOutlineRightCircle className={`size-10 block p-1 ${index == 2 ? 'fill-gray-800' : 'cursor-pointer'}`} onClick={() => onNext()} />
                </div>
            </div>

            <div className=' mt-5 flex justify-center gap-2 '>
                <PiCircleFill className={`size-4 ${index == 0 ? "fill-current" : "fill-[#808080]"}`} />
                <PiCircleFill className={`size-4 ${index == 1 ? "fill-current" : "fill-[#808080]"}`} />
                <PiCircleFill className={`size-4 ${index == 2 ? "fill-current" : "fill-[#808080]"}`} />
            </div>
        </>
    )
}

export default Carousel