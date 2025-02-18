import mongoose from 'mongoose';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

// Add this route to your existing jobs routes
router.post('/assign-recruiter', authenticate, async (req, res) => {
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { jobId, recruiterId } = req.body;

        // Validate input
        if (!jobId || !recruiterId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID and Recruiter ID are required'
            });
        }

        // Check if job exists and is not already assigned
        const existingJob = await Job.findById(jobId);
        if (!existingJob) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        if (existingJob.isAssigned) {
            return res.status(400).json({
                success: false,
                message: 'Job is already assigned to a recruiter'
            });
        }

        // Check if recruiter exists and is available
        const recruiter = await User.findById(recruiterId);
        if (!recruiter || recruiter.role !== 'recruiter') {
            return res.status(404).json({
                success: false,
                message: 'Recruiter not found or invalid role'
            });
        }

        if (recruiter.isAssigned) {
            return res.status(400).json({
                success: false,
                message: 'Recruiter is already assigned to another job'
            });
        }

        // Update job
        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            {
                isAssigned: true,
                assignedRecruiter: recruiterId,
                status: 'approved'
            },
            { new: true, session }
        );

        // Update recruiter
        const updatedRecruiter = await User.findByIdAndUpdate(
            recruiterId,
            {
                isAssigned: true,
                $push: { assignedJobs: jobId }
            },
            { new: true, session }
        );

        // Commit the transaction
        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: 'Recruiter assigned successfully',
            data: {
                job: updatedJob,
                recruiter: updatedRecruiter
            }
        });

    } catch (error) {
        // Abort transaction on error
        await session.abortTransaction();
        console.error('Error assigning recruiter:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to assign recruiter'
        });
    } finally {
        // End session
        session.endSession();
    }
});

export default router; 