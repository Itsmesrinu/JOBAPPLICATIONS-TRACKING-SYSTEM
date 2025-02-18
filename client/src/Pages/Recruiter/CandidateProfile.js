import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm, SubmitHandler, set } from "react-hook-form"
import { toast } from 'react-toastify';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { applicationAPI } from '../../utils/api';



export const CandidateProfile = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        
    } = useForm({
        defaultValues: {
            _id: "",
            candidateID: "",
            jobID: "",
            applicationStatus: "",
            applicationForm: [{
                question: "",
                answer: ""
            }],
            candidateFeedback: [{
                question: "",
                answer: ""
            }]
        }
    })

    const { id } = useParams();
    const currRecruiterID = "66733676ab92f179a717d0e9"
    // const index = id;/
    // const id = "667478f128091d0d096071ea"
    const [application, setApplicaton] = useState();
    const [candidate, setCandidate] = useState();
    const [recruiter, setRecruiter] = useState();
    const [job, setJob] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Update API endpoints
                const applicationRes = await fetch(
                    `${process.env.REACT_APP_API_URL}/applications/${id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
                        }
                    }
                );
                const applicationData = await applicationRes.json();
                setApplicaton(applicationData);

                if (applicationData?.candidateId) {
                    const candidateRes = await fetch(
                        `${process.env.REACT_APP_API_URL}/users/${applicationData.candidateId}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('usertoken')}`
                            }
                        }
                    );
                    const candidateData = await candidateRes.json();
                    setCandidate(candidateData);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch candidate data');
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        console.log(id);
        setRecruiter({
            "_id": "6676d2ca4e5a14c58a7216ed",
            "jobID": "6676cb664e5a14c58a721384",
            "recruiterID": "6676b5f64e5a14c58a720ebb",
            "feedbackForm": [
              "Willing to relocate?",
              "Sufficient Experience?",
              "Require sponsorship?",
              "Good fit for the role?"
            ],
            "__v": 0
          },
          {
            "_id": "6676d2ca4e5a14c58a7216f2",
            "jobID": "6676cb664e5a14c58a721384",
            "recruiterID": "6676b5f64e5a14c58a720ebb",
            "feedbackForm": [
              "Willing to relocate?",
              "Sufficient Experience?",
              "Require sponsorship?",
              "Good fit for the role?"
            ],
            "__v": 0
          })
    }, []);

    useEffect(() => {
        setJob({
            "applicationForm": {
                "question": [
                  "Industry 2+ YOE",
                  "Willing to relocate?",
                  "Require visa sponsorship?"
                ],
                "answer": [
                  "Yes",
                  "Yes",
                  "No"
                ]
              },
              "_id": "6676cb664e5a14c58a721384",
              "jobID": "2vek3boglxq4qr35",
              "jobTitle": "DevOps Engineer",
              "employmentType": "Full Time",
              "location": "Mumbai",
              "salary": "16.8",
              "description": "A Dev-Ops engineer is an IT generalist who should have a wide-ranging knowledge of both development and operations, including coding, infrastructure management, system administration, and Dev-Ops tool chains.",
              "applicants": [],
              "__v": 0
            }
        )
    }, [recruiter]);
    
    const onSubmit = async (data) => {
        try {
            const response = await applicationAPI.updateApplicationStatus(
                `${id}`,
                data.applicationStatus,
                data.candidateFeedback
            );

            if (response.success) {
                toast.success('Application status updated successfully');
                navigate('/candidates');
            } else {
                throw new Error(response.message || 'Failed to update application');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.message || 'Failed to update application status');
        }
    };

    const apps = [
        {
            
          },
          
    ]


    return (
        <div className='max-w-scren-2xl  w-full md:w-4/6 lg:w-6/8 container mt-2 mx-auto xl:px-24 px-4 '>
            <div className=' bg-[#efefef] mx-auto py-12 md:px-14 px-8 rounded-lg'>

                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className='flex flex-col lg:flex-row  gap-8'>

                        {/* JOB POSTING DETAILS */}

                            <div className='lg:w-1/2 w-full'>

                                <div>

                                    {
                                        candidate && job &&
                                        <div>
                                        <div>
                                            <div>
                                                <h1 className='text-xl md:text-2xl font-bold'>{candidate.userName}</h1>
                                            </div>
                                            <div className='px-1'>
                                                <h2 className='mt-4 mb-2 font-bold'>Candidate Details</h2>
                                                <p className='text-sm md:text-base text-justify '>Email: {candidate.userEmail}</p>
                                                <p className='text-sm md:text-base text-justify '>Gender: {candidate.gender}</p>
                                                <p className='text-sm md:text-base text-justify '>Address: {candidate.location}</p>
                                            </div>
                                        </div>
                                        
                                         
                                            <div>
                                                <div className='px-1'>
                                                    <h2 className='mt-2 mb-2 font-bold'>Job Details</h2>
                                                    <p className='text-sm md:text-base text-justify '>Job Role: {job.employmentType}</p>
                                                    <p className='text-sm md:text-base text-justify '>Location: {job.location}</p>
                                                    <p className='text-sm md:text-base text-justify '>Salary: {job.salary}</p>
                                                    <p className='text-sm md:text-base text-justify '>Description: {job.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>

                            {
                                application && application.applicationForm &&

                                <div className='px-1'>
                                    <h2 className='mt-2 mb-2 font-bold'>Application Form (R1)</h2>
                                    {application && 
                                        <div className='px-1'>
                                            {apps.applicationForm && application.applicationForm.map((question, index) => (
                                                <div key={index}>
                                                    <p className='text-sm md:text-base text-justify'>Q{index + 1}: {question.question}</p>
                                                    <p className='text-sm md:text-base text-justify'>Response: <span className='font-semibold'>{question.answer}</span></p>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    
                                </div>
                            }
                            </div>
                        
                            
                        {/* CANDIDATE FORM */}
                        <div className='lg:w-1/2 w-full'>
                            <div><h1 className='text-xl font-bold text-center'>Feedback Form</h1></div>

        

                            {/* DYNAMIC BLOCK */}
                            <div>
                                {
                                    recruiter && 
                                    recruiter.feedbackForm.map((question, index) => {
                                        return <RenderQuestion key={index} index={index

                                        } register={register} setValue={setValue} question={question}/>
                                    })
                                }
                            </div>
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-8'>
                        <button type="submit" className='block bg-red-500 text-white text-md py-4 px-16 rounded-md' onClick={() => setValue("applicationStatus", "reject")}>Reject</button>
                        <button type="submit" className='block bg-green-500 text-white text-md py-4 px-16 rounded-md' onClick={() => setValue("applicationStatus", "shortlist")}>Shortlist</button>
                    </div>
                </form>


                {/* <div className='text-center'>
                    <p className='hover:underline text-xs md:text-sm mt-8'>By applying to above job, you agree to our terms and conditions.</p>
                </div> */}
            </div>
        </div>
    )
}

function RenderQuestion({ index, question, setValue, register }) {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 items-center pt-2 md:my-0'>
            <label className='block mt-2 m-1 text-sm'>{index + 1}. {question}</label>
        {/* <input {...register(`candidateFeedback.${index}.question`)} type="hidden" value={question} /> */}
            <div className='grid grid-cols-2 items-center justify-items-center'>
                <div className='flex'>
                    <input {...register(`candidateFeedback.${index}.answer`, { required: true })} type="radio" value="Yes" className='mx-2' />
                    <p>Yes</p>
                </div>
                <div className='flex'>
                    <input {...register(`candidateFeedback.${index}.answer`, { required: true })} type="radio" value="No" className='mx-2' />
                    <p>No</p>
                </div>
            </div>
        </div>
    );
}
