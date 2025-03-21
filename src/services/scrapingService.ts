
// This file serves as a central export point for all scraping-related services
import { analyzeMarketTrends } from './marketTrendService';
import { getTrendingStartups, scrapeTrendingStartups } from './trendingStartupService';

export {
  analyzeMarketTrends,
  getTrendingStartups,
  scrapeTrendingStartups
};
