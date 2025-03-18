
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Check, 
  X, 
  Loader2, 
  Brain, 
  Lightbulb, 
  Users, 
  Banknote, 
  LineChart, 
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ValidationResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  marketPotential: number;
  innovation: number;
  feasibility: number;
  financialViability: number;
  teamCompetence: number;
  marketSize: number;
  competitorStrength: number;
  recommendation: string;
  marketTrends: string[];
  businessModel: string;
  targetAudience: string;
  investorTypes: string[];
}

const AIIdeaValidator = () => {
  const [idea, setIdea] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleValidate = async () => {
    if (!idea || !description) {
      toast.error("Please provide both idea title and description");
      return;
    }

    setIsValidating(true);
    setResult(null);

    // Simulating AI API call to validate idea
    setTimeout(() => {
      const mockResult: ValidationResult = {
        score: Math.floor(Math.random() * 30) + 70, // Score between 70-100
        strengths: [
          'Innovative solution to a real problem',
          'Large addressable market',
          'Clear value proposition',
          'Scalable business model',
          'Emerging technology trend alignment'
        ],
        weaknesses: [
          'Competitive market landscape',
          'High initial development costs',
          'Potential regulatory challenges',
          'Customer acquisition might be expensive',
          'Requires technical expertise to execute'
        ],
        marketPotential: Math.floor(Math.random() * 20) + 80,
        innovation: Math.floor(Math.random() * 30) + 70,
        feasibility: Math.floor(Math.random() * 25) + 65,
        financialViability: Math.floor(Math.random() * 30) + 60,
        teamCompetence: Math.floor(Math.random() * 20) + 75,
        marketSize: Math.floor(Math.random() * 30) + 70,
        competitorStrength: Math.floor(Math.random() * 40) + 50,
        recommendation:
          'Your idea shows strong potential in an emerging market. We recommend focusing on refining your revenue model and conducting additional customer validation. Consider forming strategic partnerships to overcome initial market entry barriers and accelerate customer acquisition.',
        marketTrends: [
          'Growing demand for AI-powered solutions in this sector',
          'Increasing venture capital interest in similar startups',
          'Regulatory environment becoming more favorable',
          'Potential for strategic partnerships with established players'
        ],
        businessModel: 'SaaS subscription with tiered pricing, plus potential enterprise contracts',
        targetAudience: 'Mid-sized businesses in finance, healthcare, and technology sectors',
        investorTypes: ['Angel investors', 'Seed-stage VCs', 'Industry-specific accelerators', 'Strategic corporate investors']
      };

      setResult(mockResult);
      setIsValidating(false);
      toast.success("AI analysis completed successfully!");
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-primary" />
            Gemini-Powered Idea Validator
          </CardTitle>
          <CardDescription>
            Use our advanced AI to analyze your startup idea and get detailed insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="idea-title" className="block text-sm font-medium mb-1">
                Startup Idea Title
              </label>
              <Input
                id="idea-title"
                placeholder="E.g., AI-Powered Personal Finance Assistant"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="industry" className="block text-sm font-medium mb-1">
                Industry / Sector
              </label>
              <Input
                id="industry"
                placeholder="E.g., FinTech, HealthTech, EdTech, etc."
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label htmlFor="idea-description" className="block text-sm font-medium mb-1">
                Idea Description
              </label>
              <Textarea
                id="idea-description"
                placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target audience? What is your business model?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[120px]"
              />
            </div>
            
            <Button 
              onClick={handleValidate} 
              disabled={!idea || !description || isValidating}
              className="w-full"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Your Idea with Gemini AI...
                </>
              ) : (
                'Validate My Idea'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isValidating && (
        <Card className="animate-pulse-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <Brain className="w-12 h-12 mx-auto text-primary animate-pulse-soft mb-4" />
                <p className="text-lg font-medium">Our Gemini AI is analyzing your idea...</p>
                <p className="text-sm text-gray-500 mt-2">
                  We're checking market trends, competition landscape, and business viability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>AI Validation Results</CardTitle>
              <CardDescription>
                Comprehensive analysis of your startup idea based on market data and AI insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="market">Market Analysis</TabsTrigger>
                  <TabsTrigger value="business">Business Model</TabsTrigger>
                  <TabsTrigger value="investors">Investor Match</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-0">
                  <div className="flex flex-col sm:flex-row items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center sm:text-left mb-4 sm:mb-0">
                      <h3 className="text-lg font-medium">Overall Viability Score</h3>
                      <span className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </span>
                    </div>
                    <div className="w-full sm:w-2/3">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Market Potential</span>
                            <span className="text-sm font-medium">{result.marketPotential}%</span>
                          </div>
                          <Progress value={result.marketPotential} className={getProgressColor(result.marketPotential)} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Innovation Factor</span>
                            <span className="text-sm font-medium">{result.innovation}%</span>
                          </div>
                          <Progress value={result.innovation} className={getProgressColor(result.innovation)} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Technical Feasibility</span>
                            <span className="text-sm font-medium">{result.feasibility}%</span>
                          </div>
                          <Progress value={result.feasibility} className={getProgressColor(result.feasibility)} />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Financial Viability</span>
                            <span className="text-sm font-medium">{result.financialViability}%</span>
                          </div>
                          <Progress value={result.financialViability} className={getProgressColor(result.financialViability)} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <Check className="w-5 h-5 text-green-500 mr-2" />
                        Key Strengths
                      </h3>
                      <ul className="space-y-2">
                        {result.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
                        Areas to Improve
                      </h3>
                      <ul className="space-y-2">
                        {result.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start">
                            <X className="w-4 h-4 text-red-500 mr-2 mt-0.5 shrink-0" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <Brain className="w-5 h-5 text-primary mr-2" />
                      AI Strategic Recommendation
                    </h3>
                    <p className="text-gray-700">{result.recommendation}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="market" className="mt-0">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <LineChart className="w-5 h-5 text-primary mr-2" />
                            <h3 className="font-medium">Market Size</h3>
                          </div>
                          <span className={`text-2xl font-bold ${getScoreColor(result.marketSize)}`}>
                            {result.marketSize}%
                          </span>
                          <Progress value={result.marketSize} className={`mt-2 ${getProgressColor(result.marketSize)}`} />
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <Users className="w-5 h-5 text-primary mr-2" />
                            <h3 className="font-medium">Competitor Strength</h3>
                          </div>
                          <span className={`text-2xl font-bold ${getScoreColor(100 - result.competitorStrength)}`}>
                            {result.competitorStrength}%
                          </span>
                          <Progress value={result.competitorStrength} className={`mt-2 ${getProgressColor(100 - result.competitorStrength)}`} />
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="w-5 h-5 text-primary mr-2" />
                            <h3 className="font-medium">Growth Potential</h3>
                          </div>
                          <span className={`text-2xl font-bold ${getScoreColor(result.marketPotential)}`}>
                            {result.marketPotential}%
                          </span>
                          <Progress value={result.marketPotential} className={`mt-2 ${getProgressColor(result.marketPotential)}`} />
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Market Trends Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.marketTrends.map((trend, index) => (
                            <li key={index} className="flex items-start">
                              <TrendingUp className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                              <span>{trend}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Target Audience Profile</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{result.targetAudience}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="business" className="mt-0">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Recommended Business Model</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{result.businessModel}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div>
                            <h3 className="font-medium mb-2 flex items-center">
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              Revenue Streams
                            </h3>
                            <ul className="space-y-1 text-sm">
                              <li>Subscription model (primary)</li>
                              <li>Enterprise contracts</li>
                              <li>API access fees</li>
                              <li>Premium features</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2 flex items-center">
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              Scaling Strategy
                            </h3>
                            <ul className="space-y-1 text-sm">
                              <li>Start with a focused MVP</li>
                              <li>Iterative product development</li>
                              <li>Strategic partnerships</li>
                              <li>International expansion (Year 3+)</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-6 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                          <h3 className="font-medium flex items-center">
                            <Lightbulb className="w-4 h-4 text-yellow-500 mr-2" />
                            AI Recommendation
                          </h3>
                          <p className="text-sm mt-1">Consider a freemium model to accelerate initial user acquisition, then convert to premium features for sustainable revenue.</p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Financial Considerations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium mb-2">Estimated Startup Costs</h3>
                            <ul className="space-y-1 text-sm">
                              <li>Initial development: $75K - $120K</li>
                              <li>Marketing: $30K - $50K</li>
                              <li>Legal & compliance: $10K - $20K</li>
                              <li>Operations: $40K - $60K</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">Funding Requirements</h3>
                            <ul className="space-y-1 text-sm">
                              <li>Seed stage: $250K - $500K</li>
                              <li>Series A potential: $1.5M - $3M</li>
                              <li>Break-even timeline: 18-24 months</li>
                              <li>Burn rate: $20K - $30K monthly</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="investors" className="mt-0">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Recommended Investor Types</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {result.investorTypes.map((type, index) => (
                            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                              {type}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="mt-4">
                          <h3 className="font-medium mb-2">Pitch Tailoring Tips</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start">
                              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                              <span>Emphasize market growth potential and scalability for VCs</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                              <span>Highlight innovation and technical differentiation for angel investors</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                              <span>Focus on industry expertise and traction for accelerators</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                              <span>Demonstrate strategic fit and partnership potential for corporate investors</span>
                            </li>
                          </ul>
                        </div>
                        
                        <Button className="w-full mt-6" variant="outline">
                          <Users className="w-4 h-4 mr-2" />
                          View Matched Investors
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">AI-Generated Pitch Deck</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700 mb-4">
                          Based on your idea, we've prepared a customized pitch deck outline. Click below to generate a complete 10-slide deck.
                        </p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
                          {["Problem", "Solution", "Market", "Product", "Traction", 
                            "Business Model", "Competition", "Team", "Financials", "Ask"
                          ].map((slide, index) => (
                            <div key={index} className="aspect-video bg-gray-100 rounded-md flex items-center justify-center p-2 text-xs text-center border border-gray-200">
                              {slide}
                            </div>
                          ))}
                        </div>
                        
                        <Button className="w-full">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate Complete Pitch Deck
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AIIdeaValidator;
