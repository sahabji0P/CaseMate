// import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

// Load environment variables from .env.local file
// dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let isConnected = false;
let gfsBucket: GridFSBucket | null = null;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1 && gfsBucket) {
    console.log('Using existing MongoDB and GridFS connection');
    return { connection: mongoose.connection, gfsBucket };
  }

  try {
    console.log('Connecting to MongoDB with URI:', MONGODB_URI);
    const options: mongoose.ConnectOptions = {
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      retryWrites: true,
      w: 'majority' as const,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(MONGODB_URI || "", options);
    isConnected = true;
    console.log('MongoDB connected successfully');

    const db = mongoose.connection.db;
    console.log(db);
    gfsBucket = new GridFSBucket(db, { bucketName: 'uploads' });
    console.log('GridFSBucket initialized');

    return { connection: mongoose.connection, gfsBucket };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB;
export { gfsBucket };
