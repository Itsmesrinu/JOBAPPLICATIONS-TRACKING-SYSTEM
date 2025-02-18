import axios from 'axios';
import { toast } from 'react-toastify';
import { handleApiError } from '../middleware/errorHandler';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('usertoken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    response => response,
    error => {
        handleApiError(error);
        return Promise.reject(error);
    }
);

// Job APIs
export const jobAPI = {
    getAllJobs: async () => {
        try {
            const response = await api.get('/jobs/all-jobs');
            if (response.data && response.data.success) {
                return response.data;
            }
            throw new Error('Invalid response format');
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    getJob: (id) => api.get(`/jobs/${id}`),
    createJob: (data) => api.post('/jobs', data),
    updateJob: (id, data) => api.put(`/jobs/${id}`, data),
    deleteJob: (id) => api.delete(`/jobs/${id}`)
};

// Application APIs
export const applicationAPI = {
  submitApplication: async (formData) => {
    try {
        const response = await api.post('/applications/submit-application', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
            }
        });
        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
  },
  getApplications: () => api.get('/applications'),
  getApplication: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, data) => api.put(`/applications/status/${id}`, data),
  getPendingApplications: () => api.get('/applications/pending'),
  updateApplicationStatus: (id, status, feedback) => 
      api.put(`/applications/status/${id}`, { status, feedback })
};

// Auth APIs
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      toast.success('Login successful');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  register: (userData) => api.post('/auth/register', userData),
  verifyToken: () => api.get('/auth/verify')
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`)
};

export default api; 