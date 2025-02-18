import Application from '../../models/Application.js'

const getApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate('jobId', 'jobTitle employmentType location')
            .populate('candidateId', 'userName userEmail')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch applications' 
        });
    }
};

export { getApplications };