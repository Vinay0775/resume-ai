'use client';

import { useState } from 'react';
import { useAppStore } from '@/store';
import { useFirebaseAuth } from '@/lib/useFirebaseAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Lock, Eye, EyeOff, Loader2, FileText, ArrowLeft, CheckCircle2, MailCheck } from 'lucide-react';

type ResetMode = 'email' | 'direct';

export default function ForgotPasswordPage() {
  const { setCurrentPage } = useAppStore();
  const { sendPasswordReset } = useFirebaseAuth();
  const [mode, setMode] = useState<ResetMode>('email');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [firebaseEmailSent, setFirebaseEmailSent] = useState(false);

  // Mode 1: Send Firebase password reset email
  const handleEmailReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Try Firebase password reset first
      const firebaseSuccess = await sendPasswordReset(email);

      if (firebaseSuccess) {
        setFirebaseEmailSent(true);
        setSuccess(true);
        return;
      }

      // Firebase failed — try the local API reset as fallback
      setError('Firebase reset unavailable. Use the direct reset option below.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mode 2: Direct reset via local API (email + new password)
  const handleDirectReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
        return;
      }

      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSuccessContent = () => {
    if (firebaseEmailSent) {
      return (
        <div className="space-y-4">
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
              <MailCheck className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Reset Email Sent!</h3>
            <p className="text-center text-muted-foreground">
              We&apos;ve sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
              Check your inbox and follow the link to set a new password.
            </p>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
            onClick={() => setCurrentPage('login')}
          >
            Back to Sign In
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-center text-muted-foreground">
            Your password has been reset successfully!
          </p>
        </div>
        <Button
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
          onClick={() => setCurrentPage('login')}
        >
          Back to Sign In
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4">
      <div className="w-full max-w-md">
        {/* Logo - Clickable to go to homepage */}
        <div className="text-center mb-8">
          <button
            onClick={() => setCurrentPage('landing')}
            className="inline-flex items-center gap-2 mb-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ResumeAI
            </span>
          </button>
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <Card className="shadow-xl border-0 dark:border">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">
              {success ? 'Password Reset!' : 'Reset Password'}
            </CardTitle>
            <CardDescription className="text-center">
              {success
                ? firebaseEmailSent
                  ? 'Check your email for the reset link'
                  : 'Your password has been reset successfully. You can now sign in with your new password.'
                : mode === 'email'
                  ? 'Enter your email and we\'ll send you a reset link'
                  : 'Enter your email and new password to reset your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              renderSuccessContent()
            ) : (
              <>
                {/* Mode toggle */}
                <div className="flex rounded-lg border mb-6 p-1">
                  <button
                    type="button"
                    onClick={() => { setMode('email'); setError(''); }}
                    className={`flex-1 text-sm py-2 rounded-md transition-colors ${
                      mode === 'email'
                        ? 'bg-emerald-500 text-white font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Reset via Email
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMode('direct'); setError(''); }}
                    className={`flex-1 text-sm py-2 rounded-md transition-colors ${
                      mode === 'direct'
                        ? 'bg-emerald-500 text-white font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Direct Reset
                  </button>
                </div>

                {/* Mode 1: Email reset */}
                {mode === 'email' && (
                  <form onSubmit={handleEmailReset} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
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

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending reset email...
                        </>
                      ) : (
                        'Send Reset Email'
                      )}
                    </Button>
                  </form>
                )}

                {/* Mode 2: Direct reset (email + new password) */}
                {mode === 'direct' && (
                  <form onSubmit={handleDirectReset} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email-direct">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-direct"
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
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
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

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
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
                          Resetting password...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </form>
                )}
              </>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6">
              <button
                onClick={() => setCurrentPage('login')}
                className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Sign In
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
