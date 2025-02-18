import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { LoginContext } from '../components/ContextProvider/Context';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { loginData } = useContext(LoginContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, [loginData?.role]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('usertoken');
            console.log('Token:', token); // Debug log
            console.log('User role:', loginData?.role); // Debug log

            if (!token) {
                navigate('/login');
                return;
            }

            let endpoint = '';
            switch(loginData?.role) {
                case 'employer':
                    endpoint = '/stats/employer-stats';
                    break;
                case 'candidate':
                    endpoint = '/stats/my-stats';
                    break;
                case 'recruiter':
                    endpoint = '/stats/recruiter-stats';
                    break;
                case 'coordinator':
                    endpoint = '/stats/coordinator-stats';
                    break;
                default:
                    throw new Error('Invalid role');
            }

            console.log('Fetching from endpoint:', endpoint); // Debug log

            const response = await fetch(`${process.env.REACT_APP_API_URL}${endpoint}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response:', response); // Debug log

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch dashboard data');
            }

            const result = await response.json();
            console.log('Dashboard data:', result); // Debug log

            if (result.success) {
                setData(result);
            } else {
                throw new Error(result.message || 'Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Dashboard error:', error);
            toast.error(error.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            
            {loginData?.role === 'employer' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold">Total Jobs Posted</h3>
                        <p className="text-2xl">{data?.totalJobs || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold">Active Jobs</h3>
                        <p className="text-2xl">{data?.activeJobs || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold">Total Applications</h3>
                        <p className="text-2xl">{data?.totalApplications || 0}</p>
                    </div>
                </div>
            )}

            {loginData?.role === 'candidate' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold">Applications Submitted</h3>
                        <p className="text-2xl">{data?.totalApplications || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold">Shortlisted</h3>
                        <p className="text-2xl">{data?.shortlisted || 0}</p>
                    </div>
                </div>
            )}

            {loginData?.role === 'recruiter' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold">Total Applications</h3>
                        <p className="text-2xl">{data?.totalApplications || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold">Shortlisted</h3>
                        <p className="text-2xl">{data?.shortlisted || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="font-semibold">Pending Review</h3>
                        <p className="text-2xl">{data?.pending || 0}</p>
                        {/* <h3 className="font-semibold">Pending Reviews</h3>
                        <p className="text-2xl">{data?.pendingReviews || 0}</p> */}
                    </div>
                </div>
            )}

            {/* Add similar sections for recruiter and coordinator */}
        </div>
    );
};
