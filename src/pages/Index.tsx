import { Link } from 'react-router-dom';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  LineChart
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import FeatureCard from '@/components/ui/FeatureCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { CardContent } from '@/components/ui/card';
import Card from '@/components/ui/Card';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-50/50 -z-10" />
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div>
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI-Powered Startup Platform
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-4">
                  Validate Your Startup Idea<span className="text-primary">.</span> <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
                    Find Your Investors.
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Use AI-driven analytics to validate your startup idea, analyze market trends,
                  and get matched with the perfect investors for your business.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?register=true">
                  <AnimatedButton 
                    size="lg" 
                    variant="gradient"
                    className="w-full sm:w-auto"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </AnimatedButton>
                </Link>
                <Link to="/dashboard">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Explore Dashboard
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>AI-Powered Analysis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>No Credit Card</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>5,000+ Investors</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 to-blue-400/20 blur-xl opacity-70" />
                <Card glassmorphism className="overflow-hidden bg-white/80 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold">AI Validation Results</h3>
                      <div className="text-sm font-medium bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        92% Match
                      </div>
                    </div>
                    
                    <div className="space-y-5">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Market Potential</span>
                          <span className="font-medium">94%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Innovation Score</span>
                          <span className="font-medium">88%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Feasibility</span>
                          <span className="font-medium">76%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: '76%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <p className="text-sm">
                        <span className="font-medium">AI Recommendation:</span> Your idea shows strong 
                        market potential. We recommend focusing on refining your revenue model and 
                        conducting additional customer validation.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">How IdeaScout Works</h2>
            <p className="text-xl text-muted-foreground">
              Our AI-powered platform helps founders validate ideas, analyze markets, and connect with investors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="AI Idea Validation"
              description="Our AI analyzes your startup idea against market trends, competition, and success factors to provide actionable insights."
              icon={<Brain className="w-6 h-6 text-primary" />}
            />
            <FeatureCard
              title="Market Trend Analysis"
              description="Access real-time data on industry trends, funding patterns, and emerging opportunities to position your startup for success."
              icon={<TrendingUp className="w-6 h-6 text-primary" />}
            />
            <FeatureCard
              title="Investor Matching"
              description="Get matched with investors who are interested in your industry and startup stage, with AI-powered compatibility scoring."
              icon={<Users className="w-6 h-6 text-primary" />}
            />
            <FeatureCard
              title="AI Pitch Generator"
              description="Generate compelling pitch decks and investor communications tailored to your specific business and target investors."
              icon={<Sparkles className="w-6 h-6 text-primary" />}
            />
            <FeatureCard
              title="Startup Analytics"
              description="Track your startup's progress with comprehensive analytics on market position, competitive landscape, and growth metrics."
              icon={<BarChart3 className="w-6 h-6 text-primary" />}
            />
            <FeatureCard
              title="Founder Community"
              description="Connect with other founders, share insights, and learn from successful entrepreneurs in your industry."
              icon={<MessageSquare className="w-6 h-6 text-primary" />}
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Your Journey to Startup Success</h2>
            <p className="text-lg text-muted-foreground">
              Follow these simple steps to validate your idea and find the right investors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/10 to-blue-400/10 blur-sm opacity-70" />
              <Card className="relative h-full">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <span className="text-xl font-semibold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Input Your Idea</h3>
                  <p className="text-muted-foreground mb-4">
                    Share your startup concept, target market, and business model in our AI validation tool.
                  </p>
                  <img 
                    src="https://static.vecteezy.com/system/resources/previews/000/543/878/original/light-bulb-idea-icon-vector.jpg" 
                    alt="Input Idea" 
                    className="w-32 h-32 object-contain mx-auto mt-4"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/10 to-blue-400/10 blur-sm opacity-70" />
              <Card className="relative h-full">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <span className="text-xl font-semibold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Get AI-Powered Analysis</h3>
                  <p className="text-muted-foreground mb-4">
                    Receive detailed validation reports with market insights and improvement recommendations.
                  </p>
                  <img 
                    src="https://static.vecteezy.com/system/resources/previews/002/264/893/original/business-data-analysis-concept-illustration-vector.jpg" 
                    alt="AI Analysis" 
                    className="w-32 h-32 object-contain mx-auto mt-4"
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/10 to-blue-400/10 blur-sm opacity-70" />
              <Card className="relative h-full">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <span className="text-xl font-semibold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Connect With Investors</h3>
                  <p className="text-muted-foreground mb-4">
                    Get matched with investors who are most likely to be interested in your startup.
                  </p>
                  <img 
                    src="https://static.vecteezy.com/system/resources/previews/008/513/432/original/business-people-shake-hands-partnership-agreement-free-vector.jpg" 
                    alt="Investor Matching" 
                    className="w-32 h-32 object-contain mx-auto mt-4"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/auth?register=true">
              <AnimatedButton variant="gradient" size="lg">
                Start Your Journey Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-lg text-muted-foreground">
              Founders who used IdeaScout to validate their ideas and secure funding
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
                    <img
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                      alt="Alex Chen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">Alex Chen</h3>
                  <p className="text-sm text-muted-foreground mb-4">Founder, DataFlow AI</p>
                  <p className="italic text-gray-700 mb-4">
                    "IdeaScout helped us validate our AI platform concept and connected us with
                    investors who truly understood our vision. We secured $2.5M in seed funding
                    within three months."
                  </p>
                  <div className="flex items-center justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                      alt="Sarah Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">Sarah Johnson</h3>
                  <p className="text-sm text-muted-foreground mb-4">Co-founder, HealthSync</p>
                  <p className="italic text-gray-700 mb-4">
                    "The market analysis tools helped us pivot our business model before launch,
                    saving us months of development. The investor matching was spot-on for
                    our healthcare platform."
                  </p>
                  <div className="flex items-center justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-primary/20">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
                      alt="Michael Rodriguez"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold">Michael Rodriguez</h3>
                  <p className="text-sm text-muted-foreground mb-4">Founder, GreenTech Solutions</p>
                  <p className="italic text-gray-700 mb-4">
                    "From idea validation to pitch deck generation, IdeaScout streamlined
                    our entire fundraising process. The AI-driven insights helped us refine
                    our sustainable energy concept."
                  </p>
                  <div className="flex items-center justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-5 h-5 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-blue-50/50">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Validate Your Startup Idea?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of founders who have used IdeaScout to validate their ideas, analyze market trends, and connect with investors.
          </p>
          <Link to="/auth?register=true">
            <AnimatedButton variant="gradient" size="lg">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </AnimatedButton>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required. Start with our free plan.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
