export const fetchWithRetry = async (url, options = {}, retries = 3) => {
    let lastError;
    
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            lastError = error;
            
            if (i === retries - 1) break;
            
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
        }
    }
    
    throw lastError;
};

// Update API_ENDPOINTS to include all endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        VALIDATE: '/auth/validate'
    },
    APPLICATIONS: {
        SUBMIT: '/applications/apply',
        GET_ALL: '/applications/all',
        GET_ONE: (id) => `/applications/${id}`,
        GET_PENDING: '/applications/pending',
        UPDATE_STATUS: (id) => `/applications/status/${id}`,
        GET_BY_CANDIDATE: (candidateId, jobId) => `/applications/candidate/${candidateId}/job/${jobId}`
    },
    JOBS: {
        GET_ALL: '/jobs/all-jobs',
        GET_ONE: (id) => `/jobs/current-job/${id}`,
        CREATE: '/jobs/post-job',
        UPDATE: (id) => `/jobs/update-job/${id}`,
        ASSIGN_RECRUITER: '/jobs/assign-recruiter'
    },
    USERS: {
        GET_ALL: '/users/all-users',
        GET_ONE: (id) => `/users/user/${id}`,
        UPDATE: (id) => `/users/update-user/${id}`,
        GET_RECRUITERS: '/users/recruiters'
    },
    STATS: {
        EMPLOYER: '/stats/employer-stats',
        CANDIDATE: '/stats/my-stats',
        RECRUITER: '/stats/recruiter-stats'
    }
}; 