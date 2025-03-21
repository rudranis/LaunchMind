
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IdeaValidator from './IdeaValidator';
import InvestorMatch from './InvestorMatch';
import MarketTrends from './MarketTrends';
import TrendingStartups from './TrendingStartups';
import EnhancedChatbot from '../chatbot/EnhancedChatbot';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('ideas');

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="ideas">Idea Validation</TabsTrigger>
          <TabsTrigger value="investors">Investor Matching</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="trending">Trending Startups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ideas" className="space-y-8">
          <IdeaValidator />
        </TabsContent>
        
        <TabsContent value="investors" className="space-y-8">
          <InvestorMatch />
        </TabsContent>
        
        <TabsContent value="market" className="space-y-8">
          <MarketTrends />
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-8">
          <TrendingStartups />
        </TabsContent>
      </Tabs>

      {/* Always show the chatbot regardless of active tab */}
      <EnhancedChatbot />
    </div>
  );
};

export default Dashboard;
