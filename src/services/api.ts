
// This file serves as a central export point for all API services

// Export startup-related services
export {
  getStartups,
  getStartupById,
  createStartup,
  getPitchDecksForStartup,
  createPitchDeck
} from './startupService';

// Export investor-related services
export {
  getInvestors,
  getInvestorById,
  createInvestor,
  matchInvestorsForStartup
} from './investorService';

// Export market insights services
export {
  getMarketInsights,
  getRealtimeMarketInsights,
  getTrendingStartupsAPI
} from './marketInsightService';

// Export AI services
export {
  validateStartupIdea,
  saveChatHistory,
  getChatHistory
} from './aiService';
