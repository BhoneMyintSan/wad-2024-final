import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error('Please define the MONGO_URI environment variable inside .env');
}

// Global caching mechanism to store the connection
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    // If already connected, return the connection
    if (cached.conn) {
        return cached.conn;
    }

    // If no connection is cached, create a new connection promise
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
            console.log('Database connected successfully');
            return mongoose; // Return the mongoose instance after connection
        });
    }

    try {
        cached.conn = await cached.promise; // Await the connection and cache it
    } catch (e) {
        cached.promise = null; // Reset promise cache on error
        throw e; // Re-throw the error to be handled elsewhere
    }

    return cached.conn;
}

export default dbConnect;
