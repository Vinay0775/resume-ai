'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import LandingPage from '@/components/landing/LandingPage';
import LoginPage from '@/components/auth/LoginPage';
import SignupPage from '@/components/auth/SignupPage';
import ForgotPasswordPage from '@/components/auth/ForgotPasswordPage';
import DashboardPage from '@/components/dashboard/DashboardPage';
import BuilderPage from '@/components/builder/BuilderPage';
import AdminPanel from '@/components/admin/AdminPanel';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

function AppContent() {
  const { currentPage, isAuthenticated, setUser, setIsAuthenticated } = useAppStore();

  // Check for existing session on mount using localStorage
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = localStorage.getItem('resumeai_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          // Verify user still exists in database
          const res = await fetch(`/api/user?email=${encodeURIComponent(userData.email)}`);
          if (res.ok) {
            const freshData = await res.json();
            setUser({
              id: freshData.id,
              name: freshData.name,
              email: freshData.email,
              plan: freshData.plan,
              image: freshData.image || undefined,
            });
            setIsAuthenticated(true);
          } else {
            // User no longer exists, clear session
            localStorage.removeItem('resumeai_user');
          }
        }
      } catch {
        // No valid session
      }
    };
    checkSession();
  }, [setUser, setIsAuthenticated]);

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
    case 'dashboard':
      return isAuthenticated ? <DashboardPage /> : <LandingPage />;
    case 'builder':
      return isAuthenticated ? <BuilderPage /> : <LandingPage />;
    case 'admin':
      return isAuthenticated ? <AdminPanel /> : <LandingPage />;
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
