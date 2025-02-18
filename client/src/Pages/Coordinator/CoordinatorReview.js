import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const CoordinatorReview = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await fetchWithAuth(
                `${process.env.REACT_APP_API_URL}/applications/pending`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch applications');
            }

            const result = await response.json();
            setApplications(result.applications || []);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (applicationId, recruiterId, action) => {
        try {
            const response = await fetchWithAuth(
                `${process.env.REACT_APP_API_URL}/applications/${applicationId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        status: action === 'approve' ? 'approved' : 'rejected',
                        recruiterId 
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to ${action} application`);
            }

            toast.success(`Application ${action}d successfully`);
            fetchApplications();
        } catch (error) {
            toast.error(error.message || `Failed to ${action} application`);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
            <div className="py-10">
                <h2 className="text-2xl font-bold mb-6">Pending Applications Review</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Job Title
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Recruiter
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {applications.map((app) => (
                                <tr key={app._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {app.jobTitle}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {app.recruiterName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                              app.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                              'bg-red-100 text-red-800'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {app.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleApproval(app._id, app.recruiterId, 'approve')}
                                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleApproval(app._id, app.recruiterId, 'reject')}
                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}; 