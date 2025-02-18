import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../components/ContextProvider/Context';

export const AllPostedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        employmentType: '',
        location: ''
    });
    const navigate = useNavigate();
    const { loginData } = useContext(LoginContext);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs/all-jobs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            
            if (data.success) {
                setJobs(data.jobs);
            } else {
                toast.error(data.message || 'Failed to fetch jobs');
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !filters.employmentType || job.employmentType === filters.employmentType;
        const matchesLocation = !filters.location || job.location === filters.location;
        return matchesSearch && matchesType && matchesLocation;
    });

    const uniqueLocations = [...new Set(jobs.map(job => job.location))];
    const employmentTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];

    const handleApply = (jobId) => {
        if (!loginData) {
            toast.error('Please login to apply');
            navigate('/login');
            return;
        }
        if (loginData.role !== 'candidate') {
            toast.error('Only candidates can apply for jobs');
            return;
        }
        navigate(`/job-details/${jobId}`);
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full p-2 border rounded mb-4"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="flex gap-4">
                    <select
                        className="p-2 border rounded"
                        value={filters.employmentType}
                        onChange={(e) => setFilters({...filters, employmentType: e.target.value})}
                    >
                        <option value="">All Types</option>
                        {employmentTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <select
                        className="p-2 border rounded"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                    >
                        <option value="">All Locations</option>
                        {uniqueLocations.map(location => (
                            <option key={location} value={location}>{location}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredJobs.length === 0 ? (
                <div className="text-center py-10">No jobs found</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredJobs.map(job => (
                        <div key={job._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                            <h2 className="text-xl font-semibold mb-2">{job.jobTitle}</h2>
                            <p className="text-gray-600 mb-2">{job.employmentType}</p>
                            <p className="text-gray-600 mb-2">{job.location}</p>
                            <p className="text-gray-600 mb-2">Salary: {job.salary}</p>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-3">{job.description}</p>
                            <div className="flex justify-between items-center">
                                <button 
                                    onClick={() => navigate(`/current-job/${job._id}`)}
                                    className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
                                >
                                    View Details
                                </button>
                                {loginData?.role === 'candidate' && (
                                    <button 
                                        onClick={() => handleApply(job._id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Apply Now
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 