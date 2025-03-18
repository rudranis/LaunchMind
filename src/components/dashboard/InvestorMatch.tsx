
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Users, MessageSquare, Filter, MapPin } from 'lucide-react';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  },
];

const InvestorCard = ({ investor, onConnect }: { investor: any; onConnect: (id: number) => void }) => {
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
          
          <div className="flex items-center justify-between">
            <span className="text-sm">
              <span className="font-medium">Investment Range:</span> {investor.investment}
            </span>
            <Button 
              size="sm" 
              className="space-x-1" 
              onClick={() => onConnect(investor.id)}
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

const InvestorMatch = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sector, setSector] = useState('all');
  
  const filteredInvestors = investors.filter((investor) => {
    const matchesQuery = investor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        investor.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        investor.interests.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSector = sector === 'all' || investor.interests.some(i => i.toLowerCase() === sector.toLowerCase());
    
    return matchesQuery && matchesSector;
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
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <Users className="w-6 h-6 mr-2 text-primary" />
        Investor Matching
      </h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Investor</CardTitle>
          <CardDescription>
            AI-matched investors based on your startup profile and funding needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search by name, company, or interest..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                className="bg-transparent border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
              >
                <option value="all">All Sectors</option>
                <option value="ai">AI</option>
                <option value="fintech">FinTech</option>
                <option value="healthtech">HealthTech</option>
                <option value="saas">SaaS</option>
                <option value="cleantech">CleanTech</option>
              </select>
            </div>
          </div>
          
          <Tabs defaultValue="matches">
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
                ) : (
                  filteredInvestors.slice(0, 4).map((investor) => (
                    <InvestorCard 
                      key={investor.id} 
                      investor={investor} 
                      onConnect={handleConnect} 
                    />
                  ))
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
                ) : (
                  filteredInvestors.map((investor) => (
                    <InvestorCard 
                      key={investor.id} 
                      investor={investor} 
                      onConnect={handleConnect} 
                    />
                  ))
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
