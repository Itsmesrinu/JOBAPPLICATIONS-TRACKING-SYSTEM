import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resumePath: {
        type: String,
        required: true
    },
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewing', 'shortlisted', 'rejected'],
        default: 'pending'
    },
    resume: {
        type: String,
        required: true
    },
    answers: [{
        question: String,
        answer: String
    }],
    appliedDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    },
    feedback: {
        type: String,
        default: ''
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    applicationForm: [{
        question: String,
        answer: String
    }]
}, {
    timestamps: true
});

// Add indexes for better query performance
ApplicationSchema.index({ candidateId: 1, status: 1 });
ApplicationSchema.index({ jobId: 1, status: 1 });

export default mongoose.model('Application', ApplicationSchema);