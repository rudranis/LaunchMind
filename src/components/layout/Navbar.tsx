
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  LogIn, 
  ChevronRight, 
  Menu, 
  X,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full',
        scrolled
          ? 'py-3 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm'
          : 'py-5 bg-transparent'
      )}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-2xl font-bold text-primary tracking-tight"
        >
          <Lightbulb size={24} className="text-primary" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
            IdeaScout
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isActive('/') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            Dashboard
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button
                variant="outline"
                className="rounded-full border border-gray-300 hover:bg-primary hover:text-white hover:border-transparent transition-all duration-300"
              >
                <LogIn size={16} className="mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/auth?register=true">
              <Button
                className="rounded-full bg-primary text-white hover:bg-primary/90 transition-all duration-300"
              >
                Get Started
                <ChevronRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
              <Lightbulb size={24} className="text-primary" />
              <span className="text-2xl font-bold text-gray-900">IdeaScout</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col p-4 space-y-6">
            <Link
              to="/"
              className="flex items-center space-x-2 text-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Lightbulb size={20} />
              <span>Home</span>
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/trends"
              className="flex items-center space-x-2 text-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <TrendingUp size={20} />
              <span>Market Trends</span>
            </Link>
          </nav>
          <div className="mt-auto p-4 space-y-4">
            <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full justify-center"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/auth?register=true" onClick={() => setMobileMenuOpen(false)}>
              <Button
                className="w-full justify-center"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
