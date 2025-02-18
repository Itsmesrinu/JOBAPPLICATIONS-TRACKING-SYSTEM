import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import LogoURL from '../../assets/img/logo.jpeg';
import { useForm } from 'react-hook-form';
import { SimilarJobs } from '../SimilarJobs';
import { LoginContext } from '../../components/ContextProvider/Context';
import { toast } from 'react-toastify';
import 'boxicons/css/boxicons.min.css';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loginData } = useContext(LoginContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [applicants, setApplicants] = useState();
    const [file, setFile] = useState();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            candidateID: "",
            jobID: "",
            applicationStatus: "active",
            resume: null,
            applicationForm: [{
                question: "",
                answer: ""
            }],
            candidateFeedback: [{
                question: "",
                answer: ""
            }]
        }
    });

    const randomNum = Math.floor(Math.random() * (200 - 20 + 1) + 20);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/current-job/${id}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }

                const data = await response.json();
                if (data.success) {
                    setJob(data.job);
                } else {
                    throw new Error(data.message || 'Failed to fetch job details');
                }
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
                toast.error('Failed to fetch job details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    useEffect(() => {
        if (job && job.applicants && job.applicants.length > 0) {
            const fetchApplicantsData = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/users/all-users`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error('Failed to fetch applicants data');
                    }
                    const data = await response.json();

                    const filteredApplicants = data.filter(app => {
                        return job.applicants.some(jobApplicant => jobApplicant.applicant === app._id);
                    });

                    setApplicants(filteredApplicants);
                    console.log(filteredApplicants);
                } catch (error) {
                    console.error('Error fetching applicants data:', error);
                    toast.error('Error fetching applicants data');
                }
            };

            fetchApplicantsData();
        }
    }, [job]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.includes('pdf')) {
                toast.error('Please upload a PDF file');
                event.target.value = ''; // Clear the input
                return;
            }
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                event.target.value = ''; // Clear the input
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleApplicationSubmit = async (e) => {
        e.preventDefault();
        
        if (!loginData) {
            toast.error('Please login first');
            navigate('/login');
            return;
        }

        if (!selectedFile) {
            toast.error('Please upload your resume');
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);
            formData.append('jobId', id);

            const token = localStorage.getItem('usertoken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/apply`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to submit application');
            }

            const result = await response.json();
            if (result.success) {
                toast.success('Application submitted successfully');
                navigate('/my-jobs');
            } else {
                throw new Error(result.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
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

        if (!job || !job._id) {
            toast.error('Job details not available');
            return;
        }

        navigate(`/applications/submit/${job._id}`);
    };

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner size="large" />
        </div>;
    }

    if (error) {
        return <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-red-600">{error}</h2>
            <button 
                onClick={() => navigate('/all-posted-jobs')}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
            >
                Back to Jobs
            </button>
        </div>;
    }

    if (!job) {
        return <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-gray-700">Job not found</h2>
            <button 
                onClick={() => navigate('/all-posted-jobs')}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
            >
                Back to Jobs
            </button>
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">{job.jobTitle}</h1>
                    <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                            <i className="bx bx-buildings mr-2"></i>
                            <span>{job.employerId?.companyName}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <i className="bx bx-map mr-2"></i>
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

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h2>
                        <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={handleApply}
                            className="bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition duration-300"
                        >
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
