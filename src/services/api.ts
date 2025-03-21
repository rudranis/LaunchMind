import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { Startup } from '@/models/Startup';
import { Investor } from '@/models/Investor';
import { MarketInsight, TrendingStartup, MarketTrend } from '@/models/MarketInsight';
import { PitchDeck } from '@/models/PitchDeck';
import { analyzeMarketTrends, getTrendingStartups, scrapeTrendingStartups } from './scrapingService';

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
    
    // Enhanced matching logic: Find investors that match startup's industry and funding stage
    // Also consider past investments, check size, and investment preferences
    const matchedInvestors = await db.collection('investors').find({
      $and: [
        { industries: { $in: startup.industry } },
        { fundingStages: { $in: [startup.fundingStage] } },
        { 
          $or: [
            { investmentRange: { $exists: false } },
            { 
              $and: [
                { 'investmentRange.min': { $lte: startup.fundingNeeded || 0 } },
                { 'investmentRange.max': { $gte: startup.fundingNeeded || 0 } }
              ] 
            }
          ]
        }
      ]
    }).sort({ 
      // Sort by most relevant first 
      leadInvestor: -1,
      avgCheckSize: -1
    }).toArray();
    
    // Calculate match score for each investor
    const investorsWithScores = matchedInvestors.map(investor => {
      let matchScore = 0;
      
      // Industry match: +20 points per matching industry
      const matchingIndustries = startup.industry.filter(ind => 
        investor.industries.includes(ind)
      );
      matchScore += matchingIndustries.length * 20;
      
      // Funding stage match: +30 points
      if (investor.fundingStages.includes(startup.fundingStage)) {
        matchScore += 30;
      }
      
      // Investment range match: +25 points
      if (investor.investmentRange && 
          startup.fundingNeeded >= investor.investmentRange.min && 
          startup.fundingNeeded <= investor.investmentRange.max) {
        matchScore += 25;
      }
      
      // Lead investor preference: +15 points
      if (investor.leadInvestor && startup.lookingForLead) {
        matchScore += 15;
      }
      
      // Previous investments in similar startups: +10 points
      const similarStartups = investor.portfolio?.filter(inv => 
        startup.industry.some(ind => inv.startupName.toLowerCase().includes(ind.toLowerCase()))
      );
      matchScore += (similarStartups?.length || 0) * 5;
      
      return {
        ...investor,
        matchScore: Math.min(matchScore, 100) // Cap at 100%
      };
    });
    
    // Sort by match score
    investorsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    
    return { success: true, data: investorsWithScores };
  } catch (error) {
    console.error('Failed to match investors:', error);
    return { success: false, error: 'Failed to match investors' };
  }
}

// Market Insights API methods
export async function getMarketInsights(industry?: string[]) {
  try {
    const { db } = await connectToDatabase();
    const query = industry && industry.length > 0 
      ? { industry: { $in: industry } }
      : {};
      
    const insights = await db.collection('marketInsights').find(query).toArray();
    return { success: true, data: insights };
  } catch (error) {
    console.error('Failed to fetch market insights:', error);
    return { success: false, error: 'Failed to fetch market insights' };
  }
}

// Enhanced market insights with real-time data
export async function getRealtimeMarketInsights(industry?: string[]) {
  try {
    // First, check if we have recent data
    const { db } = await connectToDatabase();
    const query = industry && industry.length > 0 
      ? { industry: { $in: industry } }
      : {};
      
    // Add time filter to only get recent insights
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 7); // Consider data from last 7 days as "recent"
    
    const recentInsights = await db.collection('marketInsights')
      .find({
        ...query,
        lastUpdated: { $gte: recentDate }
      })
      .toArray();
    
    // If we have recent data, return it
    if (recentInsights && recentInsights.length > 0) {
      return { success: true, data: recentInsights };
    }
    
    // Otherwise, fetch new data
    const trendsResult = await analyzeMarketTrends(industry);
    const startupsResult = await scrapeTrendingStartups(industry);
    
    if (!trendsResult.success || !startupsResult.success) {
      return { 
        success: false, 
        error: trendsResult.error || startupsResult.error || 'Failed to fetch real-time data' 
      };
    }
    
    // Create or update market insights with new data
    if (industry && industry.length > 0) {
      for (const ind of industry) {
        // Check if we have an existing insight for this industry
        const existingInsight = await db.collection('marketInsights').findOne({ 
          industry: ind 
        });
        
        if (existingInsight) {
          // Update existing insight
          await db.collection('marketInsights').updateOne(
            { _id: existingInsight._id },
            { 
              $set: { 
                trends: trendsResult.data?.filter(trend => trend.industry.includes(ind)) || [],
                trendingStartups: startupsResult.data?.filter(
                  startup => startup.industry.includes(ind)
                ) || [],
                lastUpdated: new Date()
              } 
            }
          );
        } else {
          // Create new insight
          await db.collection('marketInsights').insertOne({
            industry: [ind],
            marketSize: 0, // Placeholder, would be calculated from external data
            cagr: 0, // Placeholder
            year: new Date().getFullYear(),
            trends: trendsResult.data?.filter(trend => trend.industry.includes(ind)) || [],
            trendingStartups: startupsResult.data?.filter(
              startup => startup.industry.includes(ind)
            ) || [],
            competitors: [],
            keyPlayers: [],
            lastUpdated: new Date()
          });
        }
      }
    }
    
    // Fetch the updated insights
    const updatedInsights = await db.collection('marketInsights')
      .find(query)
      .toArray();
    
    return { success: true, data: updatedInsights };
  } catch (error) {
    console.error('Failed to fetch real-time market insights:', error);
    return { success: false, error: 'Failed to fetch real-time market insights' };
  }
}

