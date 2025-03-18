
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import AuthForm from '@/components/auth/AuthForm';

const Auth = () => {
  const location = useLocation();
  const isSignup = new URLSearchParams(location.search).get('register') === 'true';

  useEffect(() => {
    // Update page title based on the auth mode
    document.title = isSignup ? 'Sign Up - IdeaScout' : 'Sign In - IdeaScout';
  }, [isSignup]);

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-center mb-2">
              {isSignup ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              {isSignup
                ? 'Join IdeaScout and start validating your startup ideas'
                : 'Sign in to access your IdeaScout dashboard'}
            </p>
            <AuthForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Auth;
