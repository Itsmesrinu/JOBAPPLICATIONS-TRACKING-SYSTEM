import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoginContext } from '../components/ContextProvider/Context';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SubmitApplication = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loginData } = useContext(LoginContext);
    const [loading, setLoading] = useState(true);
    const [job, setJob] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/current-job/${id}`);
                const data = await response.json();
                
                if (data.success) {
                    setJob(data.job);
                } else {
                    throw new Error(data.message || 'Failed to fetch job details');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to fetch job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.includes('pdf')) {
                toast.error('Please upload a PDF file');
                e.target.value = '';
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                e.target.value = '';
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error('Please upload your resume');
            return;
        }

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('resume', selectedFile);
            formData.append('jobId', id);
            formData.append('candidateId', loginData._id);

            const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
                },
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                toast.success('Application submitted successfully');
                navigate('/dashboard');
            } else {
                throw new Error(data.message || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!job) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold text-gray-700">Job not found</h2>
                <button onClick={() => navigate('/all-posted-jobs')} className="mt-4 text-primary hover:underline">
                    Back to Jobs
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit Application</h1>
                    
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">{job.jobTitle}</h2>
                        <p className="text-gray-600">{job.employerId?.companyName}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Resume (PDF only, max 5MB)
                            </label>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="w-full border border-gray-300 rounded-md p-2"
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/current-job/${id}`)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 disabled:opacity-50"
                            >
                                {submitting ? <LoadingSpinner size="small" /> : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}; 