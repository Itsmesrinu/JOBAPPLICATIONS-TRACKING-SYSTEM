import Application from '../../models/Application.js';

export const getShortlistedCandidates = async (req, res) => {
    try {
        const shortlistedApplications = await Application.find({ 
            status: 'shortlisted'
        })
        .populate('jobId', 'jobTitle companyName location employmentType')
        .populate('candidateId', 'userName userEmail')
        .populate('recruiterId', 'userName')
        .sort({ updatedAt: -1 });

        if (!shortlistedApplications) {
            return res.status(404).json({
                success: false,
                message: 'No shortlisted applications found'
            });
        }

        res.status(200).json({
            success: true,
            applications: shortlistedApplications
        });
    } catch (error) {
        console.error('Error fetching shortlisted candidates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch shortlisted candidates'
        });
    }
}; 