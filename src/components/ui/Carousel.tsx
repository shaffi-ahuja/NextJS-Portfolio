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
            <div className='carousel-container'>
                <div className='left-arrow-container'>
                    <AiOutlineLeftCircle className={`arrow ${index == 0 ? 'fill-gray-800' : 'cursor-pointer'}`}
                        onClick={() => onPrev()}
                    />
                </div>
                {children}
                <div className='right-arrow-container'>
                    <AiOutlineRightCircle className={`arrow ${index == 2 ? 'fill-gray-800' : 'cursor-pointer'}`} onClick={() => onNext()} />
                </div>
            </div>

            <div className='dots-container'>
                <PiCircleFill className={`size-4 ${index == 0 ? "fill-current" : "fill-[#808080]"}`} />
                <PiCircleFill className={`size-4 ${index == 1 ? "fill-current" : "fill-[#808080]"}`} />
                <PiCircleFill className={`size-4 ${index == 2 ? "fill-current" : "fill-[#808080]"}`} />
            </div>
        </>
    )
}

export default Carousel