import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...'); // Debug log
        console.log('MongoDB URL:', process.env.MONGODB_URL); // Debug log
        
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Verify database connection
        await mongoose.connection.db.admin().ping();
        console.log('Database connection verified');
        
        // Import models before creating indexes
        const Job = mongoose.model('Job');
        const User = mongoose.model('User');
        const Application = mongoose.model('Application');
        const RecruiterAssignment = mongoose.model('RecruiterAssignment');
        
        // Create required indexes
        await Promise.all([
            Job.createIndexes(),
            User.createIndexes(),
            Application.createIndexes(),
            RecruiterAssignment.createIndexes()
        ]);
        
        console.log('Database indexes created/verified');
        
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;