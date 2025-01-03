import React from 'react'

const Toast = ({ message, variant }: { message: string, variant: 'success' | 'error' }) => {
    return (
        <div className={`toast ${variant === 'success' ? 'success-toast ' : 'error-toast'}`} >
            <p>
                {message}
            </p>
        </div>
    )
}

export default Toast