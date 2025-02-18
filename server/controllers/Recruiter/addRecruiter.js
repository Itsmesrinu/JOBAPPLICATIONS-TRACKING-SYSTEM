import RecruiterAssignment from '../../models/Recruiter.js'

const addRecruiter = async (req, res) => {
    try {
        const { jobId, recruiterId, notes } = req.body;
        
        const newAssignment = new RecruiterAssignment({
            jobId,
            recruiterId,
            notes,
            status: 'active'
        });

        await newAssignment.save();

        res.status(201).json({
            success: true,
            assignment: newAssignment
        });
    } catch (error) {
        console.error('Add recruiter error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

export { addRecruiter };