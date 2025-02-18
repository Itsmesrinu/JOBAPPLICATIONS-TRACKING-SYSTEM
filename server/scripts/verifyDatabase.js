import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function verifyDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        
        // Get current database name
        const currentDB = mongoose.connection.db.databaseName;
        console.log('Connected to database:', currentDB);
        
        // List all collections in this database
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nCollections in this database:');
        collections.forEach(collection => {
            console.log(`- ${collection.name}`);
        });
        
        mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

verifyDatabase(); 