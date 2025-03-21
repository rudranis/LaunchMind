
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import IdeaValidator from './IdeaValidator';
import InvestorMatch from './InvestorMatch';
import MarketTrends from './MarketTrends';
import TrendingStartups from './TrendingStartups';
import EnhancedChatbot from '../chatbot/EnhancedChatbot';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('ideas');
  const [isGuestMode, setIsGuestMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is in guest mode
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuestMode(guestMode);
    
    // Add entrance animation class
    document.body.classList.add('fade-in-page');
    setTimeout(() => {
      document.body.classList.remove('fade-in-page');
    }, 1000);
  }, []);

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      {isGuestMode && (
        <Alert className="mb-6 bg-amber-50 border-amber-200">
          <Info className="h-5 w-5 text-amber-500" />
          <AlertTitle className="text-amber-800">Guest Mode</AlertTitle>
          <AlertDescription className="text-amber-700 flex justify-between items-center">
            <span>You're using the dashboard in guest mode with limited features. Sign in to access all features.</span>
            <Button variant="outline" onClick={handleSignIn} className="ml-4 border-amber-300 text-amber-700 hover:bg-amber-100">
              Sign In
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="ideas">Idea Validation</TabsTrigger>
          <TabsTrigger value="investors">Investor Matching</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="trending">Trending Startups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ideas" className="space-y-8">
          <IdeaValidator isGuestMode={isGuestMode} />
        </TabsContent>
        
        <TabsContent value="investors" className="space-y-8">
          <InvestorMatch isGuestMode={isGuestMode} />
        </TabsContent>
        
        <TabsContent value="market" className="space-y-8">
          <MarketTrends />
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-8">
          <TrendingStartups />
        </TabsContent>
      </Tabs>

      {/* Always show the chatbot regardless of active tab */}
      <EnhancedChatbot initialIsOpen={true} />
    </div>
  );
};

export default Dashboard;
