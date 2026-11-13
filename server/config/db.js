import mongoose from 'mongoose';

export async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  try {
    const options = {};
    // On local Windows dev environments with system SSL/inspection proxies, allow TLS bypass
    if (process.env.NODE_ENV !== 'production' || process.env.MONGO_TLS_ALLOW_INVALID === 'true') {
      options.tlsAllowInvalidCertificates = true;
    }

    const conn = await mongoose.connect(mongoUri, options);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Failed to connect: ${error.message}`);
    throw error;
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('[Database] MongoDB Disconnected cleanly.');
  } catch (error) {
    console.error(`[Database Error] Disconnect failed: ${error.message}`);
  }
}
