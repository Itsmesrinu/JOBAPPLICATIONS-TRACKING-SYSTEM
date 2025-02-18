import Application from '../../models/Application.js';

export const getRecruiterApplications = async (req, res) => {
    try {
        const applications = await Application.find({ 
            recruiterId: req.user._id 
        })
        .populate('jobId', 'jobTitle companyName')
        .populate('candidateId', 'userName userEmail')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        console.error('Error fetching recruiter applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications'
        });
    }
}; 