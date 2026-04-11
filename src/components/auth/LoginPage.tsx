'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { useFirebaseAuth } from '@/lib/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, Eye, EyeOff, Loader2, FileText } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { setCurrentPage, setUser, setIsAuthenticated } = useAppStore();
  const { signInWithEmail } = useFirebaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSuccess = (userData: { id: string; name: string; email: string; plan: string; role: string; image?: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('resumeai_user', JSON.stringify(userData));
    toast.success(`Welcome back, ${userData.name || 'User'}!`);
    setCurrentPage('dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try Firebase sign-in first
      const firebaseResult = await signInWithEmail(email, password);

      if (firebaseResult) {
        handleLoginSuccess(firebaseResult);
        return;
      }

      // Firebase failed — fall back to direct API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password');
        return;
      }

      handleLoginSuccess({
        id: data.id,
        name: data.name,
        email: data.email,
        plan: data.plan,
        role: data.role || 'user',
        image: data.image || undefined,
      });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Ensure the demo user exists
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Demo User', email: 'demo@resumeai.com', password: 'demo1234' }),
      });

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'demo@resumeai.com', password: 'demo1234' }),
      });

      const data = await res.json();

      if (res.ok) {
        handleLoginSuccess({
          id: data.id,
          name: data.name,
          email: data.email,
          plan: data.plan,
          role: data.role || 'user',
          image: data.image || undefined,
        });
      } else {
        setError(data.error || 'Demo login failed.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo - Clickable to go to homepage */}
        <div className="text-center mb-8">
          <button
            onClick={goToHome}
            className="inline-flex items-center gap-2 mb-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </button>
          <p className="text-muted-foreground">Welcome back! Sign in to your account</p>
        </div>

        <Card className="shadow-xl border-0 dark:border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your resumes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    className="text-xs text-emerald-600 hover:text-emerald-700 hover:underline"
                    onClick={() => setCurrentPage('forgotPassword')}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Want to try first?{' '}
              <button
                onClick={handleDemoLogin}
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
              >
                Use demo account
              </button>
            </p>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Don&apos;t have an account?{' '}
              <button
                onClick={() => setCurrentPage('signup')}
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
              >
                Sign up
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
