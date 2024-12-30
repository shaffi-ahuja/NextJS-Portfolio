import React from 'react'

const Heading = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='p-4 pt-20'>
            <p className='text-4xl font-bold'>
                {children}
            </p>
        </div>
    )
}

export default Heading