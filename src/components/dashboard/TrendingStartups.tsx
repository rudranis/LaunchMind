
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import CustomCard, { CardContent as CustomCardContent, CardHeader, CardTitle, CardDescription } from '../ui/CustomCard';
import { TrendingUp, ExternalLink, Filter, BarChart3, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTrendingStartupsAPI } from '@/services/api';
import { TrendingStartup } from '@/models/MarketInsight';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const formatCurrency = (amount: number) => {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  } else {
    return `$${amount}`;
  }
};

const StartupCard = ({ startup }: { startup: TrendingStartup }) => {
  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium mb-1">{startup.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <span className="mr-2">{startup.location || 'Unknown location'}</span>
              <span>•</span>
              <span className="ml-2">Founded {startup.foundedYear || 'N/A'}</span>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary">
            {startup.trendingScore}% Trending
          </Badge>
        </div>
        
        <p className="text-sm mb-4 line-clamp-2">{startup.description || 'No description available'}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-xs text-muted-foreground mb-1">Funding Stage</div>
            <div className="font-medium">{startup.fundingStage || 'Unknown'}</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-xs text-muted-foreground mb-1">Total Funding</div>
            <div className="font-medium">{startup.totalFunding ? formatCurrency(startup.totalFunding) : 'Unknown'}</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {startup.industry.map((ind, index) => (
            <Badge key={index} variant="secondary" className="bg-secondary/50">
              {ind}
            </Badge>
          ))}
        </div>
        
        {startup.website && (
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => window.open(startup.website, '_blank')}
          >
            <ExternalLink size={16} />
            <span>Visit Website</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const TrendingStartups = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [startups, setStartups] = useState<TrendingStartup[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [dataSource, setDataSource] = useState<string>('All Sources');
  const { toast } = useToast();
  
  const industries = ['AI', 'FinTech', 'HealthTech', 'SaaS', 'CleanTech', 'EdTech'];
  const dataSources = ['All Sources', 'Crunchbase', 'AngelList', 'ProductHunt', 'TechCrunch'];
  
  useEffect(() => {
    const fetchTrendingStartups = async () => {
      setIsLoading(true);
      
      try {
        // Apply industry filter if not "all"
        const industryFilter = selectedIndustry !== 'all' ? [selectedIndustry] : undefined;
        
        // Fetch trending startups
        const result = await getTrendingStartupsAPI(industryFilter);
        
        if (result.success && result.data) {
          // Apply data source filter if needed
          let filteredStartups = result.data;
          if (dataSource !== 'All Sources') {
            filteredStartups = filteredStartups.filter(
              startup => startup.source === dataSource
            );
          }
          
          setStartups(filteredStartups);
        } else {
          console.error('Failed to load trending startups:', result.error);
          toast({
            title: 'Error',
            description: 'Failed to load trending startups data',
            variant: 'destructive'
          });
          setStartups([]);
        }
      } catch (error) {
        console.error('Error fetching trending startups:', error);
        toast({
          title: 'Error',
          description: 'Failed to load trending startups data',
          variant: 'destructive'
        });
        setStartups([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrendingStartups();
  }, [selectedIndustry, dataSource, toast]);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <TrendingUp className="w-6 h-6 mr-2 text-primary" />
        Trending Startups
      </h2>
      
      <CustomCard>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Latest Trending Startups</CardTitle>
              <CardDescription>
                AI-curated list of startups gaining momentum across different industries
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Data scraped from Crunchbase, AngelList, ProductHunt, and TechCrunch. 
                  Updated daily with AI-powered analysis of funding trends, growth metrics, and market signals.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CustomCardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                className="bg-transparent border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                <option value="all">All Industries</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-gray-500" />
              <select
                className="bg-transparent border border-gray-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={dataSource}
                onChange={(e) => setDataSource(e.target.value)}
              >
                {dataSources.map((source) => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
          
          <Tabs defaultValue="grid">
            <TabsList className="mb-6">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  Array(6).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <Skeleton className="h-5 w-3/4" />
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-full" />
                          <div className="grid grid-cols-2 gap-4 py-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                          <div className="flex gap-2 py-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                          </div>
                          <Skeleton className="h-9 w-full rounded" />
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : startups.length > 0 ? (
                  startups.map((startup, index) => (
                    <StartupCard key={index} startup={startup} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-lg text-muted-foreground">No startups found matching your filters</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSelectedIndustry('all');
                        setDataSource('All Sources');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="mt-0">
              <div className="space-y-4">
                {isLoading ? (
                  Array(8).fill(0).map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-1/4" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                          <div className="flex items-start gap-4">
                            <Skeleton className="h-10 w-24" />
                            <Skeleton className="h-10 w-24" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : startups.length > 0 ? (
                  startups.map((startup, index) => (
                    <Card key={index} className="hover:shadow-md transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{startup.name}</h3>
                              <Badge variant="outline" className="bg-primary/5 text-primary">
                                {startup.trendingScore}%
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {startup.location || 'Unknown location'} • Founded {startup.foundedYear || 'N/A'}
                            </p>
                            <p className="text-sm mt-1 line-clamp-1">
                              {startup.description || 'No description available'}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {startup.industry.slice(0, 3).map((ind, i) => (
                                <Badge key={i} variant="secondary" className="bg-secondary/50">
                                  {ind}
                                </Badge>
                              ))}
                              {startup.industry.length > 3 && (
                                <Badge variant="outline">+{startup.industry.length - 3}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Stage</div>
                              <div className="font-medium">{startup.fundingStage || 'Unknown'}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-muted-foreground">Funding</div>
                              <div className="font-medium">
                                {startup.totalFunding ? formatCurrency(startup.totalFunding) : 'Unknown'}
                              </div>
                            </div>
                            {startup.website && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="h-9 gap-1"
                                onClick={() => window.open(startup.website, '_blank')}
                              >
                                <ExternalLink size={14} />
                                <span className="hidden sm:inline">Website</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No startups found matching your filters</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSelectedIndustry('all');
                        setDataSource('All Sources');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CustomCardContent>
      </CustomCard>
    </div>
  );
};

export default TrendingStartups;
