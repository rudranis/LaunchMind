
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, MessageSquare, Filter, MapPin, Briefcase, TrendingUp, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface InvestorMatchProps {
  isGuestMode: boolean;
}

// Mock investor data
const investors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'Horizon Ventures',
    avatar: '',
    location: 'San Francisco, CA',
    match: 96,
    interests: ['AI', 'Machine Learning', 'SaaS'],
    investment: '$1M - $5M',
    bio: 'Early-stage investor with a focus on AI-driven solutions and SaaS platforms. Previously founded and sold two tech startups.',
    recentInvestments: [
      { company: 'AlgoPro AI', amount: '$2.5M', date: '2023-05-15' },
      { company: 'DataSense', amount: '$1.8M', date: '2023-02-10' },
    ],
    stage: 'Seed, Series A'
  },
  {
    id: 2,
    name: 'Michael Chang',
    company: 'Blue Oak Capital',
    avatar: '',
    location: 'New York, NY',
    match: 90,
    interests: ['FinTech', 'Blockchain', 'SaaS'],
    investment: '$500K - $3M',
    bio: 'Investing in innovative fintech solutions that improve financial access. Looking for founders with strong technical backgrounds.',
    recentInvestments: [
      { company: 'CryptoFlow', amount: '$3.2M', date: '2023-04-22' },
      { company: 'PayEasy', amount: '$1.2M', date: '2023-01-30' },
    ],
    stage: 'Pre-seed, Seed'
  },
  {
    id: 3,
    name: 'Jessica Zhang',
    company: 'Redwood Partners',
    avatar: '',
    location: 'Boston, MA',
    match: 87,
    interests: ['HealthTech', 'AI', 'Biotechnology'],
    investment: '$1M - $8M',
    bio: 'Focus on health technologies that leverage AI and data science. Former healthcare executive with strong industry connections.',
    recentInvestments: [
      { company: 'MediScan', amount: '$4.5M', date: '2023-06-05' },
      { company: 'HealthAI', amount: '$3.1M', date: '2023-03-18' },
    ],
    stage: 'Seed, Series A'
  },
  {
    id: 4,
    name: 'David Park',
    company: 'Sequoia Investments',
    avatar: '',
    location: 'Austin, TX',
    match: 85,
    interests: ['CleanTech', 'Sustainability', 'Hardware'],
    investment: '$2M - $10M',
    bio: 'Passionate about sustainable solutions and climate tech. Looking for innovative approaches to environmental challenges.',
    recentInvestments: [
      { company: 'GreenEnergy', amount: '$5.2M', date: '2023-05-28' },
      { company: 'EcoSystems', amount: '$2.8M', date: '2023-02-15' },
    ],
    stage: 'Series A, Series B'
  },
  {
    id: 5,
    name: 'Olivia Martinez',
    company: 'Vertex Ventures',
    avatar: '',
    location: 'Seattle, WA',
    match: 82,
    interests: ['B2B', 'Enterprise Software', 'AI'],
    investment: '$1M - $5M',
    bio: 'Focused on B2B enterprise solutions that streamline operations and improve efficiency. Looking for strong unit economics.',
    recentInvestments: [
      { company: 'WorkflowPro', amount: '$2.3M', date: '2023-06-12' },
      { company: 'EnterpriseAI', amount: '$1.9M', date: '2023-04-05' },
    ],
    stage: 'Seed, Series A'
  },
];