// Trending startups API
export async function getTrendingStartupsAPI(industry?: string[], limit: number = 10) {
  try {
    // First check if we have recent data in our database
    const { db } = await connectToDatabase();
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - 3); // Consider data from last 3 days as "recent"
    
    const query = industry && industry.length > 0 
      ? { 
          industry: { $in: industry },
          scrapedDate: { $gte: recentDate }
        }
      : { scrapedDate: { $gte: recentDate } };
    
    const existingStartups = await db.collection('trendingStartups')
      .find(query)
      .sort({ trendingScore: -1 })
      .limit(limit)
      .toArray();
    
    // If we have enough recent data, return it
    if (existingStartups && existingStartups.length >= 5) {
      // Map MongoDB documents to TrendingStartup objects
      const startups: TrendingStartup[] = existingStartups.map(doc => ({
        name: doc.name || '',
        website: doc.website,
        description: doc.description,
        industry: Array.isArray(doc.industry) ? doc.industry : [],
        fundingStage: doc.fundingStage,
        totalFunding: doc.totalFunding,
        lastFundingDate: doc.lastFundingDate ? new Date(doc.lastFundingDate) : undefined,
        lastFundingAmount: doc.lastFundingAmount,
        investors: doc.investors,
        tractionMetrics: doc.tractionMetrics,
        foundedYear: doc.foundedYear,
        location: doc.location,
        founders: doc.founders,
        source: doc.source || 'Other',
        scrapedDate: doc.scrapedDate ? new Date(doc.scrapedDate) : new Date(),
        trendingScore: doc.trendingScore || 0
      }));
      
      return { success: true, data: startups };
    }
    
    // Otherwise, fetch new data
    const result = await scrapeTrendingStartups(industry);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to fetch trending startups' };
    }
    
    // Return the new data
    const startups = result.data || [];
    return { 
      success: true, 
      data: startups.sort((a, b) => b.trendingScore - a.trendingScore).slice(0, limit) 
    };
  } catch (error) {
    console.error('Failed to fetch trending startups:', error);
    return { success: false, error: 'Failed to fetch trending startups' };
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

// Save chat conversation history for a user (session-based or user-based)
export async function saveChatHistory(session: string, messages: any[]) {
  try {
    const { db } = await connectToDatabase();
    
    // Check if chat history exists for this session
    const existingChat = await db.collection('chatHistory').findOne({ sessionId: session });
    
    if (existingChat) {
      // Update existing chat history
      await db.collection('chatHistory').updateOne(
        { sessionId: session },
        { 
          $set: { 
            messages: messages,
            updatedAt: new Date()
          } 
        }
      );
    } else {
      // Create new chat history
      await db.collection('chatHistory').insertOne({
        sessionId: session,
        messages: messages,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to save chat history:', error);
    return { success: false, error: 'Failed to save chat history' };
  }
}

// Get chat history for a user (session-based or user-based)
export async function getChatHistory(session: string) {
  try {
    const { db } = await connectToDatabase();
    
    const chatHistory = await db.collection('chatHistory').findOne({ sessionId: session });
    
    return { 
      success: true, 
      data: chatHistory ? chatHistory.messages : [] 
    };
  } catch (error) {
    console.error('Failed to get chat history:', error);
    return { success: false, error: 'Failed to get chat history' };
  }
}
