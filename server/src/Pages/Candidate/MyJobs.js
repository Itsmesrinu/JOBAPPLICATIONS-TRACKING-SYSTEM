import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { LoginContext } from '../../components/ContextProvider/Context';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const MyJobs = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { loginData } = useContext(LoginContext);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/applications/user/${loginData?._id}`);
                const data = await response.json();
                
                if (data.success) {
                    setApplications(data.applications);
                } else {
                    throw new Error(data.message || 'Failed to fetch applications');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to fetch applications');
            } finally {
                setLoading(false);
            }
        };

        if (loginData?._id) {
            fetchApplications();
        }
    }, [loginData?._id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <LoadingSpinner />
        </div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My Applications</h1>
            
            {applications.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-600">You haven't applied to any jobs yet.</p>
                    <Link 
                        to="/all-posted-jobs"
                        className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
                    >
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {applications.map((application) => (
                                <RenderTableRows key={application._id} application={application} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

function RenderTableRows({ application }) {
    const tableDataCss = "border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4";
    
    return (
        <tr>
            <th className={`${tableDataCss} text-left text-blueGray-700 px-3 md:px-6`}>
                {application.jobId?.jobTitle}
            </th>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {application.jobId?.employmentType}
            </td>
            <td className={`${tableDataCss} hidden md:table-cell`}>
                {application.jobId?.location}
            </td>
            <td className={`${tableDataCss} font-bold`}>
                <span className={`px-2 py-1 rounded ${
                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
            </td>
        </tr>
    );
}