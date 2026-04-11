'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface UserData {
  id: string;
  name: string;
  email: string;
  plan: string;
  image?: string;
}

export function useFirebaseAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /**
   * Sync a Firebase user with the local API.
   * 1. Try to create the user via /api/user (idempotent — returns existing if already there)
   * 2. Call /api/auth/login to validate and get full local user data
   * 3. Store in localStorage under 'resumeai_user'
   */
  const syncWithLocalApi = useCallback(async (firebaseUser: User, fallbackName?: string): Promise<UserData | null> => {
    try {
      const name = firebaseUser.displayName || fallbackName || firebaseUser.email?.split('@')[0] || 'User';
      const email = firebaseUser.email || '';

      // Ensure the user exists in our local DB (POST is idempotent for existing emails)
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: 'firebase-oauth-' + firebaseUser.uid }),
      });

      // Login via local API to get full user record
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: 'firebase-oauth-' + firebaseUser.uid }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        const userData: UserData = {
          id: loginData.id,
          name: loginData.name,
          email: loginData.email,
          plan: loginData.plan,
          image: loginData.image || firebaseUser.photoURL || undefined,
        };
        localStorage.setItem('resumeai_user', JSON.stringify(userData));
        return userData;
      }

      // Fallback: store minimal data from Firebase if local API login fails
      const fallbackData: UserData = {
        id: firebaseUser.uid,
        name,
        email,
        plan: 'free',
        image: firebaseUser.photoURL || undefined,
      };
      localStorage.setItem('resumeai_user', JSON.stringify(fallbackData));
      return fallbackData;
    } catch {
      // If sync fails entirely, store Firebase data as fallback
      const fallbackData: UserData = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || fallbackName || 'User',
        email: firebaseUser.email || '',
        plan: 'free',
        image: firebaseUser.photoURL || undefined,
      };
      localStorage.setItem('resumeai_user', JSON.stringify(fallbackData));
      return fallbackData;
    }
  }, []);

  /**
   * Sign in with Google via Firebase popup, then sync with local DB.
   */
  const signInWithGoogle = useCallback(async (): Promise<UserData | null> => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return await syncWithLocalApi(result.user);
    } catch (error: unknown) {
      // If Firebase fails (e.g. invalid config), return null to signal fallback
      console.warn('Firebase Google sign-in failed:', error);
      return null;
    }
  }, [syncWithLocalApi]);

  /**
   * Sign up with email & password via Firebase, then sync with local DB.
   */
  const signUpWithEmail = useCallback(async (
    name: string,
    email: string,
    password: string,
  ): Promise<UserData | null> => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name in Firebase profile
      await updateProfile(credential.user, { displayName: name });

      // Create user in local DB
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      // Login via local API
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        const userData: UserData = {
          id: loginData.id,
          name: loginData.name,
          email: loginData.email,
          plan: loginData.plan,
          image: loginData.image || undefined,
        };
        localStorage.setItem('resumeai_user', JSON.stringify(userData));
        return userData;
      }

      // Fallback to sync helper
      return await syncWithLocalApi(credential.user, name);
    } catch (error: unknown) {
      console.warn('Firebase email signup failed:', error);
      return null;
    }
  }, [syncWithLocalApi]);

  /**
   * Sign in with email & password via Firebase, then sync with local DB.
   */
  const signInWithEmail = useCallback(async (
    email: string,
    password: string,
  ): Promise<UserData | null> => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      // Login via local API
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        const userData: UserData = {
          id: loginData.id,
          name: loginData.name,
          email: loginData.email,
          plan: loginData.plan,
          image: loginData.image || credential.user.photoURL || undefined,
        };
        localStorage.setItem('resumeai_user', JSON.stringify(userData));
        return userData;
      }

      // Fallback to sync helper
      return await syncWithLocalApi(credential.user);
    } catch (error: unknown) {
      console.warn('Firebase email sign-in failed:', error);
      return null;
    }
  }, [syncWithLocalApi]);

  /**
   * Send a Firebase password reset email.
   */
  const sendPasswordReset = useCallback(async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error: unknown) {
      console.warn('Firebase password reset failed:', error);
      return false;
    }
  }, []);

  /**
   * Sign out from Firebase and clear local data.
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: unknown) {
      console.warn('Firebase sign-out failed:', error);
    }
    localStorage.removeItem('resumeai_user');
  }, []);

  return {
    currentUser,
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    sendPasswordReset,
    logout,
  };
}
