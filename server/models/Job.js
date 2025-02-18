import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    employmentType: {
        type: String,
        required: true,
        enum: ['Full Time', 'Part Time', 'Contract', 'Internship']
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'closed'],
        default: 'active'
    },
    applicationForm: [{
        question: String,
        answer: String
    }],
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    recruiterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isAssigned: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

JobSchema.index({ status: 1, isAssigned: 1 });
JobSchema.index({ employerId: 1, status: 1 });

export default mongoose.model('Job', JobSchema);