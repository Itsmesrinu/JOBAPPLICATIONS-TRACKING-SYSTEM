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
            
            if (data.resume && data.resume[0]) {
                formData.append('resume', data.resume[0]);
            }

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
                navigate('/dashboard');
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
        <div className='max-w-screen-2xl w-full md:w-4/6 lg:w-1/2 container mt-2 mx-auto xl:px-24 px-4'>
            {/* Company and Job Details Section */}
            <div className='bg-white shadow-lg rounded-lg p-6 mb-6'>
                <h1 className='text-2xl font-bold text-gray-800 mb-4'>{job.jobTitle}</h1>
                <div className='space-y-3'>
                    <div className='flex items-center text-gray-600'>
                        <i className='bx bx-buildings mr-2'></i>
                        <span>{job.employerId?.companyName}</span>
                    </div>
                    <div className='flex items-center text-gray-600'>
                        <i className='bx bx-map mr-2'></i>
                        <span>{job.location}</span>
                    </div>
                    <div className='flex items-center text-gray-600'>
                        <i className='bx bx-time mr-2'></i>
                        <span>{job.employmentType}</span>
                    </div>
                    <div className='flex items-center text-gray-600'>
                        <i className='bx bx-money mr-2'></i>
                        <span>{job.salary}</span>
                    </div>
                </div>
            </div>

            {/* Application Form Section */}
            <div className='bg-[#e7e7e7] mx-auto py-6 px-6 md:px-16 rounded-lg'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <h2 className='text-xl font-bold mb-4'>Application Form</h2>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Resume (PDF only)
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            {...register('resume', { required: 'Resume is required' })}
                            className="w-full p-2 border rounded-md"
                        />
                        {errors.resume && <ErrorMessage message={errors.resume.message} />}
                    </div>

                    {job?.applicationForm?.questions && (
                        <div>
                            <h2 className='text-lg font-semibold mb-4'>Screening Questions</h2>
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
                    )}

                    <div className='flex justify-center mt-8'>
                        <button 
                            type="submit"
                            disabled={loading}
                            className='bg-primary text-white px-8 py-3 rounded-md hover:bg-opacity-90 transition duration-300 disabled:opacity-50'
                        >
                            {loading ? <LoadingSpinner size="small" /> : 'Submit Application'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

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
