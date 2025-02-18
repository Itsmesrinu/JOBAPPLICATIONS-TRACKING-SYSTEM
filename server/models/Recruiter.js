import mongoose from 'mongoose';

const recruiterSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    assignedDate: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    },
    feedback: [{
        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        },
        comments: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        }
    }]
}, {
    timestamps: true
});

// Rename the model to 'RecruiterAssignment' to avoid conflicts
const RecruiterAssignment = mongoose.model('RecruiterAssignment', recruiterSchema);

export default RecruiterAssignment;