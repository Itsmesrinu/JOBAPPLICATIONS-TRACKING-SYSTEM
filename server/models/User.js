import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    userPassword: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        default: ''
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: ''
    },
    address: String,
    role: {
        type: String,
        enum: ['candidate', 'coordinator', 'recruiter', 'employer'],
        default: 'candidate'
    },
    isAssigned: {
        type: Boolean,
        default: false
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    applications: [{
        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Job'
        },
        applicationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Application'
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'shortlisted', 'rejected'],
            default: 'active'
        }
    }],
    resume: {
        type: String
    }
}, {
    timestamps: true
});

UserSchema.index({ userEmail: 1 }, { unique: true });
UserSchema.index({ role: 1, isAssigned: 1 });

export default mongoose.model('User', UserSchema);