import React from 'react';

export const LoadingSpinner = ({ size = 'medium' }) => {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
        </div>
    );
}; 