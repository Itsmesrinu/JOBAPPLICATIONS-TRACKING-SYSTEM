import Application from '../../models/Application.js';

export const getUserApplications = async (req, res) => {
    try {
        const userId = req.params.userId;
        const applications = await Application.find({ candidateId: userId })
            .populate('jobId', 'jobTitle employmentType location')
            .populate('employerId', 'companyName')
            .sort({ createdAt: -1 });

        const formattedApplications = applications.map(app => ({
            _id: app._id,
            jobTitle: app.jobId?.jobTitle,
            employmentType: app.jobId?.employmentType,
            location: app.jobId?.location,
            companyName: app.employerId?.companyName,
            status: app.status,
            appliedDate: app.appliedDate
        }));

        res.status(200).json({
            success: true,
            applications: formattedApplications
        });
    } catch (error) {
        console.error('Error fetching user applications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch applications'
        });
    }
}; 