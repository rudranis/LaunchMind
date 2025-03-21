import { TrendingStartup, MarketTrend } from '@/models/MarketInsight';
import { connectToDatabase } from '@/lib/mongodb';

// Mock data for trending startups (in a real app, this would use web scraping)
const mockTrendingStartups: TrendingStartup[] = [
  {
    name: "NeuralWave AI",
    website: "https://neuralwave.ai",
    description: "AI-powered decision support platform for healthcare professionals",
    industry: ["Healthcare", "Artificial Intelligence"],
    fundingStage: "Series A",
    totalFunding: 8500000,
    lastFundingDate: new Date("2023-09-15"),
    lastFundingAmount: 5000000,
    investors: ["HealthTech Ventures", "AI Capital", "FutureMed Partners"],
    tractionMetrics: {
      users: 15000,
      revenue: "$3M ARR",
      growth: "128% YoY"
    },
    foundedYear: 2020,
    location: "Boston, MA",
    founders: ["Dr. Maria Chen", "Alex Rodriguez"],
    source: "Crunchbase",
    scrapedDate: new Date(),
    trendingScore: 92
  },
  {
    name: "GreenSync",
    website: "https://greensync.eco",
    description: "Carbon tracking and sustainability management platform for enterprise",
    industry: ["CleanTech", "Enterprise Software"],
    fundingStage: "Seed",
    totalFunding: 3200000,
    lastFundingDate: new Date("2023-10-01"),
    lastFundingAmount: 3200000,
    investors: ["ClimateAction Fund", "Sustainable Futures"],
    tractionMetrics: {
      users: 500,
      revenue: "$1.2M ARR",
      growth: "200% YoY"
    },
    foundedYear: 2021,
    location: "San Francisco, CA",
    founders: ["Emma Wilson", "Thomas Kumar"],
    source: "AngelList",
    scrapedDate: new Date(),
    trendingScore: 88
  },
  {
    name: "CryptoSafe",
    website: "https://cryptosafe.finance",
    description: "Institutional-grade security infrastructure for digital assets",
    industry: ["Fintech", "Blockchain", "Cybersecurity"],
    fundingStage: "Series B",
    totalFunding: 28000000,
    lastFundingDate: new Date("2023-08-12"),
    lastFundingAmount: 15000000,
    investors: ["Blockchain Capital", "Fintech Ventures", "Security Alliance Partners"],
    tractionMetrics: {
      users: 200,
      revenue: "$8M ARR",
      growth: "85% YoY"
    },
    foundedYear: 2019,
    location: "New York, NY",
    founders: ["James Monroe", "Sarah Khan"],
    source: "TechCrunch",
    scrapedDate: new Date(),
    trendingScore: 85
  },
  {
    name: "SupplyMind",
    website: "https://supplymind.io",
    description: "AI-powered supply chain optimization and prediction platform",
    industry: ["Supply Chain", "Artificial Intelligence", "Enterprise Software"],
    fundingStage: "Seed",
    totalFunding: 4500000,
    lastFundingDate: new Date("2023-09-28"),
    lastFundingAmount: 4500000,
    investors: ["Logistics Capital", "Enterprise AI Fund"],
    tractionMetrics: {
      users: 50,
      revenue: "$800K ARR",
      growth: "160% YoY"
    },
    foundedYear: 2022,
    location: "Seattle, WA",
    founders: ["David Chen", "Priya Patel"],
    source: "ProductHunt",
    scrapedDate: new Date(),
    trendingScore: 82
  },
  {
    name: "EduVerse",
    website: "https://eduverse.learning",
    description: "Immersive VR/AR educational platform for schools and universities",
    industry: ["EdTech", "Virtual Reality", "Augmented Reality"],
    fundingStage: "Series A",
    totalFunding: 12000000,
    lastFundingDate: new Date("2023-07-15"),
    lastFundingAmount: 9000000,
    investors: ["Education Ventures", "Future Learning Fund", "XR Capital"],
    tractionMetrics: {
      users: 350000,
      revenue: "$5M ARR",
      growth: "110% YoY"
    },
    foundedYear: 2020,
    location: "Austin, TX",
    founders: ["Michael Brown", "Sophia Rodriguez"],
    source: "Crunchbase",
    scrapedDate: new Date(),
    trendingScore: 79
  },
  {
    name: "HealthSync",
    website: "https://healthsync.care",
    description: "Remote patient monitoring platform with predictive analytics",
    industry: ["Healthcare", "IoT", "Artificial Intelligence"],
    fundingStage: "Series A",
    totalFunding: 11000000,
    lastFundingDate: new Date("2023-08-05"),
    lastFundingAmount: 7000000,
    investors: ["Health Innovations", "Patient Care Ventures", "MedTech Fund"],
    tractionMetrics: {
      users: 100000,
      revenue: "$3.5M ARR",
      growth: "95% YoY"
    },
    foundedYear: 2021,
    location: "Chicago, IL",
    founders: ["Dr. Robert Johnson", "Lisa Chen"],
    source: "AngelList",
    scrapedDate: new Date(),
    trendingScore: 77
  },
  {
    name: "RetailAI",
    website: "https://retailai.store",
    description: "Computer vision platform for retail analytics and customer insights",
    industry: ["Retail Tech", "Computer Vision", "Artificial Intelligence"],
    fundingStage: "Seed",
    totalFunding: 5500000,
    lastFundingDate: new Date("2023-09-10"),
    lastFundingAmount: 5500000,
    investors: ["Retail Innovation Fund", "Vision Capital", "AI Retail Ventures"],
    tractionMetrics: {
      users: 75,
      revenue: "$1M ARR",
      growth: "180% YoY"
    },
    foundedYear: 2022,
    location: "Toronto, Canada",
    founders: ["Jennifer Wong", "Daniel Rodriguez"],
    source: "ProductHunt",
    scrapedDate: new Date(),
    trendingScore: 75
  },
  {
    name: "FarmFuture",
    website: "https://farmfuture.ag",
    description: "Precision agriculture platform using drone data and machine learning",
    industry: ["AgTech", "Drones", "Machine Learning"],
    fundingStage: "Series A",
    totalFunding: 9500000,
    lastFundingDate: new Date("2023-06-20"),
    lastFundingAmount: 6000000,
    investors: ["AgriTech Capital", "Future Farming Fund", "Sustainable Growth Partners"],
    tractionMetrics: {
      users: 5000,
      revenue: "$2.8M ARR",
      growth: "65% YoY"
    },
    foundedYear: 2019,
    location: "Des Moines, IA",
    founders: ["John Miller", "Maria Garcia"],
    source: "Crunchbase",
    scrapedDate: new Date(),
    trendingScore: 73
  },
  {
    name: "LegalAssist AI",
    website: "https://legalassist.ai",
    description: "AI-powered legal document analysis and contract management",
    industry: ["Legal Tech", "Artificial Intelligence", "Enterprise Software"],
    fundingStage: "Seed",
    totalFunding: 3800000,
    lastFundingDate: new Date("2023-08-30"),
    lastFundingAmount: 3800000,
    investors: ["Legal Innovation Capital", "AI Ventures"],
    tractionMetrics: {
      users: 250,
      revenue: "$900K ARR",
      growth: "140% YoY"
    },
    foundedYear: 2021,
    location: "Washington, DC",
    founders: ["Katherine Johnson", "Mark Davis"],
    source: "AngelList",
    scrapedDate: new Date(),
    trendingScore: 71
  },
  {
    name: "SpaceTech Systems",
    website: "https://spacetech.systems",
    description: "Affordable satellite launch and deployment services for small payloads",
    industry: ["Space", "Aerospace", "Hardware"],
    fundingStage: "Series B",
    totalFunding: 45000000,
    lastFundingDate: new Date("2023-05-15"),
    lastFundingAmount: 25000000,
    investors: ["Space Ventures", "Orbital Capital", "Future Frontiers Fund"],
    tractionMetrics: {
      users: 15,
      revenue: "$12M ARR",
      growth: "50% YoY"
    },
    foundedYear: 2018,
    location: "Houston, TX",
    founders: ["Dr. Alan Chen", "Samantha Williams"],
    source: "TechCrunch",
    scrapedDate: new Date(),
    trendingScore: 68
  }
];

