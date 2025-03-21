
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Chart, LineChart, BarChart, PieChart } from '@/components/ui/chart';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { getRealtimeMarketInsights } from '@/services/api';
import { MarketTrend } from '@/models/MarketInsight';

const MarketTrends = () => {
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('AI');
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [marketSentiment, setMarketSentiment] = useState<number>(0);
  
  const industries = [
    'AI', 'Fintech', 'HealthTech', 'EdTech', 'CleanTech', 
    'Blockchain', 'SaaS', 'E-commerce', 'Cybersecurity'
  ];

  useEffect(() => {
    fetchMarketInsights();
  }, [selectedIndustry]);

  const fetchMarketInsights = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getRealtimeMarketInsights([selectedIndustry]);
      
      if (response.success && response.data && response.data.length > 0) {
        const insights = response.data[0];
        setTrends(insights.trends || []);
        setLastUpdated(new Date(insights.lastUpdated));
        
        // Calculate overall market sentiment score (0-100)
        const sentimentScores = insights.trends.map(t => t.sentimentScore || 0);
        const avgSentiment = sentimentScores.length 
          ? sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length 
          : 0;
        setMarketSentiment(Math.round((avgSentiment + 1) * 50)); // Convert from -1:1 to 0:100
      } else {
        setError('No market insights found for this industry');
      }
    } catch (error) {
      console.error('Error fetching market insights:', error);
      setError('Failed to fetch market insights');
    } finally {
      setIsLoading(false);
    }
  };

  // Dummy data for charts
  const fundingTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Funding Amount ($M)',
        data: [150, 240, 180, 320, 260, 420],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Number of Deals',
        data: [32, 45, 38, 52, 48, 60],
        borderColor: 'rgb(14, 165, 233)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.3,
      },
    ],
  };
  
  const marketSizeData = {
    labels: industries,
    datasets: [
      {
        label: 'Market Size ($B)',
        data: [380, 240, 150, 90, 120, 200, 280, 180, 160],
        backgroundColor: [
          'rgba(99, 102, 241, 0.7)',
          'rgba(14, 165, 233, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(6, 182, 212, 0.7)',
          'rgba(168, 85, 247, 0.7)',
        ],
      },
    ],
  };
  
  const growthRateData = {
    labels: industries,
    datasets: [
      {
        label: 'YoY Growth Rate (%)',
        data: [42, 30, 25, 18, 35, 28, 22, 15, 32],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-primary" />
            Realtime Market Analysis
          </h2>
          <p className="text-muted-foreground">
            AI-powered insights on industry trends, funding patterns, and growth opportunities
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={fetchMarketInsights}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md text-red-800 border border-red-200">
          {error}
        </div>
      )}
      
      {/* Market Sentiment Score */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Market Sentiment</CardTitle>
            <CardDescription>
              AI-analyzed sentiment for {selectedIndustry}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{marketSentiment}</span>
                  <Badge className={
                    marketSentiment >= 70 ? "bg-green-100 text-green-800" :
                    marketSentiment >= 50 ? "bg-blue-100 text-blue-800" :
                    marketSentiment >= 30 ? "bg-amber-100 text-amber-800" :
                    "bg-red-100 text-red-800"
                  }>
                    {marketSentiment >= 70 ? "Very Positive" :
                     marketSentiment >= 50 ? "Positive" :
                     marketSentiment >= 30 ? "Neutral" :
                     "Negative"}
                  </Badge>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      marketSentiment >= 70 ? "bg-green-500" :
                      marketSentiment >= 50 ? "bg-blue-500" :
                      marketSentiment >= 30 ? "bg-amber-500" :
                      "bg-red-500"
                    }`}
                    style={{ width: `${marketSentiment}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Based on NLP sentiment analysis of market news, funding announcements, and social media
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Industry Growth Rate</CardTitle>
            <CardDescription>
              {selectedIndustry} annual growth
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">32.5%</span>
                  <span className="text-green-500 flex items-center text-sm font-medium">
                    <ArrowUpRight size={16} className="mr-1" />
                    +5.2% from last year
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  CAGR projection for 2023-2027 based on current market data
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Funding Volume</CardTitle>
            <CardDescription>
              Recent {selectedIndustry} investments
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">$4.2B</span>
                  <span className="text-green-500 flex items-center text-sm font-medium">
                    <ArrowUpRight size={16} className="mr-1" />
                    +18% QoQ
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Total funding in Q2 2023 across {selectedIndustry} startups
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="trends">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="trends">
            <TrendingUp size={16} className="mr-2" />
            Trend Analysis
          </TabsTrigger>
          <TabsTrigger value="funding">
            <BarChart3 size={16} className="mr-2" />
            Funding Data
          </TabsTrigger>
          <TabsTrigger value="market">
            <PieChartIcon size={16} className="mr-2" />
            Market Size
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Trends in {selectedIndustry}</CardTitle>
              <CardDescription>
                AI-identified trends with impact assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="mb-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))
              ) : trends.length > 0 ? (
                <div className="space-y-6">
                  {trends.map((trend, index) => (
                    <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{trend.trend}</h3>
                        <Badge variant="outline" className={
                          trend.impactLevel === 'High' ? "bg-blue-50 text-blue-700 border-blue-200" :
                          trend.impactLevel === 'Medium' ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }>
                          {trend.impactLevel} Impact
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">{trend.description}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="bg-primary/10">
                          {trend.timeframe}
                        </Badge>
                        {trend.industry.map((ind) => (
                          <Badge key={ind} variant="outline">
                            {ind}
                          </Badge>
                        ))}
                      </div>
                      
                      {(trend.opportunities && trend.opportunities.length > 0) && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-green-600">Opportunities:</p>
                          <ul className="text-sm list-disc pl-5 mt-1 text-green-700">
                            {trend.opportunities.map((opp, i) => (
                              <li key={i}>{opp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {(trend.threats && trend.threats.length > 0) && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-red-600">Threats:</p>
                          <ul className="text-sm list-disc pl-5 mt-1 text-red-700">
                            {trend.threats.map((threat, i) => (
                              <li key={i}>{threat}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No trend data available for {selectedIndustry}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="funding">
          <Card>
            <CardHeader>
              <CardTitle>Funding Trends</CardTitle>
              <CardDescription>
                {selectedIndustry} funding over time (6 months)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {isLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <LineChart
                    data={fundingTrendData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Funding Amount ($M)'
                          }
                        },
                        y1: {
                          position: 'right',
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Number of Deals'
                          },
                          grid: {
                            drawOnChartArea: false,
                          },
                        }
                      }
                    }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="market">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Size by Industry</CardTitle>
                <CardDescription>
                  Estimated market size in billions USD
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {isLoading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <PieChart
                      data={marketSizeData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>YoY Growth Rate</CardTitle>
                <CardDescription>
                  Annual growth percentage by industry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {isLoading ? (
                    <Skeleton className="h-full w-full" />
                  ) : (
                    <BarChart
                      data={growthRateData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: 'Growth Rate (%)'
                            }
                          }
                        }
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {lastUpdated && (
        <div className="text-xs text-muted-foreground flex items-center">
          <RefreshCw size={12} className="mr-1" />
          Last updated: {lastUpdated.toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default MarketTrends;
