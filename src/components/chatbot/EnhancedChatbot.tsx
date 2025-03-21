
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  X, 
  Maximize2, 
  Minimize2,
  Lightbulb,
  TrendingUp,
  Users,
  Search,
  Mic,
  MicOff,
  Settings,
  BarChart3,
  BookOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getChatHistory, saveChatHistory } from '@/services/api';
import { v4 as uuidv4 } from 'uuid';

// Enhanced responses based on specialized categories
const RESPONSES = {
  ideaValidation: [
    "Based on market analysis of similar startups, your idea shows strong potential with a 78% market-fit score. Consider these improvements: 1) Focus on customer acquisition strategy, 2) Develop a clear monetization model, 3) Identify key strategic partnerships early.",
    "I've analyzed your startup idea against current market trends. It shows excellent potential in addressing an underserved market segment. Key strengths: innovative approach, scalable model. Suggested improvements: strengthen IP protection strategy, expand initial target market.",
    "Market analysis indicates your concept addresses a growing pain point. SWOT Analysis - Strengths: Unique solution, scalable model. Weaknesses: High customer acquisition costs. Opportunities: Expanding market in Asia-Pacific region. Threats: Potential for established competitors to pivot."
  ],
  investorMatching: [
    "Based on your startup profile in AI healthcare, I recommend approaching these investors: 1) Sarah Johnson at Horizon Health Ventures (avg investment $1-3M), 2) BlueCross Innovation Fund, 3) AI Catalyst Partners. Customize your pitch to emphasize market validation and regulatory compliance.",
    "For your fintech solution focusing on SMB payments, these investors would be ideal matches: 1) FinTech Growth Fund (average investment $2-5M), 2) Maria Chen at PayTech Ventures (focuses on B2B payment solutions), 3) Digital Payments Accelerator program (application deadline in 30 days).",
    "Your clean energy startup would appeal to: 1) GreenTech Partners ($3-8M investment range), 2) Sustainable Future Fund (specifically seeking solar innovations), 3) Climate Solutions Accelerator (offers $250K seed funding plus mentorship). Emphasize your proprietary technology and carbon reduction metrics."
  ],
  marketTrends: [
    "Latest market analysis shows 3 emerging trends in your industry: 1) Shift toward subscription-based models (+43% YoY growth), 2) Integration of AI for personalization (adopted by 67% of market leaders), 3) Increasing focus on sustainability metrics. Consider aligning your roadmap accordingly.",
    "Recent data indicates these market shifts in your sector: 1) Consolidation among smaller players (8 acquisitions in Q2), 2) Growing demand for embedded financial services (58% CAGR), 3) Regulatory changes favoring startups with transparent data practices. Your positioning aligns well with trends #1 and #3.",
    "Industry analysis reveals: 1) Supply chain optimization solutions seeing 37% growth, 2) Rising customer acquisition costs (+22% YoY), 3) Shift toward hybrid service models combining automation with human expertise. Consider emphasizing your solution's supply chain efficiencies."
  ],
  pitchDeck: [
    "Analyzing successful pitch decks in your industry reveals these critical elements: 1) Lead with market pain point validation (data-backed), 2) Demonstrate early traction metrics prominently on slide 3, 3) Include clear competitor differentiation matrix, 4) Detail customer acquisition strategy with CAC/LTV projections.",
    "For your SaaS pitch deck, focus on: 1) Problem statement with specific market size ($4.3B TAM), 2) Solution with clear value proposition, 3) Business model highlighting recurring revenue, 4) Traction with logos/testimonials, 5) Team slide emphasizing domain expertise, 6) Clear ask with funding allocation.",
    "Your hardware startup pitch should emphasize: 1) Proprietary technology with patent status, 2) Manufacturing scalability plan, 3) Unit economics breakdown, 4) Go-to-market strategy with initial customer targets, 5) Team's technical expertise, 6) Funding needs with clear milestones tied to capital deployment."
  ],
  legalCompliance: [
    "For your startup in the US, key legal considerations include: 1) Delaware C-Corp formation recommended for investor appeal, 2) Standard founder vesting schedule (4 years with 1-year cliff), 3) IP assignment agreements for all team members, 4) Privacy policy compliance with CCPA if targeting California users.",
    "EU startup legal requirements include: 1) GDPR compliance for data collection, 2) Standard contractual clauses for international data transfers, 3) Local corporate entity in at least one EU member state, 4) VAT registration if exceeding country-specific thresholds. Templates for policies available.",
    "For fintech startups, regulatory requirements include: 1) Money transmitter licenses in operating states, 2) KYC/AML compliance program, 3) Data security certifications (SOC 2 recommended), 4) Consumer lending licenses if offering credit. Budget 8-12 months for regulatory approvals."
  ],
  fundingOpportunities: [
    "Current grant opportunities for your sector: 1) NSF SBIR Phase I ($275K, deadline in 60 days), 2) Clean Energy Business Incubator Program (non-dilutive $50K + resources), 3) Climate Tech Accelerator (application opens next month, $100K investment for 5% equity).",
    "Funding options for your AI healthcare solution: 1) NIH Small Business Innovation Research grants (up to $325K, deadline next quarter), 2) Impact Ventures Healthcare Fund (seeking Series A investments $2-5M), 3) MedTech Accelerator program (applications close in 45 days).",
    "Relevant funding sources for your edtech startup: 1) EdSurge Innovation Fund (non-dilutive $75K, application deadline in 30 days), 2) Learn Capital (seeking early-stage investments $1-3M), 3) GSV Acceleration Program (8-week program + $100K investment, rolling applications)."
  ],
  trendingStartups: [
    "Based on our real-time data scraping, these startups in your industry are showing exceptional traction: 1) NeuralLens AI (Computer vision, $8.5M Series A), 2) FinanceFlow (Financial forecasting, $3.2M Seed), 3) MediSync (Remote patient monitoring, $12M Series A). Consider analyzing their growth strategies for insights.",
    "Latest trending startups in your sector: 1) ClimateOS (Carbon tracking platform, $15M Series A), 2) SupplyMind (Supply chain optimization, $7.2M Seed), 3) EdTechPro (Personalized learning, $5.3M Seed). Key pattern: All three have strong AI components and subscription revenue models.",
    "Our web scraping identified these fast-growing startups to watch: 1) Quantum Commerce (AI-powered e-commerce, $22M Series A), 2) CyberShield (Zero-trust security, $18M Series A), 3) DataEthics (Privacy-focused analytics, $4.7M Seed). All show strong product-led growth strategies worth examining."
  ]
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  category?: 'ideaValidation' | 'investorMatching' | 'marketTrends' | 'pitchDeck' | 'legalCompliance' | 'fundingOpportunities' | 'trendingStartups';
}

