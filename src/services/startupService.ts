
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { Startup } from '@/models/Startup';
import { PitchDeck } from '@/models/PitchDeck';

// Helper function to convert string ID to ObjectId
const toObjectId = (id: string): ObjectId => {
  try {
    return new ObjectId(id);
  } catch (error) {
    console.error('Invalid ObjectId format:', error);
    throw new Error('Invalid ID format');
  }
};

// Startup API methods
export async function getStartups() {
  try {
    const { db } = await connectToDatabase();
    const startups = await db.collection('startups').find({}).toArray();
    return { success: true, data: startups };
  } catch (error) {
    console.error('Failed to fetch startups:', error);
    return { success: false, error: 'Failed to fetch startups' };
  }
}

export async function getStartupById(id: string) {
  try {
    const { db } = await connectToDatabase();
    const startup = await db.collection('startups').findOne({ _id: toObjectId(id) });
    return { success: true, data: startup };
  } catch (error) {
    console.error(`Failed to fetch startup with id ${id}:`, error);
    return { success: false, error: `Failed to fetch startup with id ${id}` };
  }
}

export async function createStartup(startup: Omit<Startup, '_id'>) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('startups').insertOne({
      ...startup,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, data: { _id: result.insertedId, ...startup } };
  } catch (error) {
    console.error('Failed to create startup:', error);
    return { success: false, error: 'Failed to create startup' };
  }
}

// Pitch Deck API methods
export async function getPitchDecksForStartup(startupId: string) {
  try {
    const { db } = await connectToDatabase();
    const pitchDecks = await db.collection('pitchDecks').find({
      startupId: startupId
    }).toArray();
    return { success: true, data: pitchDecks };
  } catch (error) {
    console.error('Failed to fetch pitch decks:', error);
    return { success: false, error: 'Failed to fetch pitch decks' };
  }
}

export async function createPitchDeck(pitchDeck: Omit<PitchDeck, '_id'>) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('pitchDecks').insertOne({
      ...pitchDeck,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, data: { _id: result.insertedId, ...pitchDeck } };
  } catch (error) {
    console.error('Failed to create pitch deck:', error);
    return { success: false, error: 'Failed to create pitch deck' };
  }
}
