
import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  useEffect(() => {
    // Smooth scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="page-transition animate-fade-in">{children}</div>
      </main>
      <footer className="py-8 bg-gradient-to-br from-secondary to-secondary/50 border-t border-gray-200">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-base font-semibold mb-4">IdeaScout</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered platform for startup validation and investor matching.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">Idea Validation</li>
                <li className="text-sm text-muted-foreground">Market Trend Analysis</li>
                <li className="text-sm text-muted-foreground">Investor Matching</li>
                <li className="text-sm text-muted-foreground">AI-Powered Insights</li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">support@ideascout.com</li>
                <li className="text-sm text-muted-foreground">Follow us @ideascout</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} IdeaScout. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
