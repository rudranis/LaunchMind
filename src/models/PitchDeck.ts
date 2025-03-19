
export interface Slide {
  type: 'problem' | 'solution' | 'market' | 'product' | 'traction' | 'business-model' | 'competition' | 'team' | 'financials' | 'ask' | 'custom';
  title: string;
  content: string;
  imageUrl?: string;
  chartData?: any;
  order: number;
}

export interface AiFeedback {
  slideId: string;
  feedback: string;
  suggestions: string[];
  score: number;
  timestamp: Date;
}

export interface PitchDeck {
  _id?: string;
  startupId: string;
  title: string;
  version: number;
  slides: Slide[];
  feedback?: AiFeedback[];
  overallScore?: number;
  coverImageUrl?: string;
  theme?: string;
  presentationUrl?: string;
  publicUrl?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}
