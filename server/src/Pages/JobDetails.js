import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginContext } from '../components/ContextProvider/Context';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import logoURL from '../assets/img/logo.jpeg';

export const JobDetails = () => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const { loginData } = useContext(LoginContext);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/current-job/${id}`);
            const data = await response.json();

            if (data.success) {
                setJob(data.job);
            } else {
                throw new Error(data.message || 'Failed to fetch job details');
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
            setError(error.message);
            toast.error('Failed to fetch job details');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = () => {
        if (!loginData) {
            toast.error('Please login to apply');
            navigate('/login');
            return;
        }
        if (loginData.role !== 'candidate') {
            toast.error('Only candidates can apply for jobs');
            return;
        }
        navigate(`/applications/submit/${id}`);
    };

    if (loading) return <LoadingSpinner size="large" />;

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-600">Error: {error}</p>
                <button 
                    onClick={fetchJobDetails}
                    className="mt-4 bg-primary text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-600">Job not found</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center gap-4 mb-6">
                    <img 
                        src={logoURL} 
                        alt={job.employerId?.companyName || 'Company'} 
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{job.jobTitle}</h1>
                        <p className="text-lg text-gray-600">{job.employerId?.companyName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="flex items-center text-gray-600">
                        <i className="bx bx-map-pin mr-2 text-xl"></i>
                        <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <i className="bx bx-time mr-2 text-xl"></i>
                        <span>{job.employmentType}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                        <i className="bx bx-money mr-2 text-xl"></i>
                        <span>{job.salary}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">Job Description</h2>
                    <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
                </div>

                {job.applicationForm && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">Application Requirements</h2>
                        <ul className="list-disc list-inside text-gray-600">
                            {job.applicationForm.map((field, index) => (
                                <li key={index}>{field.label}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <span className="text-gray-500">
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                    {loginData?.role === 'candidate' && job.status === 'active' && (
                        <button
                            onClick={handleApply}
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition duration-300"
                        >
                            Apply Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}; 