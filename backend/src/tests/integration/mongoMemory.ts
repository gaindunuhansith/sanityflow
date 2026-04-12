import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export const startInMemoryMongo = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  // ensure code that reads process.env.MONGODB_URI at runtime will use this uri
  process.env.MONGODB_URI = uri;
  await mongoose.connect(uri);
  return mongoServer;
};

export const stopInMemoryMongo = async () => {
  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.connection.dropDatabase();
    } catch (err) {
      // ignore
    }
    await mongoose.connection.close();
  }

  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
};

export const clearDatabase = async () => {
  if (mongoose.connection.readyState === 0) return;
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await collections[key].deleteMany({});
  }
};
