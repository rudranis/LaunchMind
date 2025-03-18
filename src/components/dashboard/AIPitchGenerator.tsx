
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  PresentationIcon, 
  Download, 
  Copy, 
  Sparkles, 
  Loader2,
  ChevronRight,
  ChevronDown,
  Edit,
  Plus,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface PitchTemplate {
  id: string;
  name: string;
  description: string;
  slideCount: number;
  industry: string;
  color: string;
}

interface PitchSlide {
  id: string;
  title: string;
  content: string;
  order: number;
}

const pitchTemplates: PitchTemplate[] = [
  {
    id: 'seed',
    name: 'Seed Funding Pitch',
    description: 'Perfect for early-stage startups seeking initial seed funding',
    slideCount: 10,
    industry: 'All',
    color: 'bg-blue-500'
  },
  {
    id: 'series-a',
    name: 'Series A Pitch',
    description: 'For startups with traction seeking significant growth capital',
    slideCount: 12,
    industry: 'All',
    color: 'bg-green-500'
  },
  {
    id: 'saas',
    name: 'SaaS Startup Pitch',
    description: 'Tailored for software-as-a-service business models',
    slideCount: 11,
    industry: 'SaaS',
    color: 'bg-purple-500'
  },
  {
    id: 'healthcare',
    name: 'HealthTech Pitch',
    description: 'Specialized for healthcare and medical technology startups',
    slideCount: 12,
    industry: 'Healthcare',
    color: 'bg-red-500'
  },
  {
    id: 'fintech',
    name: 'FinTech Pitch',
    description: 'Focused on financial technology and services',
    slideCount: 11,
    industry: 'FinTech',
    color: 'bg-yellow-500'
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Pitch',
    description: 'Tailored for online retail and marketplace startups',
    slideCount: 10,
    industry: 'E-Commerce',
    color: 'bg-orange-500'
  }
];

const defaultSlides: PitchSlide[] = [
  {
    id: 'slide-1',
    title: 'Problem',
    content: 'Describe the problem your startup is solving. Who experiences this problem and why is it important to solve?',
    order: 1
  },
  {
    id: 'slide-2',
    title: 'Solution',
    content: 'Present your solution to the problem. How does your product or service work? What makes it unique?',
    order: 2
  },
  {
    id: 'slide-3',
    title: 'Market Size',
    content: 'Define your target market and its size. Include TAM (Total Addressable Market), SAM (Serviceable Available Market), and SOM (Serviceable Obtainable Market).',
    order: 3
  },
  {
    id: 'slide-4',
    title: 'Product/Service',
    content: 'Showcase your product or service. Include screenshots, demo videos, or product images. Highlight key features and benefits.',
    order: 4
  },
  {
    id: 'slide-5',
    title: 'Business Model',
    content: 'Explain how your business makes money. Include pricing strategy, revenue streams, and customer acquisition costs.',
    order: 5
  },
  {
    id: 'slide-6',
    title: 'Market Traction',
    content: 'Present your current traction and milestones. Include customer growth, revenue, partnerships, and any other metrics that show progress.',
    order: 6
  },
  {
    id: 'slide-7',
    title: 'Competition',
    content: 'Analyze your competitors and explain your competitive advantage. Use a comparison table or positioning map to show how you stand out.',
    order: 7
  },
  {
    id: 'slide-8',
    title: 'Team',
    content: 'Introduce your founding team and key members. Highlight relevant experience, expertise, and why this team is uniquely qualified to succeed.',
    order: 8
  },
  {
    id: 'slide-9',
    title: 'Financials',
    content: 'Present financial projections for the next 3-5 years. Include revenue, expenses, cash flow, and key financial metrics.',
    order: 9
  },
  {
    id: 'slide-10',
    title: 'The Ask',
    content: "Clearly state how much funding you're seeking and how you'll use it. Include your valuation and investment terms if applicable.",
    order: 10
  }
];

