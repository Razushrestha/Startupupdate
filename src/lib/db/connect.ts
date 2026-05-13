import mongoose from "mongoose";

const globalWithMongo = globalThis as typeof globalThis & {
  __mongooseConn?: Promise<typeof mongoose>;
};

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

export async function connectMongo(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is not set.");
  }

  if (globalWithMongo.__mongooseConn) {
    return globalWithMongo.__mongooseConn;
  }

  globalWithMongo.__mongooseConn = mongoose.connect(uri);
  return globalWithMongo.__mongooseConn;
}
