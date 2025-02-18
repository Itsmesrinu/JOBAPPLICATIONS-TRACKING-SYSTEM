import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        
        // Get all users
        const users = await User.find({});
        console.log('Users in database:', users);
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkData(); 