// Mock data for market trends (in a real app, this would use web scraping and NLP)
const mockMarketTrends: MarketTrend[] = [
  {
    trend: "Zero-Knowledge Proof Adoption",
    description: "Growing adoption of zero-knowledge proofs for privacy-preserving computation across industries.",
    industry: ["Blockchain", "Cybersecurity", "Fintech"],
    impactLevel: "High",
    timeframe: "Mid-term",
    sources: ["CoinDesk", "TechCrunch", "Blockchain Research Papers"],
    relatedStartups: ["ZKSecure", "PrivacyChain", "ZKTech"],
    opportunities: [
      "Build privacy-focused applications", 
      "Create ZK-based authentication solutions",
      "Develop compliance tools using ZK proofs"
    ],
    threats: [
      "High technical barriers to entry",
      "Scalability challenges"
    ],
    sentimentScore: 0.85,
    momentumScore: 0.78,
    dateIdentified: new Date("2023-09-20")
  },
  {
    trend: "Vertical SaaS Expansion",
    description: "Industry-specific SaaS solutions gaining traction with specialized features for unique workflows.",
    industry: ["SaaS", "Enterprise Software", "Industry-Specific Tech"],
    impactLevel: "High",
    timeframe: "Short-term",
    sources: ["SaaS Quarterly", "Industry Reports", "VC Trend Analysis"],
    relatedStartups: ["RestaurantOS", "ConstructionCloud", "LegalFlow"],
    opportunities: [
      "Target underserved industries",
      "Create deep workflow integrations",
      "Build industry-specific AI features"
    ],
    threats: [
      "Market fragmentation",
      "Limited TAM per vertical"
    ],
    sentimentScore: 0.92,
    momentumScore: 0.85,
    dateIdentified: new Date("2023-09-15")
  },
  {
    trend: "Digital Twin Expansion Beyond Manufacturing",
    description: "Digital twin technology expanding from manufacturing to healthcare, smart cities, and retail.",
    industry: ["IoT", "Healthcare", "Smart Cities", "Retail Tech"],
    impactLevel: "Medium",
    timeframe: "Mid-term",
    sources: ["IoT Analytics", "Gartner Research", "Industry Reports"],
    relatedStartups: ["TwinHealth", "CityTwin", "RetailMirror"],
    opportunities: [
      "Create industry-specific digital twin platforms",
      "Develop visualization and simulation tools",
      "Build predictive maintenance solutions"
    ],
    threats: [
      "Data quality and integration challenges",
      "High implementation costs"
    ],
    sentimentScore: 0.75,
    momentumScore: 0.65,
    dateIdentified: new Date("2023-08-10")
  },
  {
    trend: "API-First Companies",
    description: "Rise of companies building their entire business around specialized APIs and developer tools.",
    industry: ["Developer Tools", "Enterprise Software", "FinTech"],
    impactLevel: "High",
    timeframe: "Short-term",
    sources: ["TechCrunch", "Developer Surveys", "VC Funding Reports"],
    relatedStartups: ["Stripe", "Twilio", "Plaid", "API-First Startups"],
    opportunities: [
      "Create developer-focused APIs for complex industries",
      "Build API management and analytics tools",
      "Develop specialized API marketplaces"
    ],
    threats: [
      "Commoditization risk",
      "Dependency on platform ecosystems"
    ],
    sentimentScore: 0.88,
    momentumScore: 0.80,
    dateIdentified: new Date("2023-09-01")
  },
  {
    trend: "Carbon Accounting Solutions",
    description: "Growing demand for software that helps companies measure, report, and reduce their carbon footprint.",
    industry: ["CleanTech", "Enterprise Software", "Sustainability"],
    impactLevel: "Medium",
    timeframe: "Mid-term",
    sources: ["Climate Tech VC", "ESG Reports", "Regulatory Updates"],
    relatedStartups: ["CarbonTrack", "EmissionIQ", "ClimateOS"],
    opportunities: [
      "Create industry-specific carbon accounting tools",
      "Develop supply chain emissions tracking",
      "Build carbon offset marketplaces"
    ],
    threats: [
      "Evolving regulatory landscape",
      "Challenges in standardization"
    ],
    sentimentScore: 0.82,
    momentumScore: 0.70,
    dateIdentified: new Date("2023-07-15")
  }
];

