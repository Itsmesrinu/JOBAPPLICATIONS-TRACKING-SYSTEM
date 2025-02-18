import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { applicationAPI } from '../../utils/api'
import { fetchWithAuth } from '../../utils/fetchWithAuth'
import { LoadingSpinner } from '../../components/common/LoadingSpinner'

export const RecruiterDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPendingApplications = async () => {
            try {
                const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/applications/pending`);
                if (response.success) {
                    setApplications(response.applications);
                }
            } catch (error) {
                toast.error('Failed to fetch pending applications');
            } finally {
                setLoading(false);
            }
        };

        fetchPendingApplications();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Review Dashboard</h1>
            
            {applications.length === 0 ? (
                <p className="text-gray-500">No pending applications to review.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map((application) => (
                        <div key={application._id} className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold mb-2">
                                {application.jobId?.jobTitle}
                            </h2>
                            <p className="text-gray-600 mb-2">
                                Candidate: {application.candidateId?.userName}
                            </p>
                            <p className="text-gray-500 mb-4">
                                Status: {application.status}
                            </p>
                            <button
                                onClick={() => navigate(`/recruiter/applications/${application._id}`)}
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
                            >
                                Review Application
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function HandlerDeleteJob(id) {
    console.log("delete job");
}
function HandlerUpdateJob(id) {
    console.log("delete job");
}

function RenderTableRows({ applicant }) {
    // console.log("called");
    // console.log(applicant._id);
    const tableDataCss = "border-t-0 px-4 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-center"
    return (

        <tr>
            <th className={`${tableDataCss} text-left text-blueGray-700 px-3 md:px-6`}>
                {applicant.userName}
            </th>
            <td className={`${tableDataCss}`}>
                <Link to={`/candidate/${applicant._id}`} >
                    <button className='block bg-primary text-white mx-auto text-md py-2  px-5 md:px-6 rounded-md'> Review</button>
                </Link>
            </td>
        </tr>
    )
}