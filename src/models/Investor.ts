
export interface Investment {
  startupName: string;
  startupId?: string;
  amount: number;
  date: Date;
  stage: 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+';
  status: 'Pending' | 'Completed' | 'Exited';
  equityPercentage?: number;
  exitMultiple?: number;
  notes?: string;
}

export interface Investor {
  _id?: string;
  name: string;
  type: 'Angel' | 'VC' | 'Corporate' | 'Accelerator' | 'Family Office' | 'Crowdfunding';
  firm?: string;
  location: {
    city: string;
    state?: string;
    country: string;
  };
  investmentRange: {
    min: number;
    max: number;
  };
  industries: string[];
  fundingStages: ('Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+')[];
  portfolio: Investment[];
  bio?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  avatar?: string;
  email?: string;
  phone?: string;
  investmentThesis?: string;
  investmentCriteria?: string[];
  avgCheckSize?: number;
  leadInvestor: boolean;
  coinvestors?: string[];
  createdAt: Date;
  updatedAt: Date;
}