interface EnhancedChatbotProps {
  initialIsOpen?: boolean;
  initialIsExpanded?: boolean;
}

const EnhancedChatbot = ({ initialIsOpen = false, initialIsExpanded = false }: EnhancedChatbotProps) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [aiModel, setAiModel] = useState<string>('gemini');
  const [isListening, setIsListening] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize session ID and load chat history
  useEffect(() => {
    // Get or create session ID from localStorage
    let storedSessionId = localStorage.getItem('chatSessionId');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('chatSessionId', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Load chat history for this session
    const loadChatHistory = async () => {
      try {
        const result = await getChatHistory(storedSessionId);
        if (result.success && result.data && result.data.length > 0) {
          setMessages(result.data);
        } else {
          // If no history or error, set initial greeting
          setMessages([{
            id: '1',
            text: "Hello! I'm your AI startup assistant powered by Gemini AI. I can help with idea validation, investor matching, market trends, pitch deck creation, legal compliance, and funding opportunities. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date(),
          }]);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Set initial greeting if error
        setMessages([{
          id: '1',
          text: "Hello! I'm your AI startup assistant powered by Gemini AI. I can help with idea validation, investor matching, market trends, pitch deck creation, legal compliance, and funding opportunities. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date(),
        }]);
      }
    };

    if (isOpen) {
      loadChatHistory();
    }
  }, [isOpen]);

  // Save messages to database when they change
  useEffect(() => {
    const saveMessages = async () => {
      if (sessionId && messages.length > 0) {
        await saveChatHistory(sessionId, messages);
      }
    };

    // Don't save on initial load
    if (messages.length > 1) {
      saveMessages();
    }
  }, [messages, sessionId]);

  // Initial bot greeting when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        text: "Hello! I'm your AI startup assistant powered by Gemini AI. I can help with idea validation, investor matching, market trends, pitch deck creation, legal compliance, and funding opportunities. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length]);

  // Voice recognition setup
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      speechRecognition.current = new SpeechRecognition();
      speechRecognition.current.continuous = true;
      speechRecognition.current.interimResults = true;
      
      speechRecognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setMessage(transcript);
      };
      
      speechRecognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: 'Voice Recognition Error',
          description: `Error: ${event.error}. Please try again.`,
          variant: 'destructive'
        });
      };
    }
    
    return () => {
      if (speechRecognition.current) {
        speechRecognition.current.stop();
      }
    };
  }, [toast]);

  const toggleListening = () => {
    if (!speechRecognition.current) {
      toast({
        title: 'Voice Recognition Not Supported',
        description: 'Your browser does not support voice recognition.',
        variant: 'destructive'
      });
      return;
    }
    
    if (isListening) {
      speechRecognition.current.stop();
      setIsListening(false);
    } else {
      speechRecognition.current.start();
      setIsListening(true);
      toast({
        title: 'Voice Recognition Active',
        description: 'Speak now and your voice will be transcribed.',
      });
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Stop voice recognition if active
    if (isListening && speechRecognition.current) {
      speechRecognition.current.stop();
      setIsListening(false);
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    // Determine message category based on keywords and context
    let category: 'ideaValidation' | 'investorMatching' | 'marketTrends' | 'pitchDeck' | 'legalCompliance' | 'fundingOpportunities' | 'trendingStartups' = 'ideaValidation';
    
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes('investor') || lowerCaseMessage.includes('funding') || lowerCaseMessage.includes('vc') || lowerCaseMessage.includes('venture capital')) {
      category = 'investorMatching';
    } else if (lowerCaseMessage.includes('market') || lowerCaseMessage.includes('trend') || lowerCaseMessage.includes('industry') || lowerCaseMessage.includes('competition')) {
      category = 'marketTrends';
    } else if (lowerCaseMessage.includes('pitch') || lowerCaseMessage.includes('deck') || lowerCaseMessage.includes('presentation') || lowerCaseMessage.includes('slide')) {
      category = 'pitchDeck';
    } else if (lowerCaseMessage.includes('legal') || lowerCaseMessage.includes('compliance') || lowerCaseMessage.includes('regulation') || lowerCaseMessage.includes('law')) {
      category = 'legalCompliance';
    } else if (lowerCaseMessage.includes('grant') || lowerCaseMessage.includes('opportunity') || lowerCaseMessage.includes('accelerator') || lowerCaseMessage.includes('incubator')) {
      category = 'fundingOpportunities';
    } else if (lowerCaseMessage.includes('trending') || lowerCaseMessage.includes('popular') || lowerCaseMessage.includes('top startups') || lowerCaseMessage.includes('successful startups')) {
      category = 'trendingStartups';
    }

    // Simulate AI processing delay (in a real app, this would call the Gemini API)
    setTimeout(() => {
      // Get random response from the category
      const responses = RESPONSES[category];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date(),
        category,
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      
      toast({
        title: `${aiModel === 'gemini' ? 'Gemini' : 'GPT-4'} Analysis Complete`,
        description: `AI has analyzed your ${getCategoryLabel(category).toLowerCase()} query`,
      });
    }, 2000);
  };

  const getCategoryLabel = (category: string | undefined) => {
    if (!category) return '';
    
    const categories = {
      ideaValidation: 'Idea Validation',
      investorMatching: 'Investor Match',
      marketTrends: 'Market Trends',
      pitchDeck: 'Pitch Deck',
      legalCompliance: 'Legal Compliance',
      fundingOpportunities: 'Funding Opportunities',
      trendingStartups: 'Trending Startups',
    };
    
    return categories[category as keyof typeof categories];
  };

  const getCategoryBadge = (category: string | undefined) => {
    if (!category) return null;
    
    const categories = {
      ideaValidation: { label: 'Idea Validation', class: 'bg-blue-100 text-blue-800' },
      investorMatching: { label: 'Investor Match', class: 'bg-purple-100 text-purple-800' },
      marketTrends: { label: 'Market Trends', class: 'bg-green-100 text-green-800' },
      pitchDeck: { label: 'Pitch Deck', class: 'bg-orange-100 text-orange-800' },
      legalCompliance: { label: 'Legal Compliance', class: 'bg-red-100 text-red-800' },
      fundingOpportunities: { label: 'Funding Opportunities', class: 'bg-cyan-100 text-cyan-800' },
      trendingStartups: { label: 'Trending Startups', class: 'bg-emerald-100 text-emerald-800' },
    };
    
    const categoryInfo = categories[category as keyof typeof categories];
    
    return (
      <Badge variant="outline" className={`${categoryInfo.class} ml-2 text-xs`}>
        {categoryInfo.label}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string | undefined) => {
    if (!category) return <Lightbulb size={14} />;
    
    const icons = {
      ideaValidation: <Lightbulb size={14} />,
      investorMatching: <Users size={14} />,
      marketTrends: <TrendingUp size={14} />,
      pitchDeck: <BookOpen size={14} />,
      legalCompliance: <Bot size={14} />,
      fundingOpportunities: <Search size={14} />,
      trendingStartups: <BarChart3 size={14} />,
    };
    
    return icons[category as keyof typeof icons];
  };

  // Filter messages by category
  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
  };

  const filteredMessages = selectedCategory 
    ? messages.filter(msg => msg.category === selectedCategory || msg.sender === 'user')
    : messages;

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={() => setIsOpen(true)} 
                size="icon" 
                className="rounded-full h-14 w-14 shadow-lg bg-primary hover:bg-primary/90 text-white"
              >
                <MessageSquare size={24} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Chat with AI Assistant</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 shadow-xl rounded-2xl ${
        isExpanded ? 'w-[90vw] h-[80vh] sm:w-[600px] sm:h-[70vh]' : 'w-[350px] h-[500px]'
      }`}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="px-4 py-3 flex flex-row items-center justify-between space-y-0 border-b">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2 bg-primary/10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot size={16} />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-base flex items-center">
              {aiModel === 'gemini' ? 'Gemini' : 'GPT-4'} AI Startup Assistant
            </CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Settings size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </Button>
          </div>
        </CardHeader>
        
        {isSettingsOpen && (
          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-medium mb-2">Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">AI Model</label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select AI Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Gemini Pro</SelectItem>
                    <SelectItem value="gpt4">GPT-4</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Chat History</label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setMessages([{
                      id: '1',
                      text: "Hello! I'm your AI startup assistant. How can I help you today?",
                      sender: 'bot',
                      timestamp: new Date(),
                    }]);
                    toast({
                      title: 'Chat History Cleared',
                      description: 'Your conversation history has been reset.'
                    });
                  }}
                >
                  Clear Chat History
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {isExpanded && (
          <div className="px-4 py-2 border-b flex space-x-2 overflow-x-auto">
            <Button 
              variant={selectedCategory === null ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => handleCategorySelect(null)}
            >
              All
            </Button>
            <Button 
              variant={selectedCategory === 'ideaValidation' ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => handleCategorySelect('ideaValidation')}
            >
              <Lightbulb size={12} className="mr-1" /> Idea Validation
            </Button>
            <Button 
              variant={selectedCategory === 'investorMatching' ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => handleCategorySelect('investorMatching')}
            >
              <Users size={12} className="mr-1" /> Investor Matching
            </Button>
            <Button 
              variant={selectedCategory === 'marketTrends' ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => handleCategorySelect('marketTrends')}
            >
              <TrendingUp size={12} className="mr-1" /> Market Trends
            </Button>
            <Button 
              variant={selectedCategory === 'trendingStartups' ? "default" : "outline"} 
              size="sm" 
              className="text-xs h-7"
              onClick={() => handleCategorySelect('trendingStartups')}
            >
              <BarChart3 size={12} className="mr-1" /> Trending Startups
            </Button>
          </div>
        )}
        
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="flex items-center">
                  {msg.sender === 'bot' && (
                    <div className="flex items-center">
                      <span className="text-xs font-semibold mr-1">{aiModel === 'gemini' ? 'Gemini' : 'GPT-4'}:</span>
                      {getCategoryIcon(msg.category)}
                      {getCategoryBadge(msg.category)}
                    </div>
                  )}
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                <div className="flex justify-end mt-1">
                  <span className="text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted max-w-[80%] rounded-lg px-4 py-2">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                  <span className="text-xs ml-1">{aiModel === 'gemini' ? 'Gemini' : 'GPT-4'} analyzing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <div className="p-4 border-t">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex space-x-2"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about startup ideas, investors, market trends..."
              className="flex-grow"
            />
            <Button 
              type="button" 
              size="icon" 
              variant={isListening ? "default" : "outline"}
              onClick={toggleListening}
              className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </Button>
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send size={18} />
            </Button>
          </form>
          {isExpanded && (
            <div className="mt-2 text-xs text-muted-foreground">
              <p>Try asking: "Analyze the market potential for my AI healthcare startup" or "Find investors for my fintech solution"</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default EnhancedChatbot;
