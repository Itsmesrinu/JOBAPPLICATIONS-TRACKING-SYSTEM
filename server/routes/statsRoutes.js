import express from 'express';
import { authenticate } from '../middleware/VerifyToken.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

const router = express.Router();

// Get employer stats
router.get('/employer-stats', authenticate, async (req, res) => {
    try {
        const totalJobs = await Job.countDocuments({ 
            employerId: req.user._id 
        });
        
        const activeJobs = await Job.countDocuments({ 
            employerId: req.user._id, 
            status: 'active' 
        });
        
        const totalApplications = await Application.countDocuments({
            jobId: { 
                $in: await Job.find({ employerId: req.user._id }).distinct('_id') 
            }
        });

        res.json({
            success: true,
            totalJobs,
            activeJobs,
            totalApplications
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Get candidate stats
router.get('/my-stats', authenticate, async (req, res) => {
    try {
        const totalApplications = await Application.countDocuments({ 
            candidateId: req.user._id 
        });
        const shortlisted = await Application.countDocuments({ 
            candidateId: req.user._id,
            status: 'shortlisted'
        });

        res.json({
            success: true,
            totalApplications,
            shortlisted
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Get recruiter stats
router.get('/recruiter-stats', authenticate, async (req, res) => {
    try {
        const assignedJobs = await Job.countDocuments({ 
            recruiterID: req.user._id 
        });
        const reviewedApplications = await Application.countDocuments({
            reviewerId: req.user._id,
            status: { $in: ['accepted', 'rejected'] }
        });

        res.json({
            success: true,
            assignedJobs,
            reviewedApplications
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
});

export default router; 