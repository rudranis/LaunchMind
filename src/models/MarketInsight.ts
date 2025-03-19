
export interface CompetitorAnalysis {
  name: string;
  website?: string;
  fundingTotal?: number;
  lastFundingRound?: {
    amount: number;
    date: Date;
    investors: string[];
    stage: string;
  };
  founded?: number;
  employees?: string;
  valuation?: number;
  revenueEstimate?: string;
  businessModel?: string;
  keyFeatures?: string[];
  strengths?: string[];
  weaknesses?: string[];
  targetCustomers?: string[];
  marketShare?: number;
  growthRate?: number;
}

export interface MarketTrend {
  trend: string;
  description: string;
  industry: string[];
  impactLevel: 'Low' | 'Medium' | 'High';
  timeframe: 'Short-term' | 'Mid-term' | 'Long-term';
  sources: string[];
  relatedStartups?: string[];
  opportunities?: string[];
  threats?: string[];
}

export interface MarketInsight {
  _id?: string;
  industry: string[];
  marketSize: number;
  cagr: number;
  year: number;
  trends: MarketTrend[];
  competitors: CompetitorAnalysis[];
  keyPlayers: string[];
  regulatoryConsiderations?: string[];
  barriers?: string[];
  technologicalDrivers?: string[];
  consumerBehaviors?: string[];
  report?: string;
  lastUpdated: Date;
}
