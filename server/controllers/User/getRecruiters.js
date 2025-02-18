import User from '../../models/User.js';

export const getRecruiters = async (req, res) => {
    try {
        // Assuming recruiters are identified by a specific role
        const recruiters = await User.find({ role: 'recruiter' })
            .select('userName userEmail companyName')
            .sort({ userName: 1 });

        if (!recruiters || recruiters.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No recruiters found'
            });
        }

        res.status(200).json({
            success: true,
            recruiters
        });
    } catch (error) {
        console.error('Error fetching recruiters:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recruiters'
        });
    }
}; 

export const approveRecruiter = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedRecruiter = await User.findByIdAndUpdate(
            id,
            {
                isApproved: true,
                updatedAt: Date.now()
            },
            { new: true }
        );

        if (!updatedRecruiter) {
            return res.status(404).json({
                success: false,
                message: 'Recruiter not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Recruiter approved successfully',
            recruiter: updatedRecruiter
        });
    } catch (error) {
        console.error('Error approving recruiter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve recruiter'
        });
    }
};