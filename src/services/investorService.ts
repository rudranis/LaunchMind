
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { Investor } from '@/models/Investor';

// Helper function to convert string ID to ObjectId
const toObjectId = (id: string): ObjectId => {
  try {
    return new ObjectId(id);
  } catch (error) {
    console.error('Invalid ObjectId format:', error);
    throw new Error('Invalid ID format');
  }
};

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
