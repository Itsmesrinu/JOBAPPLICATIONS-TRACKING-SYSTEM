import Job from '../../models/Job.js';

export const getPendingJobs = async (req, res) => {
    try {
        const pendingJobs = await Job.find({ 
            status: 'pending',
            recruiterId: { $exists: false } 
        })
        .populate('employerId', 'companyName')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: pendingJobs
        });
    } catch (error) {
        console.error('Error fetching pending jobs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending jobs'
        });
    }
}; 