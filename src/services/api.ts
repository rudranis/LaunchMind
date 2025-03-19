
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { Startup } from '@/models/Startup';
import { Investor } from '@/models/Investor';
import { MarketInsight } from '@/models/MarketInsight';
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

// Investor API methods
export async function getInvestors() {
  try {
    const { db } = await connectToDatabase();
    const investors = await db.collection('investors').find({}).toArray();
    return { success: true, data: investors };
  } catch (error) {
    console.error('Failed to fetch investors:', error);
    return { success: false, error: 'Failed to fetch investors' };
  }
}

export async function getInvestorById(id: string) {
  try {
    const { db } = await connectToDatabase();
    const investor = await db.collection('investors').findOne({ _id: toObjectId(id) });
    return { success: true, data: investor };
  } catch (error) {
    console.error(`Failed to fetch investor with id ${id}:`, error);
    return { success: false, error: `Failed to fetch investor with id ${id}` };
  }
}

export async function createInvestor(investor: Omit<Investor, '_id'>) {
  try {
    const { db } = await connectToDatabase();
    const result = await db.collection('investors').insertOne({
      ...investor,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, data: { _id: result.insertedId, ...investor } };
  } catch (error) {
    console.error('Failed to create investor:', error);
    return { success: false, error: 'Failed to create investor' };
  }
}

export async function matchInvestorsForStartup(startupId: string) {
  try {
    const { db } = await connectToDatabase();
    const startup = await db.collection('startups').findOne({ _id: toObjectId(startupId) });
    
    if (!startup) {
      return { success: false, error: 'Startup not found' };
    }
    
    // Match logic: Find investors that match startup's industry and funding stage
    const matchedInvestors = await db.collection('investors').find({
      industries: { $in: startup.industry },
      fundingStages: { $in: [startup.fundingStage] }
    }).toArray();
    
    return { success: true, data: matchedInvestors };
  } catch (error) {
    console.error('Failed to match investors:', error);
    return { success: false, error: 'Failed to match investors' };
  }
}

// Market Insights API methods
export async function getMarketInsights(industry: string) {
  try {
    const { db } = await connectToDatabase();
    const insights = await db.collection('marketInsights').find({
      industry: { $in: [industry] }
    }).toArray();
    return { success: true, data: insights };
  } catch (error) {
    console.error('Failed to fetch market insights:', error);
    return { success: false, error: 'Failed to fetch market insights' };
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

// AI Validation Service
export async function validateStartupIdea(idea: {
  title: string;
  description: string;
  industry: string[];
}) {
  try {
    // This would integrate with Gemini AI in a real implementation
    // For now we'll return mock data
    const mockValidation = {
      score: Math.floor(Math.random() * 30) + 70,
      strengths: [
        'Innovative solution to a real problem',
        'Large addressable market',
        'Clear value proposition'
      ],
      weaknesses: [
        'Competitive market landscape',
        'High initial development costs',
        'Potential regulatory challenges'
      ],
      marketPotential: Math.floor(Math.random() * 20) + 80,
      innovation: Math.floor(Math.random() * 30) + 70,
      feasibility: Math.floor(Math.random() * 25) + 65,
      financialViability: Math.floor(Math.random() * 30) + 60,
      teamCompetence: Math.floor(Math.random() * 20) + 75,
      recommendation: "Your idea shows strong potential in an emerging market.",
      timestamp: new Date()
    };
    
    return { success: true, data: mockValidation };
  } catch (error) {
    console.error('Failed to validate startup idea:', error);
    return { success: false, error: 'Failed to validate startup idea' };
  }
}
