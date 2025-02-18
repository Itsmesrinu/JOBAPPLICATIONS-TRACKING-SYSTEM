import React from 'react';

export const SuccessMessage = ({ message }) => {
    return (
        <div className="text-green-500 text-sm mt-1">
            {message}
        </div>
    );
}; 