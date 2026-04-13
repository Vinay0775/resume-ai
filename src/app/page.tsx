'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';
import LandingPage from '@/components/landing/LandingPage';
import LoginPage from '@/components/auth/LoginPage';
import SignupPage from '@/components/auth/SignupPage';
import ForgotPasswordPage from '@/components/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/components/auth/ResetPasswordPage';
import DashboardPage from '@/components/dashboard/DashboardPage';
import BuilderPage from '@/components/builder/BuilderPage';
import AdminPanel from '@/components/admin/AdminPanel';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

function AppContent() {
  const { currentPage, isAuthenticated, user, setUser, setIsAuthenticated, initializeFromStorage } = useAppStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount (runs BEFORE any rendering)
  useEffect(() => {
    const init = async () => {
      // First, try to load from localStorage
      const hasStoredUser = initializeFromStorage();
      
      // If we found a stored user, verify it still exists in database
      if (hasStoredUser) {
        try {
          const savedUser = localStorage.getItem('resumeai_user');
          if (savedUser) {
            const userData = JSON.parse(savedUser);
            const res = await fetch(`/api/user?email=${encodeURIComponent(userData.email)}`);
            if (!res.ok) {
              // User no longer exists in database, clear session
              localStorage.removeItem('resumeai_user');
              setIsAuthenticated(false);
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Failed to verify user:', error);
        }
      }
      
      setIsInitialized(true);
    };
    
    init();
  }, [initializeFromStorage, setUser, setIsAuthenticated]);

  // Show nothing while initializing (prevents flash of logged-out state)
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // If authenticated and trying to access landing/login/signup, redirect to dashboard
  if (isAuthenticated && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'signup')) {
    // Use useEffect to avoid infinite loop
    useEffect(() => {
      useAppStore.getState().setCurrentPage('dashboard');
    }, []);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Render current page
  switch (currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'signup':
      return <SignupPage />;
    case 'forgotPassword':
      return <ForgotPasswordPage />;
    case 'resetPassword':
      return <ResetPasswordPage />;
    case 'dashboard':
      return isAuthenticated ? <DashboardPage /> : <LandingPage />;
    case 'builder':
      return isAuthenticated ? <BuilderPage /> : <LandingPage />;
    case 'admin':
      return (isAuthenticated && user?.role === 'admin') ? <AdminPanel /> : <LandingPage />;
    default:
      return <LandingPage />;
  }
}

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Toaster richColors position="top-right" />
      <AppContent />
    </ThemeProvider>
  );
}
