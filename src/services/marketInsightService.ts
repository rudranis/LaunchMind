import { connectToDatabase } from '@/lib/mongodb';
import { TrendingStartup, MarketTrend } from '@/models/MarketInsight';
import { analyzeMarketTrends, scrapeTrendingStartups } from './scrapingService';

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
