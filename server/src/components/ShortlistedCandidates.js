import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingSpinner } from './common/LoadingSpinner';
import { fetchWithAuth } from '../utils/fetchWithAuth';

export const ShortlistedCandidates = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);
                const response = await fetchWithAuth(
                    `${process.env.REACT_APP_API_URL}/applications/shortlisted`
                );
                
                if (response.success) {
                    setApplications(response.applications);
                } else {
                    throw new Error(response.message || 'Failed to fetch candidates');
                }
            } catch (error) {
                toast.error(error.message || 'Error fetching candidates');
            } finally {
                setLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Shortlisted Candidates</h1>
            
            {applications.length === 0 ? (
                <p className="text-gray-500">No shortlisted candidates found.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {applications.map((application) => (
                        <div 
                            key={application._id} 
                            className="bg-white p-6 rounded-lg shadow-md"
                        >
                            <h2 className="text-xl font-semibold mb-2">
                                {application.candidateId.userName}
                            </h2>
                            <p className="text-gray-600 mb-2">
                                {application.jobId.jobTitle}
                            </p>
                            <p className="text-gray-500 mb-4">
                                {application.jobId.companyName}
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => navigate(`/shortlist/${application.candidateId._id}/${application.jobId._id}`)}
                                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};