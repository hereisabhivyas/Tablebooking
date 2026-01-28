import mongoose from 'mongoose';

export async function connectDB(uri: string) {
  if (!uri) {
    throw new Error('MONGO_URI is required');
  }

  mongoose.connection.on('connected', () => {
    console.log('[DB] MongoDB connected');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[DB] MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB disconnected');
  });

  await mongoose.connect(uri);
  return mongoose.connection;
}
