import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Import dotenv properly

dotenv.config();

const dbUrl: string = process.env.DB_URL || '';

const connectDB = async () => {
    try {
        const data = await mongoose.connect(dbUrl);
        console.log(`Database connected with ${data.connection.host}`);
    } catch (error: any) {
        console.log(`Error connecting to the database: ${error.message}`);
        setTimeout(connectDB, 5000); // Retry after 5 seconds
    }
}

export default connectDB;
