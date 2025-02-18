import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { handleApiError } from '../../middleware/errorHandler';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

export const ApplicationDetails = () => {
    const { id } = useParams();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                const data = await fetchWithAuth(`${process.env.REACT_APP_API_URL}/applications/${id}`);
                setApplication(data.application);
            } catch (error) {
                handleApiError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetails();
    }, [id]);

    if (loading) {
        return <LoadingSpinner size="large" />;
    }

    if (!application) {
        return <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-gray-700">Application not found</h2>
            <Link to="/dashboard" className="text-primary hover:underline">Return to Dashboard</Link>
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Details</h2>
                    
                    <div className="space-y-6">
                        {/* Job Details */}
                        <div className="border-b pb-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Job Information</h3>
                            <p className="text-gray-600"><span className="font-medium">Position:</span> {application.jobId?.jobTitle}</p>
                            <p className="text-gray-600"><span className="font-medium">Location:</span> {application.jobId?.location}</p>
                            <p className="text-gray-600"><span className="font-medium">Type:</span> {application.jobId?.employmentType}</p>
                        </div>

                        {/* Candidate Details */}
                        <div className="border-b pb-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Candidate Information</h3>
                            <p className="text-gray-600"><span className="font-medium">Name:</span> {application.candidateId?.userName}</p>
                            <p className="text-gray-600"><span className="font-medium">Email:</span> {application.candidateId?.userEmail}</p>
                        </div>

                        {/* Application Status */}
                        <div className="border-b pb-4">
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">Application Status</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                application.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                                application.status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                        </div>

                        {/* Resume */}
                        {application.resumePath && (
                            <div className="border-b pb-4">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Resume</h3>
                                <a 
                                    href={`${process.env.REACT_APP_API_URL}/${application.resumePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline"
                                >
                                    View Resume
                                </a>
                            </div>
                        )}

                        {/* Application Answers */}
                        {application.answers && application.answers.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Application Questions</h3>
                                <div className="space-y-3">
                                    {application.answers.map((answer, index) => (
                                        <div key={index} className="bg-gray-50 p-3 rounded">
                                            <p className="font-medium text-gray-700">{answer.question}</p>
                                            <p className="text-gray-600 mt-1">{answer.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <Link 
                    to="/dashboard"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition duration-300"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}; 