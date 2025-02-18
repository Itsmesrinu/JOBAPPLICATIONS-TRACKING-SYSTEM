import Application from '../../models/Application.js';

export const getPendingApplications = async (req, res) => {
    try {
        const pendingApplications = await Application.find({ 
            status: 'pending',
            recruiterId: req.user._id
        })
        .populate('jobId', 'jobTitle companyName')
        .populate('candidateId', 'userName userEmail')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            applications: pendingApplications
        });
    } catch (error) {
        console.error('Error fetching pending applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending applications'
        });
    }
}; 