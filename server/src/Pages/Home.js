import React, { useState } from 'react';
import { FeaturedJobs } from '../components/Home/FeaturedJobs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) {
            toast.info('Please enter a search term');
            return;
        }
        navigate(`/all-posted-jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-primary text-white py-20">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
                        Find Your Dream Job Today
                    </h1>
                    <p className="text-center text-lg mb-8 max-w-2xl mx-auto">
                        Discover opportunities that match your skills and aspirations
                    </p>
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Search jobs by title, company, or keywords..."
                                className="flex-1 p-3 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-secondary"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-secondary text-white px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition duration-300"
                            >
                                {loading ? 'Searching...' : 'Search Jobs'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Featured Jobs Section */}
            <div className="py-16 container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Jobs</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our latest job opportunities from top employers
                    </p>
                </div>
                <FeaturedJobs />
            </div>
        </div>
    );
}; 