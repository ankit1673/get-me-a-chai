import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Already connected
        if (mongoose.connection.readyState === 1) {
            return;
        }

        // Connection is currently being established
        if (mongoose.connection.readyState === 2) {
            await mongoose.connection.asPromise();
            return;
        }

        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in .env.local");
        }

        await mongoose.connect(mongoUri);

        console.log("MongoDB connected successfully");
        console.log("MongoDB host:", mongoose.connection.host);
        console.log("MongoDB database:", mongoose.connection.name);

    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
};

export default connectDB;