import Job from '../../models/Job.js'
import mongoose from 'mongoose'

const getJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        
        if (!mongoose.Types.ObjectId.isValid(jobId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID'
            });
        }

        const job = await Job.findById(jobId)
            .populate('employerId', 'companyName');
            
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        
        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export {getJob};