const InvestorCard = ({ investor, onConnect, isGuestMode }: { investor: any; onConnect: (id: number) => void; isGuestMode: boolean }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:border-blue-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage src={investor.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {investor.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{investor.name}</h3>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {investor.match}% Match
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{investor.company}</p>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin size={14} className="mr-1" />
              {investor.location}
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm line-clamp-2 mb-3">{investor.bio}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {investor.interests.map((interest: string) => (
              <Badge key={interest} variant="secondary" className="bg-secondary/50">
                {interest}
              </Badge>
            ))}
          </div>
          
          <div className="text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1 mb-1">
              <Briefcase size={12} />
              <span><strong>Investment Range:</strong> {investor.investment}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={12} />
              <span><strong>Stages:</strong> {investor.stage}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-xs font-medium mb-1">Recent Investments:</p>
            <div className="space-y-1">
              {investor.recentInvestments.map((investment: any, index: number) => (
                <div key={index} className="flex justify-between text-xs">
                  <span>{investment.company}</span>
                  <span className="text-green-600">{investment.amount}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <Button 
              size="sm" 
              className="space-x-1" 
              onClick={() => onConnect(investor.id)}
              disabled={isGuestMode}
            >
              <MessageSquare size={16} />
              <span>Connect</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const InvestorMatch = ({ isGuestMode }: InvestorMatchProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sector, setSector] = useState('all');
  const [fundingStage, setFundingStage] = useState('all');
  const [fundingRange, setFundingRange] = useState([0, 10]); // In millions
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const filteredInvestors = investors.filter((investor) => {
    const matchesQuery = investor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        investor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        investor.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSector = sector === 'all' || investor.interests.some(i => i.toLowerCase() === sector.toLowerCase());
    
    const matchesFundingStage = fundingStage === 'all' || investor.stage.toLowerCase().includes(fundingStage.toLowerCase());
    
    // Check if investor's range overlaps with the selected range
    // Parse the investment range string (e.g., "$1M - $5M") to get min and max values
    const rangeString = investor.investment;
    const [minStr, maxStr] = rangeString.split(' - ');
    const minValue = parseFloat(minStr.replace(/[^0-9.]/g, ''));
    const maxValue = parseFloat(maxStr.replace(/[^0-9.]/g, ''));
    const unitIsM = minStr.includes('M') || maxStr.includes('M');
    
    // Convert to millions for comparison if needed
    const minValueInM = unitIsM ? minValue : minValue / 1000;
    const maxValueInM = unitIsM ? maxValue : maxValue / 1000;
    
    const matchesFundingRange = 
      (minValueInM <= fundingRange[1] && maxValueInM >= fundingRange[0]);
    
    return matchesQuery && matchesSector && matchesFundingStage && matchesFundingRange;
  });
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleConnect = (id: number) => {
    console.log(`Connecting with investor ${id}`);
    // In a real app, this would open a messaging interface or send a connection request
  };
  
  const handleRefreshMatches = () => {
    setIsRefreshing(true);
    // Simulate refreshing investor data
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };
  
  const formatFundingRange = (range: number[]) => {
    return `$${range[0]}M - $${range[1]}M`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="w-6 h-6 mr-2 text-primary" />
            Investor Matching
          </h2>
          <p className="text-muted-foreground">
            AI-matched investors based on your startup profile and funding needs
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleRefreshMatches}
          disabled={isRefreshing || isGuestMode}
          className="flex items-center"
        >
          <RefreshCw size={16} className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Matches
        </Button>
      </div>
      
      {isGuestMode && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            Investor matching is a premium feature. Sign in to connect with real investors matched to your startup.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Investor</CardTitle>
          <CardDescription>
            ML-powered matching based on funding history and startup profiles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by name, company, or interest..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-4">
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="fintech">FinTech</SelectItem>
                    <SelectItem value="healthtech">HealthTech</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="cleantech">CleanTech</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={fundingStage} onValueChange={setFundingStage}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series a">Series A</SelectItem>
                    <SelectItem value="series b">Series B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Funding Range</label>
                <span className="text-sm text-muted-foreground">{formatFundingRange(fundingRange)}</span>
              </div>
              <Slider
                value={fundingRange}
                min={0}
                max={10}
                step={0.5}
                onValueChange={setFundingRange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>$0M</span>
                <span>$10M+</span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="matches" className="mt-6">
            <TabsList className="w-full md:w-auto grid grid-cols-2 mb-6">
              <TabsTrigger value="matches">
                Best Matches
              </TabsTrigger>
              <TabsTrigger value="all">
                All Investors
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="matches" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                  Array(4).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/3" />
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full" />
                          <div className="flex gap-2 mt-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredInvestors.length > 0 ? (
                  filteredInvestors.slice(0, 4).map((investor) => (
                    <InvestorCard 
                      key={investor.id} 
                      investor={investor} 
                      onConnect={handleConnect}
                      isGuestMode={isGuestMode}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No matching investors found</h3>
                    <p className="mt-2 text-muted-foreground">
                      Try adjusting your filters to see more investors
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/3" />
                          </div>
                        </div>
                        <div className="mt-4 space-y-2">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-3 w-full" />
                          <div className="flex gap-2 mt-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredInvestors.length > 0 ? (
                  filteredInvestors.map((investor) => (
                    <InvestorCard 
                      key={investor.id} 
                      investor={investor} 
                      onConnect={handleConnect}
                      isGuestMode={isGuestMode}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium">No matching investors found</h3>
                    <p className="mt-2 text-muted-foreground">
                      Try adjusting your filters to see more investors
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorMatch;
