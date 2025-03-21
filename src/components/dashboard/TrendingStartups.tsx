
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getTrendingStartupsAPI } from '@/services/api';
import { TrendingStartup } from '@/models/MarketInsight';
import { ExternalLink, TrendingUp, Calendar, DollarSign, Users, Building, Award, Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TrendingStartups = () => {
  const [startups, setStartups] = useState<TrendingStartup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [industries, setIndustries] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dataSource, setDataSource] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchTrendingStartups();
  }, [selectedIndustry, dataSource]);

  const fetchTrendingStartups = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const industry = selectedIndustry ? [selectedIndustry] : undefined;
      const response = await getTrendingStartupsAPI(industry);

      if (response.success && response.data) {
        // Type assertion to ensure we're getting TrendingStartup[]
        const startupData = response.data as unknown as TrendingStartup[];
        setStartups(startupData);
        setLastUpdated(new Date());

        // Extract unique industries for filter
        const uniqueIndustries = new Set<string>();
        startupData.forEach(startup => {
          startup.industry.forEach(ind => uniqueIndustries.add(ind));
        });
        setIndustries(Array.from(uniqueIndustries));
      } else {
        setError('Failed to fetch trending startups');
      }
    } catch (err) {
      console.error('Error fetching trending startups:', err);
      setError('An error occurred while fetching trending startups');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatFunding = (amount?: number) => {
    if (amount == null) return 'Undisclosed';
    if (amount >= 1_000_000) {
      return `$${(amount / 1_000_000).toFixed(1)}M`;
    }
    if (amount >= 1_000) {
      return `$${(amount / 1_000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  // Filter startups based on search query and data source
  const filteredStartups = startups.filter(startup => {
    const matchesSearch = 
      !searchQuery || 
      startup.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (startup.description && startup.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      startup.industry.some(ind => ind.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSource = 
      dataSource === 'all' || 
      startup.source === dataSource;
    
    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-primary" />
            Trending Startups
          </h2>
          <p className="text-muted-foreground">
            Discover the hottest startups based on web-scraped data from major platforms
          </p>
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchTrendingStartups}
          disabled={isLoading}
          className="flex items-center"
        >
          <RefreshCw size={16} className={`mr-1 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search by name, description, or industry..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-4">
          <div className="w-40">
            <Select value={selectedIndustry || ""} onValueChange={(value) => setSelectedIndustry(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-40">
            <Select value={dataSource} onValueChange={setDataSource}>
              <SelectTrigger>
                <SelectValue placeholder="Data Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Crunchbase">Crunchbase</SelectItem>
                <SelectItem value="AngelList">AngelList</SelectItem>
                <SelectItem value="ProductHunt">ProductHunt</SelectItem>
                <SelectItem value="TechCrunch">TechCrunch</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md text-red-800 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredStartups.map((startup) => (
            <Card key={startup.name} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="font-bold text-lg">{startup.name}</CardTitle>
                    <CardDescription>{startup.description || 'Innovative startup solution'}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {startup.trendingScore >= 80 && (
                      <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {startup.source}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Building className="h-3.5 w-3.5" />
                      <span>{startup.foundedYear || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{startup.location || 'Global'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>{formatFunding(startup.totalFunding)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(startup.lastFundingDate)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {startup.industry.slice(0, 3).map((ind) => (
                      <Badge key={ind} variant="outline" className="bg-gray-50">
                        {ind}
                      </Badge>
                    ))}
                    {startup.fundingStage && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {startup.fundingStage}
                      </Badge>
                    )}
                  </div>

                  {startup.website && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={startup.website} target="_blank" rel="noopener noreferrer">
                        Visit Website
                        <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {filteredStartups.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Award className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">No trending startups found</h3>
          <p className="mt-2 text-muted-foreground">
            Try changing your filters or check back later for updates.
          </p>
        </div>
      )}
      
      {lastUpdated && (
        <div className="text-xs text-muted-foreground flex items-center">
          <RefreshCw size={12} className="mr-1" />
          Data last scraped: {lastUpdated.toLocaleString()} from Crunchbase, AngelList, ProductHunt, and TechCrunch
        </div>
      )}
    </div>
  );
};

export default TrendingStartups;
