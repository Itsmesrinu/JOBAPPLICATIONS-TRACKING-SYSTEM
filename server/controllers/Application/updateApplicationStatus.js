import Application from '../../models/Application.js'
import User from '../../models/User.js'
import Job from '../../models/Job.js'

const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, feedback } = req.body;
        
        const application = await Application.findByIdAndUpdate(
            id,
            { 
                status,
                feedback,
                recruiterId: req.user._id,
                updatedAt: Date.now()
            },
            { new: true }
        );

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
        console.error('Update application status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update application status'
        });
    }
};

export { updateApplicationStatus }; 