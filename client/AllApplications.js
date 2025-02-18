import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { fetchWithAuth } from './utils/fetchWithAuth';

export const AllApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllApplications = async () => {
            try {
                const response = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/applications/recruiter`);
                if (response.success) {
                    setApplications(response.applications);
                }
            } catch (error) {
                toast.error('Failed to fetch applications');
            } finally {
                setLoading(false);
            }
        };

        fetchAllApplications();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">All Applications</h1>
            
            {applications.length === 0 ? (
                <p className="text-gray-500">No applications found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-6 py-3 text-left">Candidate</th>
                                <th className="px-6 py-3 text-left">Job Title</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((application) => (
                                <tr key={application._id} className="border-b">
                                    <td className="px-6 py-4">
                                        {application.candidateId?.userName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {application.jobId?.jobTitle}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded ${
                                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {application.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => navigate(`/recruiter/applications/${application._id}`)}
                                            className="text-primary hover:underline"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};