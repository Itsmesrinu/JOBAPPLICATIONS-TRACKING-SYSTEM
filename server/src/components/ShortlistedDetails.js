import React from 'react'
import { useState, useEffect } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import { Link, useParams } from 'react-router-dom'

export const ShortlistedDetails = () => {

    const {candidate_id, job_id} = useParams();
    const [candidate, setCandidate] = useState();
    const [application, setApplication] = useState();

    const [job, setJob] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Update API endpoints
                const candidateRes = await fetch(`${process.env.REACT_APP_API_URL}/users/${candidate_id}`);
                const candidateData = await candidateRes.json();
                setCandidate(candidateData);

                const applicationRes = await fetch(
                    `${process.env.REACT_APP_API_URL}/applications/candidate/${candidate_id}/job/${job_id}`
                );
                const applicationData = await applicationRes.json();
                setApplication(applicationData);

                const jobRes = await fetch(`${process.env.REACT_APP_API_URL}/jobs/${job_id}`);
                const jobData = await jobRes.json();
                setJob(jobData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
        fetchData();
    }, [candidate_id, job_id]);

    return (
        <div className='max-w-scren-2xl w-full md:w-4/6 lg:w-1/2 container mt-2 mx-auto xl:px-24 px-4 '>
            <div className=' bg-[#e7e7e7] mx-auto py-6 px-6 md:px-16 rounded-lg'>

                {/* FORM */}

                    <div className='flex flex-col lg:flex-row  gap-8'>

                        {/* JOB POSTING DETAILS */}
                        <div className='w-full'>

                            <div>

                                    {
                                        candidate && job && application &&
                                        <div className='grid grid-cols-1 gap-4 mt-4'>
                                            <div>
                                                <h1 className='italic text-md md:text-lg font-bold text-gray-500'>Applicant Details</h1>
                                                <div className='px-1'>
                                                    <h2 className='text-lg font-bold '>{candidate.userName}</h2>
                                                    <p className='text-sm md:text-base text-justify '>Email: {candidate.userEmail}</p>
                                                    <p className='text-sm md:text-base text-justify '>Gender: {candidate.gender}</p>
                                                    <p className='text-sm md:text-base text-justify '>Address: {candidate.address}</p>
                                                    <p className='text-sm md:text-base text-justify '>Resume: {candidate.address}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <h1 className='italic text-md md:text-lg font-bold text-gray-500'>Job Role Details</h1>
                                                <div className='px-1'>
                                                    <h2 className='text-md font-bold'>Role : {job.jobTitle}</h2>
                                                    <p className='text-sm md:text-base text-justify '>Location: {job.location}</p>
                                                    <p className='text-sm md:text-base text-justify '>Type: {job.employmentType}</p>
                                                    <p className='text-sm md:text-base text-justify '>Salary: {job.salary}</p>
                                                    <p className='text-sm md:text-base text-justify '>Description: {job.description}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <h1 className='italic text-md md:text-lg font-bold text-gray-500'>Candidate Feedback</h1>
                                                <div className='px-1'>
                                                    {application.candidateFeedback.map((feedback, index) => (
                                                        <div key={index}>
                                                            <p className='text-sm md:text-base text-justify'>{feedback.question}: {feedback.answer}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                         
                                    }
                                </div>

                        </div>
                    </div>

                <div className='text-center mt-8 mb-4'>
                    <Link to={`/shortlist`}>
                    
                        <button className='block bg-primary text-white mx-auto text-md py-2  px-5 md:px-6 rounded-md'>
                            {`< Back`}
                        
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
