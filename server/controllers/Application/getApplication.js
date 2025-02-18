import Application from '../../models/Application.js'

const getApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const application = await Application.findById(applicationId)
            .populate('jobId', 'jobTitle employmentType location salary description')
            .populate('candidateId', 'userName userEmail gender address');
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch application details'
        });
    }
};

export { getApplication };