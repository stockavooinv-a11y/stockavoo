import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 *
 * How this works:
 * 1. mongoose.connect() establishes connection to MongoDB
 * 2. We use environment variable MONGODB_URI for the database URL
 * 3. Returns a promise - if successful, connection is established
 * 4. If fails, we catch the error and exit the process
 */

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`
╔════════════════════════════════════════╗
║   MongoDB Connected Successfully       ║
║   Host: ${conn.connection.host.padEnd(23)} ║
║   Database: ${conn.connection.name.padEnd(19)} ║
╚════════════════════════════════════════╝
    `);

    // Connection event handlers (good for debugging)
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
