import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AssignRecruiter = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [recruiters, setRecruiters] = useState([]);
    const [questions, setQuestions] = useState([{ question: '' }]);
    const [questionSize, setQuestionSize] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            recruiterID: ''
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('usertoken');
                if (!token) {
                    toast.error('Please login first');
                    navigate('/login');
                    return;
                }

                const [jobResponse, recruitersResponse] = await Promise.all([
                    fetch(`${process.env.REACT_APP_API_URL}/jobs/job/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                    fetch(`${process.env.REACT_APP_API_URL}/users/recruiters`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                ]);

                if (!jobResponse.ok || !recruitersResponse.ok) {
                    throw new Error('Failed to fetch data');
                }

                const jobData = await jobResponse.json();
                const recruitersData = await recruitersResponse.json();

                // Filter out already assigned recruiters
                const availableRecruiters = recruitersData.filter(recruiter => !recruiter.isAssigned);

                setJob(jobData);
                setRecruiters(availableRecruiters);
            } catch (error) {
                console.error('Error:', error);
                toast.error(error.message || 'Failed to fetch data');
                navigate('/coordinator/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const addQuestion = () => {
        if (questionSize < 4) {
            setQuestionSize(prev => prev + 1);
            setQuestions(prev => [...prev, { question: '' }]);
        }
    };

    const handleDeleteQuestion = (index) => {
        setQuestions(prev => prev.filter((_, qIndex) => qIndex !== index));
        setQuestionSize(prev => prev - 1);
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].question = value;
        setQuestions(newQuestions);
    };

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('usertoken');
            if (!token) {
                toast.error('Please login first');
                navigate('/login');
                return;
            }

            // Validate questions
            const validQuestions = questions.filter(q => q.question.trim() !== '');
            if (validQuestions.length === 0) {
                toast.error('Please add at least one feedback question');
                return;
            }

            // First create recruiter assignment
            const recruiterResponse = await fetch(`${process.env.REACT_APP_API_URL}/recruiter/add-recruiter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'credentials': 'include'
                },
                body: JSON.stringify({
                    jobID: job._id,
                    recruiterID: data.recruiterID,
                    feedbackForm: validQuestions.map(q => q.question)
                })
            });

            if (!recruiterResponse.ok) {
                const errorData = await recruiterResponse.json();
                throw new Error(errorData.message || 'Failed to assign recruiter');
            }

            // Update job status
            const jobResponse = await fetch(`${process.env.REACT_APP_API_URL}/jobs/update-job/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'credentials': 'include'
                },
                body: JSON.stringify({
                    status: 'approved',
                    recruiterID: data.recruiterID,
                    isAssigned: true
                })
            });

            if (!jobResponse.ok) {
                const errorData = await jobResponse.json();
                throw new Error(errorData.message || 'Failed to update job status');
            }

            toast.success('Recruiter assigned successfully');
            navigate('/coordinator/dashboard');

        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to assign recruiter');
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (!job) {
        return <div className="text-center py-10">Job not found</div>;
    }

    return (
        <div className='max-w-screen-2xl w-full md:w-4/6 lg:w-6/8 container mt-2 mx-auto xl:px-24 px-4'>
            <div className='bg-[#e7e7e7] py-8 px-4 lg:px-16 rounded-lg'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Job Details */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Job Details</h2>
                        <p><strong>Title:</strong> {job.jobTitle}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Type:</strong> {job.employmentType}</p>
                    </div>

                    {/* Recruiter Selection */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Select Recruiter</h2>
                        <select
                            {...register("recruiterID", { required: "Please select a recruiter" })}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select a recruiter</option>
                            {recruiters.map((recruiter) => (
                                <option key={recruiter._id} value={recruiter._id}>
                                    {recruiter.userName}
                                </option>
                            ))}
                        </select>
                        {errors.recruiterID && (
                            <p className="text-red-500 text-sm mt-1">{errors.recruiterID.message}</p>
                        )}
                    </div>

                    {/* Feedback Questions */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Feedback Questions</h2>
                        {questions.map((q, index) => (
                            <div key={index} className="mb-4 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={q.question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    placeholder={`Question ${index + 1}`}
                                    className="w-full p-2 border rounded"
                                />
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteQuestion(index)}
                                        className="text-red-500"
                                    >
                                        <i className="bx bx-trash"></i>
                                    </button>
                                )}
                            </div>
                        ))}
                        {questionSize < 4 && (
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="text-primary hover:text-primary/80"
                            >
                                + Add Question
                            </button>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className='flex justify-center mt-8'>
                        <button
                            type="submit"
                            className='block bg-primary text-white text-md py-4 px-16 rounded-md hover:bg-primary/80 transition-all'
                        >
                            Assign Recruiter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
