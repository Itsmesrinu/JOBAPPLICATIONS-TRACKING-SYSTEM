import React, { useState, useEffect, useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { handleApiError } from '../../middleware/errorHandler';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { applicationAPI } from '../../utils/api'
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { LoginContext } from '../../components/ContextProvider/Context';
//import User from '../../models/User.js'; // Import the User model from the models directory

// Main component for the application form
export const ApplicationForm = () => {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { loginData } = useContext(LoginContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    // Fetch job details when the component mounts or jobId changes
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setPageLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/current-job/${jobId}`);
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
                toast.error('Failed to fetch job details');
            } finally {
                setPageLoading(false);
            }
        };

        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId]);

    // Function to handle form submission
    const onSubmit = async (data) => {
        try {
            setLoading(true);
            
            if (!loginData?._id) {
                toast.error('Please login to apply');
                navigate('/login');
                return;
            }

            const formData = new FormData();
            formData.append('jobId', jobId);
            formData.append('candidateId', loginData._id);
            
            // Handle resume file
            if (data.resume && data.resume[0]) {
                const file = data.resume[0];
                // Validate file type and size
                if (!file.type.includes('pdf')) {
                    toast.error('Please upload a PDF file');
                    return;
                }
                if (file.size > 5 * 1024 * 1024) {
                    toast.error('File size should be less than 5MB');
                    return;
                }
                formData.append('resume', file);
            }

            // Handle application form questions if they exist
            if (job?.applicationForm?.questions) {
                const answers = job.applicationForm.questions.map((question, index) => ({
                    question: question.text,
                    answer: data.applicationForm[index].answer
                }));
                formData.append('answers', JSON.stringify(answers));
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/submit-application`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
                },
                body: formData
            });

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
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <LoadingSpinner size="large" />
        </div>;
    }

    if (!job) {
        return <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-red-600">Job not found</h2>
            <button 
                onClick={() => navigate('/all-posted-jobs')}
                className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
            >
                Back to Jobs
            </button>
        </div>;
    }

    return (
        <div className='max-w-screen-2xl mx-auto px-4 py-8'>
            {/* Job Details Card */}
            <div className='bg-white shadow-lg rounded-lg p-6 mb-8'>
                <h1 className='text-2xl font-bold text-gray-800 mb-4'>{job?.jobTitle}</h1>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-3'>
                        <div className='flex items-center text-gray-600'>
                            <i className='bx bx-buildings mr-2'></i>
                            <span>{job?.employerId?.companyName}</span>
                        </div>
                        <div className='flex items-center text-gray-600'>
                            <i className='bx bx-map mr-2'></i>
                            <span>{job?.location}</span>
                        </div>
                        <div className='flex items-center text-gray-600'>
                            <i className='bx bx-time mr-2'></i>
                            <span>{job?.employmentType}</span>
                        </div>
                        <div className='flex items-center text-gray-600'>
                            <i className='bx bx-money mr-2'></i>
                            <span>{job?.salary}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className='font-semibold text-gray-700 mb-2'>Job Description:</h3>
                        <p className='text-gray-600 whitespace-pre-line'>{job?.description}</p>
                    </div>
                </div>
            </div>

            {/* Application Form Card */}
            <div className='bg-white shadow-lg rounded-lg p-6'>
                <h2 className='text-xl font-bold mb-6 text-center'>Submit Your Application</h2>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Resume Upload Section */}
                    <div className="p-4 border rounded-lg bg-gray-50">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Resume (PDF only, max 5MB)
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            {...register('resume', { required: 'Resume is required' })}
                            className="w-full p-2 border rounded-md bg-white"
                        />
                        {errors.resume && <ErrorMessage message={errors.resume.message} />}
                    </div>

                    {/* Screening Questions Section */}
                    {job?.applicationForm?.questions && (
                        <div className="p-4 border rounded-lg bg-gray-50">
                            <h3 className='text-lg font-semibold mb-4'>Screening Questions</h3>
                            <div className='space-y-4'>
                                {job.applicationForm.questions.map((question, index) => (
                                    <RenderQuestion 
                                        key={index} 
                                        index={index} 
                                        question={question.text} 
                                        register={register}
                                        errors={errors}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className='flex justify-end space-x-4'>
                        <button
                            type="button"
                            onClick={() => navigate(`/current-job/${jobId}`)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className='bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition duration-300 disabled:opacity-50'
                        >
                            {loading ? <LoadingSpinner size="small" /> : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Component to render each screening question
function RenderQuestion({ index, question, register, errors }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 items-center pt-2 md:my-0'>
            <label className='block mt-2 m-1 text-sm'>
                {index + 1}. {question}
            </label>
            <div className='grid grid-cols-2 items-center justify-items-center'>
                <div className='flex'>
                    <input 
                        {...register(`applicationForm.${index}.answer`, { 
                            required: 'This question is required' 
                        })} 
                        type="radio" 
                        value="Yes" 
                        className='mx-2'
                    />
                    <p>Yes</p>
                </div>
                <div className='flex'>
                    <input 
                        {...register(`applicationForm.${index}.answer`, { 
                            required: 'This question is required' 
                        })} 
                        type="radio" 
                        value="No" 
                        className='mx-2'
                    />
                    <p>No</p>
                </div>
            </div>
            {errors.applicationForm?.[index]?.answer && (
                <span className="text-red-500 text-sm col-span-2 text-center mt-1">
                    {errors.applicationForm[index].answer.message}
                </span>
            )}
        </div>
    );
}