// Function to simulate web scraping for market trends
export const analyzeMarketTrends = async (industries?: string[]): Promise<{ success: boolean; data?: MarketTrend[]; error?: string }> => {
  try {
    // In a real app, this would call web scraping services and NLP analysis
    // Wait a bit to simulate the scraping process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Filter trends by industry if specified
    let trends = [...mockMarketTrends];
    if (industries && industries.length > 0) {
      trends = trends.filter(trend => 
        trend.industry.some(ind => 
          industries.some(industry => 
            ind.toLowerCase().includes(industry.toLowerCase())
          )
        )
      );
    }
    
    // Save to database for future reference
    try {
      const { db } = await connectToDatabase();
      
      // Store trends in the database with timestamp
      const timestamp = new Date();
      const trendsToInsert = trends.map(trend => ({
        ...trend,
        scrapedDate: timestamp
      }));
      
      await db.collection('marketTrends').insertMany(trendsToInsert);
    } catch (dbError) {
      console.error('Error saving market trends to database:', dbError);
      // Continue even if database save fails
    }
    
    return { success: true, data: trends };
  } catch (error) {
    console.error('Error analyzing market trends:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to analyze market trends' 
    };
  }
};

// Function to simulate web scraping for trending startups
export const scrapeTrendingStartups = async (industries?: string[]): Promise<{ success: boolean; data?: TrendingStartup[]; error?: string }> => {
  try {
    // In a real app, this would use web scraping to get data from Crunchbase, AngelList, etc.
    // Wait a bit to simulate the scraping process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filter startups by industry if specified
    let startups = [...mockTrendingStartups];
    if (industries && industries.length > 0) {
      startups = startups.filter(startup => 
        startup.industry.some(ind => 
          industries.some(industry => 
            ind.toLowerCase().includes(industry.toLowerCase())
          )
        )
      );
    }
    
    // Save to database for future reference
    try {
      const { db } = await connectToDatabase();
      
      // Update timestamps
      const timestamp = new Date();
      const startupsToInsert = startups.map(startup => ({
        ...startup,
        scrapedDate: timestamp
      }));
      
      await db.collection('trendingStartups').insertMany(startupsToInsert);
    } catch (dbError) {
      console.error('Error saving trending startups to database:', dbError);
      // Continue even if database save fails
    }
    
    return { success: true, data: startups };
  } catch (error) {
    console.error('Error scraping trending startups:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to scrape trending startups' 
    };
  }
};

// Function to get trending startups from the database or scrape if needed
export const getTrendingStartups = async (industries?: string[], limit: number = 10): Promise<{ success: boolean; data?: TrendingStartup[]; error?: string }> => {
  try {
    const { db } = await connectToDatabase();
    
    // Create query based on industries
    const query = industries && industries.length > 0 
      ? { industry: { $in: industries } }
      : {};
    
    // Get startups from database
    const dbStartups = await db.collection('trendingStartups')
      .find(query)
      .sort({ trendingScore: -1 })
      .limit(limit)
      .toArray();
    
    // If we have enough results, return them
    if (dbStartups && dbStartups.length > 0) {
      // Cast to ensure the correct return type
      return { 
        success: true, 
        data: dbStartups as unknown as TrendingStartup[]
      };
    }
    
    // Otherwise, scrape new data
    return await scrapeTrendingStartups(industries);
  } catch (error) {
    console.error('Error getting trending startups:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to get trending startups' 
    };
  }
};
