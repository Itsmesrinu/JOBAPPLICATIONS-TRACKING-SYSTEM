import Application from '../../models/Application.js';

export const checkApplicationStatus = async (req, res) => {
    try {
        const { jobId, candidateId } = req.params;
        
        const application = await Application.findOne({
            jobId,
            candidateId
        });

        res.json({
            success: true,
            hasApplied: !!application
        });
    } catch (error) {
        console.error('Error checking application status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check application status'
        });
    }
}; 