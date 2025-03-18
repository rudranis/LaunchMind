
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Brain, TrendingUp, Users } from 'lucide-react';
import IdeaValidator from '@/components/dashboard/IdeaValidator';
import MarketTrends from '@/components/dashboard/MarketTrends';
import InvestorMatch from '@/components/dashboard/InvestorMatch';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('validator');

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Monitor your startup journey, validate ideas, and find investors
        </p>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-flex mb-8">
            <TabsTrigger value="validator" className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Idea Validator</span>
              <span className="sm:hidden">Validator</span>
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Market Trends</span>
              <span className="sm:hidden">Trends</span>
            </TabsTrigger>
            <TabsTrigger value="investors" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Find Investors</span>
              <span className="sm:hidden">Investors</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="animate-fade-in">
            <TabsContent value="validator" className="mt-0">
              <IdeaValidator />
            </TabsContent>
            
            <TabsContent value="trends" className="mt-0">
              <MarketTrends />
            </TabsContent>
            
            <TabsContent value="investors" className="mt-0">
              <InvestorMatch />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
