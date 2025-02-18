import Job from '../../models/Job.js'

const addJob = async (req, res) => {
    try {
        const { jobTitle, employmentType, location, salary, description, applicationForm } = req.body;

        const job = new Job({
            employerId: req.user._id,
            jobTitle,
            employmentType,
            location,
            salary,
            description,
            applicationForm,
            status: 'active'
        });

        await job.save();
        res.status(201).json({
            success: true,
            job
        });
    } catch (error) {
        console.error('Add job error:', error);
        res.status(409).json({ 
            success: false,
            message: error.message 
        });
    }
};

export { addJob };