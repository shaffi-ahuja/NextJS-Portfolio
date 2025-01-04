import Image from 'next/image'
import React from 'react'

const Card = ({ image, skills, title, description }: { image?: string, skills?: any, title: string, description: any }) => {
    return (
        <div className='card'>
            {image
                &&
                <div className='card-image-div'>
                    <Image className="card-image" src={image} alt='Card Image' height={320} width={320} />
                </div>
            }
            {skills
                &&
                <div className='xl:grow content-center'>
                    <div className="skill-card-image-div">
                        {skills.map((skill: any) => (
                            <img key={skill} src={`https://skillicons.dev/icons?i=${skill}`} />
                        ))}

                    </div>
                </div>
            }
            <div className='card-title'>{title}</div>
            <div >{description}</div>
        </div>
    )
}

export default Card