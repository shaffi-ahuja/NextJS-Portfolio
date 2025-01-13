import React from 'react'


const Toast = ({ message, variant }: { message: string, variant: 'success' | 'error' | 'info' }) => {
    const toastClass = {
        success: 'success-toast',
        info: 'info-toast',
        error: 'error-toast'
    }[variant] || 'error-toast';

    return (
        <div className={`toast ${toastClass}`} >
            <p>
                {message}
            </p>
        </div>
    )
}

export default Toast