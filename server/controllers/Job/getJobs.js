import Job from '../../models/Job.js'

const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
            .populate('employerId', 'companyName')
            .sort({ createdAt: -1 });
            
        res.status(200).json({
            success: true,
            jobs
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

export { getJobs };