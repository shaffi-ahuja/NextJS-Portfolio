import React from 'react'

const Heading = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className='p-4'>
            <p className='text-2xl font-bold'>
                {children}
            </p>
        </div>
    )
}

export default Heading