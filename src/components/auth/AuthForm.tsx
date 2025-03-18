
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, Github, Mail } from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';

const AuthForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const defaultTab = searchParams.get('register') === 'true' ? 'register' : 'login';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [role, setRole] = useState<'founder' | 'investor'>('founder');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: 'Success!',
        description: 'You have been logged in successfully.',
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log in. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: 'Account created!',
        description: 'Your account has been created successfully.',
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-8 pt-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login" className="rounded-l-md">
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-r-md">
              <UserPlus className="w-4 h-4 mr-2" />
              Register
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-8 pt-6">
          <TabsContent value="login" className="mt-0">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-focus-ring"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="text-xs text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-focus-ring"
                />
              </div>
              
              <AnimatedButton
                type="submit"
                className="w-full"
                isLoading={isLoading}
                variant="gradient"
                size="md"
              >
                Sign In
              </AnimatedButton>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-100"
                >
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-100"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Google
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="register" className="mt-0">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-focus-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-register">Email</Label>
                <Input
                  id="email-register"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-focus-ring"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-register">Password</Label>
                <Input
                  id="password-register"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-focus-ring"
                />
              </div>
              
              <div className="space-y-2">
                <Label>I am a</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('founder')}
                    className={`p-3 rounded-lg border transition-all ${
                      role === 'founder'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Startup Founder
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('investor')}
                    className={`p-3 rounded-lg border transition-all ${
                      role === 'investor'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    Investor
                  </button>
                </div>
              </div>
              
              <AnimatedButton
                type="submit"
                className="w-full"
                isLoading={isLoading}
                variant="gradient"
                size="md"
              >
                Create Account
              </AnimatedButton>
              
              <div className="text-xs text-center text-gray-500">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
                .
              </div>
            </form>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AuthForm;
