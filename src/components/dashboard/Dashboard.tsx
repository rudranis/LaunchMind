
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Lock } from 'lucide-react';
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
            <div className="flex items-start gap-2">
              <span>You're using the dashboard in guest mode with limited features.</span>
              <span className="flex items-center text-amber-600 text-sm">
                <Lock size={14} className="mr-1"/> Premium features require sign in
              </span>
            </div>
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

      {/* Enhanced Chatbot with Gemini AI integration */}
      <EnhancedChatbot initialIsOpen={true} />

      {/* Feature announcement banner */}
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white shadow-lg">
        <h3 className="font-bold text-lg mb-2">New AI-Powered Features!</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Real-time market trend analysis with ML models</li>
          <li>Trending startups data via web scraping (Crunchbase, AngelList, etc.)</li>
          <li>AI-driven investor matching based on funding history</li>
          <li>Enhanced chatbot with Gemini AI for better startup guidance</li>
        </ul>
        {isGuestMode && (
          <Button 
            onClick={handleSignIn} 
            className="mt-3 bg-white text-purple-700 hover:bg-gray-100"
          >
            Sign In for Full Access
          </Button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
