
import { MongoClient, Db, ServerApiVersion } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/startupai';

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_URI) {
    console.warn('No MONGODB_URI found in env variables, using default local connection');
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    const db = client.db('startupai');
    
    // Cache the database connection
    cachedClient = client;
    cachedDb = db;
    
    console.log('Successfully connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    throw error;
  }
}
