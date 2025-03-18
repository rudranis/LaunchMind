
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Send, Bot, X, Maximize2, Minimize2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

// Predefined responses based on request type
const RESPONSES = {
  ideaValidation: [
    "Your startup idea shows strong potential in the current market. Consider focusing on these aspects: 1) Clear value proposition, 2) Market fit analysis, 3) Competition differentiation.",
    "I've analyzed your idea against current market trends. There's a 72% match with emerging market needs. Consider refining your revenue model for better investor appeal.",
    "Based on recent startup success patterns, your idea has promising elements but faces significant competition. Consider pivoting to focus on underserved market segments."
  ],
  investorMatching: [
    "Based on your startup profile, I recommend approaching angel investors specializing in early-stage SaaS startups. Top matches: Sarah Johnson (Horizon Ventures), Michael Chang (Blue Oak Capital).",
    "Your startup would be a good fit for seed funding from VCs focused on AI technologies. Consider applying to TechStars or Y Combinator's next cohort.",
    "For your fintech solution, targeting specialized investors like FinTech Ventures and Blockchain Capital would yield higher response rates than general VCs."
  ],
  marketTrends: [
    "Current market trends show increasing investor interest in sustainable technology solutions, with a 43% funding increase in Q2 compared to last year.",
    "AI-powered healthcare solutions are trending upward with 5x growth in early-stage investments. Your solution aligns well with this trend.",
    "Recent market analysis indicates a potential saturation in food delivery startups. Consider highlighting your unique differentiators or exploring adjacent markets."
  ],
  pitchDeck: [
    "I've analyzed successful pitch decks in your industry. Key recommendations: 1) Start with a compelling problem statement, 2) Include clear market size data, 3) Demonstrate traction metrics.",
    "Top performing pitch decks in 2023 emphasize team expertise and adaptability. Consider expanding your team slide to highlight relevant experience.",
    "Your pitch deck structure is strong. Consider adding competitive analysis and go-to-market strategy slides to address common investor questions."
  ],
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  category?: 'ideaValidation' | 'investorMatching' | 'marketTrends' | 'pitchDeck';
}

const ChatbotInterface = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial bot greeting when chat is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: '1',
        text: "Hello! I'm your AI startup assistant. I can help with idea validation, investor matching, market trends, and pitch deck creation. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

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

    // Determine message category based on keywords
    let category: 'ideaValidation' | 'investorMatching' | 'marketTrends' | 'pitchDeck' = 'ideaValidation';
    
    if (message.toLowerCase().includes('investor') || message.toLowerCase().includes('funding')) {
      category = 'investorMatching';
    } else if (message.toLowerCase().includes('market') || message.toLowerCase().includes('trend')) {
      category = 'marketTrends';
    } else if (message.toLowerCase().includes('pitch') || message.toLowerCase().includes('deck')) {
      category = 'pitchDeck';
    }

    // Simulate AI processing delay
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
        title: "New AI insight available",
        description: "The assistant has analyzed your request",
      });
    }, 1500);
  };

  const getCategoryBadge = (category: string | undefined) => {
    if (!category) return null;
    
    const categories = {
      ideaValidation: { label: 'Idea Validation', class: 'bg-blue-100 text-blue-800' },
      investorMatching: { label: 'Investor Match', class: 'bg-purple-100 text-purple-800' },
      marketTrends: { label: 'Market Trends', class: 'bg-green-100 text-green-800' },
      pitchDeck: { label: 'Pitch Deck', class: 'bg-orange-100 text-orange-800' },
    };
    
    const categoryInfo = categories[category as keyof typeof categories];
    
    return (
      <Badge variant="outline" className={`${categoryInfo.class} ml-2 text-xs`}>
        {categoryInfo.label}
      </Badge>
    );
  };

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
            <CardTitle className="text-base">AI Startup Assistant</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
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
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
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
                    <span className="text-xs font-semibold mr-1">AI:</span>
                  )}
                  {getCategoryBadge(msg.category)}
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
                  <span className="text-xs ml-1">AI is thinking...</span>
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
              placeholder="Ask about idea validation, investors..."
              className="flex-grow"
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send size={18} />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default ChatbotInterface;
