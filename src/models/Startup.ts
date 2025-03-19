
import { ObjectId } from 'mongodb';

export interface Founder {
  id: string;
  name: string;
  email: string;
  role: string;
  linkedin?: string;
  twitter?: string;
  bio?: string;
}

export interface MarketAnalysis {
  marketSize: number;
  cagr: number;
  topCompetitors: string[];
  barriers: string[];
  opportunities: string[];
  threats: string[];
  targetCustomers: string[];
}

export interface AIValidation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  marketPotential: number;
  innovation: number;
  feasibility: number;
  financialViability: number;
  teamCompetence: number;
  recommendation: string;
  timestamp: Date;
}

export interface BusinessModel {
  revenueStreams: string[];
  costStructure: string[];
  customerSegments: string[];
  valueProposition: string;
  channels: string[];
  keyActivities: string[];
  keyResources: string[];
  keyPartners: string[];
}

export interface RiskAssessment {
  overallScore: number;
  marketRisks: { risk: string; impact: number; probability: number }[];
  financialRisks: { risk: string; impact: number; probability: number }[];
  legalRisks: { risk: string; impact: number; probability: number }[];
  technicalRisks: { risk: string; impact: number; probability: number }[];
  mitigationStrategies: string[];
}

export interface GrowthStrategy {
  strategy: string;
  channels: string[];
  kpis: string[];
  estimatedCost: number;
  estimatedROI: number;
  timeframe: string;
}

export interface TokenizationDetails {
  tokenName?: string;
  tokenSymbol?: string;
  totalSupply?: number;
  tokenomics?: {
    team: number;
    investors: number;
    community: number;
    reserve: number;
  };
  smartContractAddress?: string;
  blockchain?: string;
}

export interface Startup {
  _id?: ObjectId;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  industry: string[];
  founders: Founder[];
  fundingStage: 'Idea' | 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+' | 'Bootstrapped';
  fundingNeeded?: number;
  fundingRaised?: number;
  investorMatches?: string[];
  website?: string;
  logo?: string;
  pitchDeck?: string;
  businessPlan?: string;
  marketAnalysis?: MarketAnalysis;
  aiValidations?: AIValidation[];
  businessModel?: BusinessModel;
  competitors?: string[];
  growthStrategies?: GrowthStrategy[];
  riskAssessment?: RiskAssessment;
  tokenization?: TokenizationDetails;
  createdAt: Date;
  updatedAt: Date;
}
