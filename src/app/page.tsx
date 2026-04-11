'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store';
import LandingPage from '@/components/landing/LandingPage';
import LoginPage from '@/components/auth/LoginPage';
import SignupPage from '@/components/auth/SignupPage';
import DashboardPage from '@/components/dashboard/DashboardPage';
import BuilderPage from '@/components/builder/BuilderPage';
import AdminPanel from '@/components/admin/AdminPanel';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

function AppContent() {
  const { currentPage, isAuthenticated, setUser, setIsAuthenticated } = useAppStore();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (res.ok) {
          const session = await res.json();
          if (session?.user) {
            setUser({
              id: (session.user as Record<string, unknown>).id as string || 'session-user',
              name: session.user.name || '',
              email: session.user.email || '',
              plan: (session.user as Record<string, unknown>).plan as string || 'free',
              image: session.user.image || undefined,
            });
            setIsAuthenticated(true);
          }
        }
      } catch {
        // No session
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