const AIPitchGenerator = () => {
  const [startupName, setStartupName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [slides, setSlides] = useState<PitchSlide[]>([]);
  const [activeTab, setActiveTab] = useState('templates');

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleGeneratePitch = async () => {
    if (!startupName || !industry || !description || !selectedTemplate) {
      toast.error("Please fill all fields and select a template");
      return;
    }

    setIsGenerating(true);
    setActiveTab('preview');

    // Simulate AI generating pitch content
    setTimeout(() => {
      const template = pitchTemplates.find(t => t.id === selectedTemplate);
      
      // Generate AI-enhanced slides based on the template and user input
      const enhancedSlides = defaultSlides.map(slide => ({
        ...slide,
        content: generateEnhancedContent(slide.title, startupName, industry, description)
      }));
      
      setSlides(enhancedSlides);
      setIsGenerating(false);
      toast.success(`Your ${template?.name} deck has been generated!`);
    }, 3000);
  };

  const generateEnhancedContent = (slideTitle: string, name: string, ind: string, desc: string) => {
    // In a real app, this would call an AI API. Here we're just creating mock content
    const industryTerms: {[key: string]: string[]} = {
      'FinTech': ['financial inclusion', 'banking disruption', 'payment processing', 'blockchain', 'digital wallets'],
      'HealthTech': ['patient care', 'medical data', 'healthcare providers', 'clinical trials', 'wellness tracking'],
      'SaaS': ['subscription model', 'cloud-based', 'enterprise solutions', 'scalable infrastructure', 'API integration'],
      'E-Commerce': ['online retail', 'marketplace', 'supply chain', 'customer experience', 'last-mile delivery'],
      'EdTech': ['learning outcomes', 'educational content', 'classroom technology', 'student engagement', 'remote learning'],
    };

    const terms = industryTerms[ind] || ['innovation', 'digital transformation', 'customer-centric', 'data-driven', 'market disruption'];
    const term1 = terms[0];
    const term2 = terms[1];
    
    switch(slideTitle) {
      case 'Problem':
        return `In today's rapidly evolving ${ind} landscape, customers face significant challenges with ${term1} and ${term2}. Our research shows that 78% of users experience frustration with existing solutions, creating a $12B market opportunity for innovative approaches like ${name}.`;
      case 'Solution':
        return `${name} is a revolutionary ${ind} platform that seamlessly integrates ${term1} with ${term2} to create an unparalleled user experience. Our proprietary technology leverages AI and machine learning to deliver a solution that is 5x more efficient than current alternatives.`;
      case 'Market Size':
        return `The global ${ind} market is projected to reach $${Math.floor(Math.random() * 500) + 100}B by 2026, growing at a CAGR of ${Math.floor(Math.random() * 20) + 10}%. Our initial TAM is $${Math.floor(Math.random() * 50) + 10}B, with a SAM of $${Math.floor(Math.random() * 20) + 5}B, and we project capturing ${Math.floor(Math.random() * 10) + 1}% of this market within 3 years.`;
      default:
        return `AI-generated content for ${slideTitle} slide tailored specifically for ${name}, a cutting-edge solution in the ${ind} space. ${desc.substring(0, 100)}...`;
    }
  };

  const copySlideContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <PresentationIcon className="w-6 h-6 mr-2 text-primary" />
        AI Pitch Deck Generator
      </h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="details">Startup Details</TabsTrigger>
          <TabsTrigger value="preview">Preview & Export</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Choose a Pitch Deck Template</CardTitle>
              <CardDescription>
                Select a template that best fits your startup and funding stage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pitchTemplates.map((template) => (
                  <div 
                    key={template.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className={`w-full h-2 ${template.color} rounded-full mb-3`}></div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">{template.slideCount} slides</span>
                      <Badge variant="outline">{template.industry}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2">
                Import Custom Template
              </Button>
              <Button onClick={() => setActiveTab('details')} disabled={!selectedTemplate}>
                Continue
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Startup Details</CardTitle>
              <CardDescription>
                Provide information about your startup for a personalized pitch deck
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="startup-name" className="block text-sm font-medium mb-1">
                  Startup Name
                </label>
                <Input
                  id="startup-name"
                  placeholder="E.g., FinGenius, MediSync, EduTech"
                  value={startupName}
                  onChange={(e) => setStartupName(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium mb-1">
                  Industry / Sector
                </label>
                <Input
                  id="industry"
                  placeholder="E.g., FinTech, HealthTech, EdTech, SaaS"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="startup-description" className="block text-sm font-medium mb-1">
                  Startup Description
                </label>
                <Textarea
                  id="startup-description"
                  placeholder="Describe your startup's mission, product/service, target audience, and unique value proposition."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab('templates')}>
                Back
              </Button>
              <Button 
                onClick={handleGeneratePitch}
                disabled={!startupName || !industry || !description}
              >
                <Sparkles className="mr-2 w-4 h-4" />
                Generate AI Pitch Deck
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preview" className="space-y-4 mt-4">
          {isGenerating ? (
            <Card className="animate-pulse-soft">
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <h3 className="text-lg font-medium mb-1">Generating Your AI Pitch Deck</h3>
                  <p className="text-sm text-gray-500">
                    Our Gemini AI is creating tailored content for your pitch deck...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : slides.length > 0 ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Your AI-Generated Pitch Deck</CardTitle>
                  <CardDescription>
                    Review and edit your personalized pitch content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {slides.map((slide) => (
                      <AccordionItem key={slide.id} value={slide.id}>
                        <AccordionTrigger className="hover:bg-gray-50 px-4 rounded-md">
                          <div className="flex items-center">
                            <span className="text-primary font-medium mr-2">{slide.order}.</span>
                            <span>{slide.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-4">
                          <div className="bg-gray-50 p-4 rounded-md">
                            <p className="text-sm">{slide.content}</p>
                            <div className="flex justify-end mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mr-2"
                                onClick={() => copySlideContent(slide.content)}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setActiveTab('details')}>
                    Back to Details
                  </Button>
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Customize Slides
                    </Button>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Export Pitch Deck
                    </Button>
                  </div>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                      <p className="text-sm">
                        <span className="font-medium">Pro Tip:</span> Include specific metrics and case studies in your "Market Traction" slide to strengthen credibility with investors.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                      <p className="text-sm">
                        <span className="font-medium">Investor Focus:</span> For {industry} startups, investors typically look for clear unit economics and customer acquisition strategies. Consider adding these details to your deck.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                      <p className="text-sm">
                        <span className="font-medium">Competitive Edge:</span> Your pitch would be stronger with a clear explanation of your technological moat or IP protection strategy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <PresentationIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">No Pitch Deck Generated Yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Complete the previous steps to generate your AI pitch deck
                </p>
                <Button onClick={() => setActiveTab('details')} variant="outline">
                  Go to Startup Details
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIPitchGenerator;
