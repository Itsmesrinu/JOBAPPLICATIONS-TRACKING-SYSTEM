import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginContext } from '../components/ContextProvider/Context';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import logoURL from '../assets/img/logo.jpeg';

export const JobDetails = () => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasApplied, setHasApplied] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { loginData } = useContext(LoginContext);

    useEffect(() => {
        fetchJobDetails();
        checkApplicationStatus();
    }, [id, loginData]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/current-job/${id}`);
            const data = await response.json();

            if (data.success) {
                setJob(data.job);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch job details');
        } finally {
            setLoading(false);
        }
    };

    const checkApplicationStatus = async () => {
        if (!loginData?._id) return;
        
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/applications/status/${id}/${loginData._id}`
            );
            const data = await response.json();
            setHasApplied(data.hasApplied);
        } catch (error) {
            console.error('Error checking application status:', error);
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
        if (hasApplied) {
            toast.info('You have already applied for this job');
            return;
        }
        navigate(`/applications/submit/${id}`);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            {job && (
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
                        <div className="mt-6 flex justify-end">
                            {loginData?.role === 'candidate' && !hasApplied && (
                                <button
                                    onClick={handleApply}
                                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                                >
                                    Apply Now
                                </button>
                            )}
                            {hasApplied && (
                                <span className="text-green-600 font-medium">
                                    You have already applied for this job
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}; 