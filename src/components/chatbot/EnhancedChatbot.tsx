
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
  BookOpen,
  VolumeX,
  Volume2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getChatHistory, saveChatHistory } from '@/services/api';
import { generateAIResponse, generateTextToSpeech, createTypingEffect, OpenAIMessage } from '@/services/openaiService';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  category?: 'ideaValidation' | 'investorMatching' | 'marketTrends' | 'pitchDeck' | 'legalCompliance' | 'fundingOpportunities' | 'trendingStartups';
  isTyping?: boolean;
  audioUrl?: string;
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
  const [aiModel, setAiModel] = useState<string>('gpt4o');
  const [isListening, setIsListening] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [openaiKey, setOpenaiKey] = useState<string>('');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(80);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [showApiKeyAlert, setShowApiKeyAlert] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechRecognition = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize session ID and load chat history
  useEffect(() => {
    // Check if user is in guest mode
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuestMode(guestMode);
    
    // Get or create session ID from localStorage
    let storedSessionId = localStorage.getItem('chatSessionId');
    if (!storedSessionId) {
      storedSessionId = uuidv4();
      localStorage.setItem('chatSessionId', storedSessionId);
    }
    setSessionId(storedSessionId);

    // Check if OpenAI API key is stored
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setOpenaiKey(storedApiKey);
    } else {
      setShowApiKeyAlert(true);
    }

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
            text: "Hello! I'm your AI startup assistant powered by OpenAI. I can help with idea validation, investor matching, market trends, pitch deck creation, legal compliance, and funding opportunities. How can I assist you today?",
            sender: 'bot',
            timestamp: new Date(),
          }]);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        // Set initial greeting if error
        setMessages([{
          id: '1',
          text: "Hello! I'm your AI startup assistant powered by OpenAI. I can help with idea validation, investor matching, market trends, pitch deck creation, legal compliance, and funding opportunities. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date(),
        }]);
      }
    };

    if (isOpen) {
      loadChatHistory();
    }

    // Check for audio preferences
    const speechEnabled = localStorage.getItem('speech_enabled') === 'true';
    setIsSpeechEnabled(speechEnabled);
    
    const storedVolume = localStorage.getItem('audio_volume');
    if (storedVolume) {
      setAudioVolume(parseInt(storedVolume, 10));
    }
  }, [isOpen]);

  // Save messages to database when they change
  useEffect(() => {
    const saveMessages = async () => {
      if (sessionId && messages.length > 0) {
        // Remove typing indicators and other temporary properties
        const cleanMessages = messages.map(msg => ({
          ...msg,
          isTyping: undefined,
          audioUrl: undefined
        }));
        await saveChatHistory(sessionId, cleanMessages);
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
        text: "Hello! I'm your AI startup assistant powered by OpenAI. I can help with idea validation, investor matching, market trends, pitch deck creation, legal compliance, and funding opportunities. How can I assist you today?",
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
      // Clean up any playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.remove();
      }
    };
  }, [toast]);

  // Handle OpenAI API key changes
  useEffect(() => {
    if (openaiKey) {
      localStorage.setItem('openai_api_key', openaiKey);
      setShowApiKeyAlert(false);
    }
  }, [openaiKey]);

  // Handle audio volume changes
  useEffect(() => {
    localStorage.setItem('audio_volume', audioVolume.toString());
    if (currentAudio) {
      currentAudio.volume = audioVolume / 100;
    }
  }, [audioVolume, currentAudio]);

  // Handle speech enabled changes
  useEffect(() => {
    localStorage.setItem('speech_enabled', isSpeechEnabled.toString());
  }, [isSpeechEnabled]);

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

  const determineMessageCategory = (message: string): 'ideaValidation' | 'investorMatching' | 'marketTrends' | 'pitchDeck' | 'legalCompliance' | 'fundingOpportunities' | 'trendingStartups' => {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes('investor') || lowerCaseMessage.includes('funding') || 
        lowerCaseMessage.includes('vc') || lowerCaseMessage.includes('venture capital')) {
      return 'investorMatching';
    } else if (lowerCaseMessage.includes('market') || lowerCaseMessage.includes('trend') || 
               lowerCaseMessage.includes('industry') || lowerCaseMessage.includes('competition')) {
      return 'marketTrends';
    } else if (lowerCaseMessage.includes('pitch') || lowerCaseMessage.includes('deck') || 
               lowerCaseMessage.includes('presentation') || lowerCaseMessage.includes('slide')) {
      return 'pitchDeck';
    } else if (lowerCaseMessage.includes('legal') || lowerCaseMessage.includes('compliance') || 
               lowerCaseMessage.includes('regulation') || lowerCaseMessage.includes('law')) {
      return 'legalCompliance';
    } else if (lowerCaseMessage.includes('grant') || lowerCaseMessage.includes('opportunity') || 
               lowerCaseMessage.includes('accelerator') || lowerCaseMessage.includes('incubator')) {
      return 'fundingOpportunities';
    } else if (lowerCaseMessage.includes('trending') || lowerCaseMessage.includes('popular') || 
               lowerCaseMessage.includes('top startups') || lowerCaseMessage.includes('successful startups')) {
      return 'trendingStartups';
    }
    
    return 'ideaValidation'; // Default category
  };

  const playTextToSpeech = async (text: string) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.remove();
    }
    
    if (!isSpeechEnabled || !openaiKey) return;
    
    try {
      // Generate speech using OpenAI API
      const result = await generateTextToSpeech(text, openaiKey);
      
      if (result.success && result.audioUrl) {
        const audio = new Audio(result.audioUrl);
        audio.volume = audioVolume / 100;
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setCurrentAudio(null);
        };
        
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          toast({
            title: 'Audio Playback Error',
            description: 'Failed to play the generated speech.',
            variant: 'destructive'
          });
        });
        
        // Return the audio URL to update the message
        return result.audioUrl;
      } else {
        console.error('TTS error:', result.error);
        if (result.error) {
          toast({
            title: 'Text-to-Speech Error',
            description: result.error,
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.error('Error generating or playing speech:', error);
    }
    
    return undefined;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Stop voice recognition if active
    if (isListening && speechRecognition.current) {
      speechRecognition.current.stop();
      setIsListening(false);
    }

    // Check for OpenAI API key
    if (!openaiKey) {
      setShowApiKeyAlert(true);
      toast({
        title: 'API Key Required',
        description: 'Please enter your OpenAI API key in settings to continue.',
        variant: 'destructive'
      });
      return;
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
    const category = determineMessageCategory(message);
    
    // Track if guest mode limits apply
    const isPremiumFeature = category === 'investorMatching' || 
                            category === 'pitchDeck' || 
                            category === 'legalCompliance';
    
    if (isPremiumFeature && isGuestMode) {
      // Add a bot message explaining the limitation
      const limitMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, but this feature is only available to signed-in users. Please sign in to access premium features like investor matching, pitch deck creation, and legal compliance analysis.",
        sender: 'bot',
        timestamp: new Date(),
        category: 'ideaValidation', // Use a basic category
      };
      
      setMessages(prev => [...prev, limitMessage]);
      setIsLoading(false);
      
      // Generate speech for the limitation message
      if (isSpeechEnabled) {
        const audioUrl = await playTextToSpeech(limitMessage.text);
        if (audioUrl) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === limitMessage.id ? { ...msg, audioUrl } : msg
            )
          );
        }
      }
      
      return;
    }
    
    try {
      // Prepare messages for OpenAI
      const systemPrompt = getSystemPromptForCategory(category);
      const apiMessages: OpenAIMessage[] = [
        { role: 'system', content: systemPrompt },
      ];
      
      // Add conversation history (max 5 most recent messages)
      const recentMessages = messages.slice(-5);
      recentMessages.forEach(msg => {
        apiMessages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
      
      // Add the current user message
      apiMessages.push({ role: 'user', content: message });
      
      // Add a temporary bot message with typing indicator
      const tempBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: '',
        sender: 'bot',
        timestamp: new Date(),
        category,
        isTyping: true,
      };
      
      setMessages(prev => [...prev, tempBotMessage]);
      
      // Call OpenAI API
      const result = await generateAIResponse(
        apiMessages,
        openaiKey,
        aiModel === 'gpt4o' ? 'gpt-4o' : 'gpt-4o-mini'
      );
      
      if (result.success && result.data) {
        // Prepare the final bot message
        const finalBotMessage: Message = {
          ...tempBotMessage,
          text: result.data,
          isTyping: false,
        };
        
        // Apply typing effect
        const typingEffect = createTypingEffect(
          result.data,
          (text) => {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === tempBotMessage.id ? { ...msg, text, isTyping: text.length < result.data!.length } : msg
              )
            );
          },
          15 // typing speed in ms
        );
        
        // Start typing effect
        typingEffect.start();
        
        // Generate text-to-speech
        if (isSpeechEnabled) {
          const audioUrl = await playTextToSpeech(result.data);
          if (audioUrl) {
            setMessages(prev => 
              prev.map(msg => 
                msg.id === tempBotMessage.id ? { ...msg, audioUrl } : msg
              )
            );
          }
        }
        
        toast({
          title: `${aiModel === 'gpt4o' ? 'GPT-4o' : 'GPT-4o Mini'} Analysis Complete`,
          description: `AI has analyzed your ${getCategoryLabel(category).toLowerCase()} query`,
        });
      } else {
        // Handle API error
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempBotMessage.id 
              ? { 
                  ...msg, 
                  text: `I'm sorry, I encountered an error: ${result.error || 'Unknown error'}. Please try again.`, 
                  isTyping: false 
                } 
              : msg
          )
        );
        
        toast({
          title: 'AI Response Error',
          description: result.error || 'Failed to generate AI response',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: `I'm sorry, an error occurred: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        sender: 'bot',
        timestamp: new Date(),
        category,
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: 'Error',
        description: 'Failed to process your message',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSystemPromptForCategory = (category: string): string => {
    const basePrompt = "You are an AI assistant specialized in startup advice. ";
    
    switch (category) {
      case 'ideaValidation':
        return `${basePrompt}You're analyzing startup ideas for market fit, innovation, and feasibility. Provide detailed feedback on strengths, weaknesses, and potential. Include numeric scores for market potential (0-100), innovation (0-100), and feasibility (0-100).`;
      
      case 'investorMatching':
        return `${basePrompt}You're matching startups with potential investors. Suggest specific investor types, firms, or individuals who might be interested based on industry, stage, and business model. Provide advice on pitching to these investors.`;
      
      case 'marketTrends':
        return `${basePrompt}You're analyzing current market trends relevant to startups. Identify growing sectors, emerging technologies, and shifts in consumer behavior or business models. Support your insights with recent data points when possible.`;
      
      case 'pitchDeck':
        return `${basePrompt}You're helping startups create or improve their pitch decks. Provide specific advice on structure, storytelling, key slides, and data presentation. Focus on what investors want to see.`;
      
      case 'legalCompliance':
        return `${basePrompt}You're advising on legal and regulatory considerations for startups. Cover entity formation, IP protection, regulatory requirements, and compliance best practices. Be specific to the startup's context when possible.`;
      
      case 'fundingOpportunities':
        return `${basePrompt}You're identifying funding opportunities for startups. Suggest relevant grants, accelerators, incubators, angel networks, or VC firms. Include application deadlines or requirements when known.`;
      
      case 'trendingStartups':
        return `${basePrompt}You're analyzing trending startups and what makes them successful. Identify patterns in fast-growing startups, their business models, go-to-market strategies, and funding approaches. Extract lessons for other founders.`;
      
      default:
        return `${basePrompt}Provide helpful, accurate, and detailed advice to startup founders and entrepreneurs.`;
    }
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

  const playMessageAudio = (message: Message) => {
    if (!message.audioUrl) return;
    
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.remove();
    }
    
    const audio = new Audio(message.audioUrl);
    audio.volume = audioVolume / 100;
    setCurrentAudio(audio);
    
    audio.onended = () => {
      setCurrentAudio(null);
    };
    
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
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
            <CardTitle className="text-base flex items-center">
              {aiModel === 'gpt4o' ? 'GPT-4o' : 'GPT-4o Mini'} Startup Assistant
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
        
        {showApiKeyAlert && (
          <Alert className="m-4 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="text-amber-700 text-xs">
              Please enter your OpenAI API key in settings to enable AI responses.
            </AlertDescription>
          </Alert>
        )}
        
        {isSettingsOpen && (
          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-medium mb-2">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">OpenAI API Key</label>
                <Input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="text-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">Your API key is stored locally in your browser.</p>
              </div>
              
              <div>
                <label className="text-xs text-muted-foreground block mb-1">AI Model</label>
                <Select value={aiModel} onValueChange={setAiModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select AI Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt4o">GPT-4o (More powerful)</SelectItem>
                    <SelectItem value="gpt4o-mini">GPT-4o Mini (Faster)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="voice-toggle" className="text-xs text-muted-foreground">
                    Text-to-Speech
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Hear AI responses
                  </span>
                </div>
                <Switch
                  id="voice-toggle"
                  checked={isSpeechEnabled}
                  onCheckedChange={setIsSpeechEnabled}
                />
              </div>
              
              {isSpeechEnabled && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-muted-foreground">Volume</label>
                    <span className="text-xs text-muted-foreground">{audioVolume}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <VolumeX size={16} className="text-muted-foreground" />
                    <Slider
                      value={[audioVolume]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={([value]) => setAudioVolume(value)}
                      className="flex-1"
                    />
                    <Volume2 size={16} className="text-muted-foreground" />
                  </div>
                </div>
              )}
              
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
                <div className="flex items-center justify-between">
                  {msg.sender === 'bot' && (
                    <div className="flex items-center">
                      <span className="text-xs font-semibold mr-1">{aiModel === 'gpt4o' ? 'GPT-4o' : 'GPT-4o Mini'}:</span>
                      {getCategoryIcon(msg.category)}
                      {getCategoryBadge(msg.category)}
                    </div>
                  )}
                  
                  {msg.sender === 'bot' && msg.audioUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 ml-2 -mr-2 opacity-70 hover:opacity-100"
                      onClick={() => playMessageAudio(msg)}
                    >
                      <Volume2 size={14} />
                    </Button>
                  )}
                </div>
                
                <p className="text-sm whitespace-pre-wrap">
                  {msg.isTyping ? (
                    <>
                      {msg.text}
                      <span className="inline-block w-1.5 h-3 ml-1 bg-current rounded-full opacity-75 animate-pulse"></span>
                    </>
                  ) : (
                    msg.text
                  )}
                </p>
                
                <div className="flex justify-end mt-1">
                  <span className="text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && !messages.some(m => m.isTyping) && (
            <div className="flex justify-start">
              <div className="bg-muted max-w-[80%] rounded-lg px-4 py-2">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse delay-300"></div>
                  <span className="text-xs ml-1">{aiModel === 'gpt4o' ? 'GPT-4o' : 'GPT-4o Mini'} thinking...</span>
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
              disabled={isLoading || (!openaiKey && !showApiKeyAlert)}
            />
            <Button 
              type="button" 
              size="icon" 
              variant={isListening ? "default" : "outline"}
              onClick={toggleListening}
              className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
              disabled={isLoading || (!openaiKey && !showApiKeyAlert)}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </Button>
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !message.trim() || (!openaiKey && !showApiKeyAlert)}
            >
              <Send size={18} />
            </Button>
          </form>
          
          {isGuestMode && (
            <div className="mt-2 text-xs flex items-center justify-center text-muted-foreground">
              <Lock size={12} className="mr-1" />
              <span>Some premium features require sign in</span>
            </div>
          )}
          
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
