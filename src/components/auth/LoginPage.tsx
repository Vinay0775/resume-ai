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
import GoogleEmailDialog from './GoogleEmailDialog';

export default function LoginPage() {
  const { setCurrentPage, setUser, setIsAuthenticated } = useAppStore();
  const { signInWithEmail, signInWithGoogle } = useFirebaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleDialogOpen, setGoogleDialogOpen] = useState(false);

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      // Try Firebase Google sign-in (works in real browsers)
      const firebaseResult = await signInWithGoogle();

      if (firebaseResult) {
        handleLoginSuccess(firebaseResult);
        return;
      }

      // Firebase popup was blocked or failed — show email dialog as fallback
      setLoading(false);
      setGoogleDialogOpen(true);
    } catch {
      // Firebase failed — show email dialog as fallback
      setLoading(false);
      setGoogleDialogOpen(true);
    }
  };

  const handleGoogleEmailSubmit = async (googleEmail: string, googleName: string) => {
    try {
      // Create or login user via local API with Google email
      // First ensure user exists
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: googleName,
          email: googleEmail,
          password: 'google-oauth-' + googleEmail,
        }),
      });

      // Login via local API
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleEmail,
          password: 'google-oauth-' + googleEmail,
        }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        handleLoginSuccess({
          id: loginData.id,
          name: loginData.name,
          email: loginData.email,
          plan: loginData.plan,
          role: loginData.role || 'user',
          image: loginData.image || undefined,
        });
      } else {
        const data = await loginRes.json();
        setError(data.error || 'Google Sign-In failed. Please try email/password.');
      }
    } catch {
      setError('Google Sign-In failed. Please try email/password.');
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

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                or continue with
              </span>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>

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

      {/* Google Email Dialog - fallback when popup is blocked */}
      <GoogleEmailDialog
        open={googleDialogOpen}
        onOpenChange={setGoogleDialogOpen}
        onSubmit={handleGoogleEmailSubmit}
      />
    </div>
  );
}
