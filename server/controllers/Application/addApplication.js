import Application from '../../models/Application.js';
import Job from '../../models/Job.js';
import User from '../../models/User.js';
import mongoose from 'mongoose';

const addApplication = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { jobId, candidateId, answers: answersString } = req.body;
        const resumePath = req.file ? req.file.path : null;
        const answers = answersString ? JSON.parse(answersString) : [];

        if (!jobId || !candidateId) {
            return res.status(400).json({
                success: false,
                message: 'Job ID and Candidate ID are required'
            });
        }

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(jobId) || !mongoose.Types.ObjectId.isValid(candidateId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Job ID or Candidate ID'
            });
        }

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Check if candidate exists
        const candidate = await User.findById(candidateId);
        if (!candidate) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        const existingApplication = await Application.findOne({ jobId, candidateId });
        if (existingApplication) {
            await session.abortTransaction();
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        const newApplication = new Application({
            jobId,
            candidateId,
            resumePath,
            answers,
            status: 'pending'
        });

        const savedApplication = await newApplication.save({ session });

        // Update job with new application
        await Job.findByIdAndUpdate(jobId, {
            $push: { applications: savedApplication._id }
        }, { session });

        // Update user with new application
        await User.findByIdAndUpdate(candidateId, {
            $push: { 
                applications: {
                    jobId,
                    applicationId: savedApplication._id,
                    status: 'pending'
                }
            }
        }, { session });

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            application: savedApplication
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Application submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit application'
        });
    } finally {
        session.endSession();
    }
};

export { addApplication };