import { toast } from 'react-toastify';

export const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
        // Server responded with a status other than 2xx
        toast.error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
        // Request was made but no response received
        toast.error('No response from server');
    } else {
        // Something else happened
        toast.error('An error occurred');
    }
};

export default handleApiError; 