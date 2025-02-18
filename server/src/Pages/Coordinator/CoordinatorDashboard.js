import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'boxicons/css/boxicons.min.css';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

const RenderTableRows = ({ job, recruiters, onAssign }) => {
    const [selectedRecruiter, setSelectedRecruiter] = useState('');
    const [isApproving, setIsApproving] = useState(false);
    const tableDataCss = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";

    const handleApprove = async () => {
        if (!selectedRecruiter) {
            toast.error('Please select a recruiter');
            return;
        }
        try {
            setIsApproving(true);
            await onAssign(job._id, selectedRecruiter);
            setSelectedRecruiter('');
        } catch (error) {
            toast.error('Failed to assign recruiter');
        } finally {
            setIsApproving(false);
        }
    };

    return (
        <tr>
            <th className={`${tableDataCss} text-left text-blueGray-700`}>
                {job.jobTitle}
            </th>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {job.employmentType}
            </td>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {job.location}
            </td>
            <td className={tableDataCss}>
                <select 
                    className='w-full p-2 border rounded'
                    value={selectedRecruiter}
                    onChange={(e) => setSelectedRecruiter(e.target.value)}
                >
                    <option value="">Select Recruiter</option>
                    {recruiters.map((recruiter) => (
                        <option key={recruiter._id} value={recruiter._id}>
                            {recruiter.userName}
                        </option>
                    ))}
                </select>
            </td>
            <td className={tableDataCss}>
                <button
                    onClick={handleApprove}
                    className={`block ${
                        isApproving ? 'bg-gray-500' : 'bg-primary'
                    } text-white mx-auto text-md py-2 px-5 md:px-6 rounded-md hover:bg-primary/80 transition-all`}
                    disabled={!selectedRecruiter || isApproving}
                >
                    {isApproving ? 'Approving...' : 'Approve'}
                </button>
            </td>
        </tr>
    );
};

export const CoordinatorDashboard = () => {
    const tableHeaderCss = "px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left"

    const [jobs, setJobs] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('jobs'); // ['jobs', 'shortlisted', 'recruiters']
    const [data, setData] = useState([]);

    const fetchRecruiters = async () => {
        try {
            const token = localStorage.getItem('usertoken');
            const response = await fetch(`${process.env.REACT_APP_API_URL}/users/recruiters`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recruiters');
            }

            const data = await response.json();
            setRecruiters(data);
        } catch (error) {
            console.error('Error fetching recruiters:', error);
            toast.error('Failed to fetch recruiters');
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            let endpoint;
            
            switch (activeTab) {
                case 'jobs':
                    endpoint = '/jobs/pending';
                    break;
                case 'shortlisted':
                    endpoint = '/applications/shortlisted';
                    break;
                case 'recruiters':
                    endpoint = '/users/recruiters';
                    break;
                default:
                    endpoint = '/jobs/pending';
            }

            const response = await fetchWithAuth(
                `${process.env.REACT_APP_API_URL}${endpoint}`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();
            setData(result.data || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        fetchRecruiters();
    }, [activeTab]);

    const handleRecruiterAssignment = async (jobId, recruiterId) => {
        try {
            const response = await fetchWithAuth(
                `${process.env.REACT_APP_API_URL}/jobs/assign-recruiter`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ jobId, recruiterId }),
                }
            );

            if (response.success) {
                toast.success('Recruiter assigned successfully');
                fetchData(); // Refresh the data
            } else {
                toast.error(response.message || 'Failed to assign recruiter');
            }
        } catch (error) {
            console.error('Error assigning recruiter:', error);
            toast.error('Failed to assign recruiter');
        }
    };

    const handleRecruiterApproval = async (recruiterId) => {
        try {
            const response = await fetchWithAuth(
                `${process.env.REACT_APP_API_URL}/users/approve-recruiter`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ recruiterId }),
                }
            );

            if (response.success) {
                toast.success('Recruiter approved successfully');
                fetchData(); // Refresh the data
            } else {
                throw new Error(response.message || 'Failed to approve recruiter');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to approve recruiter');
        }
    };

    if (loading) {
        return <LoadingSpinner size="large" />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Navigation Tabs */}
            <div className="flex justify-center mb-8 border-b">
                <button
                    className={`px-4 py-2 ${activeTab === 'jobs' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('jobs')}
                >
                    Pending Jobs
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'shortlisted' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('shortlisted')}
                >
                    Shortlisted Candidates
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'recruiters' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('recruiters')}
                >
                    Recruiters
                </button>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderContent()}
            </div>
        </div>
    );

    function renderContent() {
        switch (activeTab) {
            case 'shortlisted':
                return data.map(application => (
                    <div key={application._id} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">{application.candidateId.userName}</h3>
                        <p className="text-gray-600 mb-2">Job: {application.jobId.jobTitle}</p>
                        <p className="text-gray-600 mb-4">Status: {application.status}</p>
                        <Link 
                            to={`/applications/${application._id}`}
                            className="text-primary hover:underline"
                        >
                            View Details
                        </Link>
                    </div>
                ));
            case 'jobs':
                return jobs.map(job => (
                    <div key={job._id} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">{job.jobTitle}</h3>
                        <p className="text-gray-600 mb-4">{job.location}</p>
                        <Link 
                            to={`/coordinator/assign-recruiter/${job._id}`}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
                        >
                            Assign Recruiter
                        </Link>
                    </div>
                ));
            case 'recruiters':
                return recruiters.map(recruiter => (
                    <div key={recruiter._id} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-2">{recruiter.userName}</h3>
                        <p className="text-gray-600 mb-2">Email: {recruiter.userEmail}</p>
                        <p className="text-gray-600 mb-4">Status: {recruiter.status || 'Pending'}</p>
                        <button
                            onClick={() => handleRecruiterApproval(recruiter._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Approve Recruiter
                        </button>
                    </div>
                ));
        }
    }
};