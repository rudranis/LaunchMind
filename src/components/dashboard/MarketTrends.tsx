
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { TrendingUp, Layers, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data for market trends
const trendData = [
  { month: 'Jan', ai: 45, blockchain: 20, healthtech: 30, fintech: 60 },
  { month: 'Feb', ai: 50, blockchain: 25, healthtech: 35, fintech: 65 },
  { month: 'Mar', ai: 55, blockchain: 30, healthtech: 40, fintech: 70 },
  { month: 'Apr', ai: 65, blockchain: 45, healthtech: 45, fintech: 75 },
  { month: 'May', ai: 75, blockchain: 50, healthtech: 50, fintech: 80 },
  { month: 'Jun', ai: 90, blockchain: 55, healthtech: 60, fintech: 85 },
];

const topSectors = [
  { name: 'AI & Machine Learning', value: 40 },
  { name: 'FinTech', value: 25 },
  { name: 'HealthTech', value: 20 },
  { name: 'Blockchain', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const TrendingStartupCard = ({ 
  name, 
  sector, 
  growth, 
  description,
  className,
}: { 
  name: string; 
  sector: string; 
  growth: number; 
  description: string;
  className?: string;
}) => {
  return (
    <Card className={cn("h-full", className)} hover>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium">{name}</h3>
          <div className={`px-2 py-1 text-xs font-medium rounded-full ${
            growth > 50 
              ? 'bg-green-100 text-green-700' 
              : growth > 20 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-yellow-100 text-yellow-700'
          }`}>
            +{growth}% Growth
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{sector}</p>
        <p className="text-sm">{description}</p>
      </CardContent>
    </Card>
  );
};

const MarketTrends = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold flex items-center">
        <TrendingUp className="w-6 h-6 mr-2 text-primary" />
        Market Trend Analysis
      </h2>
      
      <Tabs defaultValue="trends">
        <TabsList className="w-full md:w-auto grid grid-cols-3 mb-6">
          <TabsTrigger value="trends">
            <TrendingUp className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline-block">Trend Analysis</span>
            <span className="sm:hidden">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="sectors">
            <PieChartIcon className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline-block">Top Sectors</span>
            <span className="sm:hidden">Sectors</span>
          </TabsTrigger>
          <TabsTrigger value="startups">
            <Layers className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline-block">Trending Startups</span>
            <span className="sm:hidden">Startups</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Funding Trends by Sector</CardTitle>
              <CardDescription>Monthly funding data across top startup sectors</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="w-full h-80">
                  <Skeleton className="w-full h-full" />
                </div>
              ) : (
                <div className="w-full h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={trendData}
                      margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorBlockchain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorHealthtech" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="colorFintech" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="ai"
                        name="AI & ML"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorAi)"
                      />
                      <Area
                        type="monotone"
                        dataKey="blockchain"
                        name="Blockchain"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorBlockchain)"
                      />
                      <Area
                        type="monotone"
                        dataKey="healthtech"
                        name="HealthTech"
                        stroke="#ffc658"
                        fillOpacity={1}
                        fill="url(#colorHealthtech)"
                      />
                      <Area
                        type="monotone"
                        dataKey="fintech"
                        name="FinTech"
                        stroke="#0088FE"
                        fillOpacity={1}
                        fill="url(#colorFintech)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                  Highest Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">+124%</div>
                    <div className="text-sm text-muted-foreground">AI & Machine Learning</div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                  Average Funding
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">$4.2M</div>
                    <div className="text-sm text-muted-foreground">Series A (Average)</div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base">
                  <Layers className="w-4 h-4 mr-2 text-primary" />
                  New Startups
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">328</div>
                    <div className="text-sm text-muted-foreground">Last Quarter</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sectors" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Startup Sectors</CardTitle>
                <CardDescription>Distribution of funding across sectors</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="w-full h-80">
                    <Skeleton className="w-full h-full" />
                  </div>
                ) : (
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={topSectors}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {topSectors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sector Growth Rates</CardTitle>
                <CardDescription>Year-over-year growth percentage</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-6 h-80 flex flex-col justify-center">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <div className="space-y-6 h-80 flex flex-col justify-center">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">AI & Machine Learning</span>
                        <span className="text-sm font-medium">+124%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">FinTech</span>
                        <span className="text-sm font-medium">+78%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">HealthTech</span>
                        <span className="text-sm font-medium">+65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Blockchain</span>
                        <span className="text-sm font-medium">+42%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="startups" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="h-40">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <TrendingStartupCard
                  name="NeuralLens AI"
                  sector="AI & Machine Learning"
                  growth={86}
                  description="Computer vision platform that transforms visual data into actionable insights for retail and security."
                />
                <TrendingStartupCard
                  name="FinanceFlow"
                  sector="FinTech"
                  growth={72}
                  description="Automated financial forecasting and budgeting platform for small businesses."
                />
                <TrendingStartupCard
                  name="MediSync"
                  sector="HealthTech"
                  growth={65}
                  description="Remote patient monitoring solution with AI-driven health insights."
                />
                <TrendingStartupCard
                  name="ChainScope"
                  sector="Blockchain"
                  growth={48}
                  description="Blockchain analytics platform for enhanced supply chain transparency."
                />
                <TrendingStartupCard
                  name="GreenHub"
                  sector="CleanTech"
                  growth={42}
                  description="Marketplace connecting sustainable product manufacturers with eco-conscious retailers."
                />
                <TrendingStartupCard
                  name="WorkSphere"
                  sector="HR Tech"
                  growth={38}
                  description="Employee engagement and productivity analytics platform for remote teams."
                />
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketTrends;
