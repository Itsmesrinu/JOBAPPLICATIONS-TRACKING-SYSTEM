import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { handleApiError } from '../../middleware/errorHandler';
import { toast } from 'react-toastify';
import { jobAPI } from '../../utils/api';
import logoURL from '../../assets/img/logo.jpeg'
import 'boxicons/css/boxicons.min.css';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const FeaturedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await jobAPI.getAllJobs();
            
            if (response && response.success && Array.isArray(response.jobs)) {
                const activeJobs = response.jobs
                    .filter(job => job.status === 'active')
                    .slice(0, 3);
                setJobs(activeJobs);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setError(error.message);
            toast.error('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner size="large" />;
    }

    if (!jobs.length) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-600">No jobs available at the moment.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-600">Error loading jobs: {error}</p>
                <button 
                    onClick={() => {
                        setError(null);
                        fetchJobs();
                    }}
                    className="mt-4 bg-secondary text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <img 
                                src={logoURL} 
                                alt={job.employerId?.companyName || 'Company'} 
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{job.jobTitle}</h3>
                                <p className="text-gray-600">{job.employerId?.companyName}</p>
                            </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600">
                                <i className="bx bx-map-pin mr-2"></i>
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <i className="bx bx-time mr-2"></i>
                                <span>{job.employmentType}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <i className="bx bx-money mr-2"></i>
                                <span>{job.salary}</span>
                            </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                Posted {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                            <Link 
                                to={`/current-job/${job._id}`}
                                className="bg-secondary text-white px-4 py-2 rounded hover:bg-opacity-90 transition duration-300"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

function Card({ job }) {
    return (
        <div className='border shadow-lg card'>
            <div className='flex items-center gap-3'>
                <div>
                    <img src={logoURL} alt={job.companyName} className='w-12 rounded-full' />
                </div>
                <div>
                    <div className='flex items-center'>
                        <i className='bx bx-time text-lg'></i>
                        <span className='pl-1'>{job.employmentType}</span>
                    </div>
                    <h1 className='font-bold text-md lg:text-lg'>{job.jobTitle}</h1>
                </div>
            </div>
            <div>
                <p className='text-sm py-4'>{job.description}</p>
            </div>
            <div className='flex justify-between items-center'>
                <div className='flex justify-center items-center'>
                    <i className='bx bx-map text-lg'></i>
                    <span className='pl-2'>{job.location}</span>
                </div>
                <Link to={`/current-job/${job._id}`}>
                    <button className='hidden lg:block bg-primary text-white text-sm py-1 px-4 rounded-md'>
                        Apply Now
                    </button>
                </Link>
            </div>
        </div>
    )
}