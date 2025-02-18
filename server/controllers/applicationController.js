export const submitApplication = async (req, res) => {
    try {
        const { jobId, candidateId } = req.body;
        const answers = JSON.parse(req.body.answers || '[]');
        const resumePath = req.file?.path;

        // Validate inputs
        if (!jobId || !candidateId || !resumePath) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create application
        const application = await Application.create({
            jobId,
            candidateId,
            resumePath,
            answers,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            application
        });

    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application'
        });
    }
}; 