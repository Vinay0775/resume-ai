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
  role: string;
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
          role: loginData.role || 'user',
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
        role: 'user',
        image: firebaseUser.photoURL || undefined,
      };
      localStorage.setItem('resumeai_user', JSON.stringify(fallbackData));
      return fallbackData;
    } catch {
      const fallbackData: UserData = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || fallbackName || 'User',
        email: firebaseUser.email || '',
        plan: 'free',
        role: 'user',
        image: firebaseUser.photoURL || undefined,
      };
      localStorage.setItem('resumeai_user', JSON.stringify(fallbackData));
      return fallbackData;
    }
  }, []);

  /**
   * Sign in with Google via Firebase popup.
   * Returns UserData on success, null on failure (caller should show fallback UI).
   */
  const signInWithGoogle = useCallback(async (): Promise<UserData | null> => {
    try {
      const provider = new GoogleAuthProvider();
      console.log('%c🔵 Google Sign-in initiated: signInWithPopup', 'color: blue; font-weight: bold');
      
      const result = await signInWithPopup(auth, provider);
      console.log('%c✅ Google Sign-in successful', 'color: green; font-weight: bold', {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
      });
      
      return await syncWithLocalApi(result.user);
    } catch (error: unknown) {
      const firebaseError = error as { code?: string; message?: string };
      
      // Log error for debugging
      console.error('%c❌ Google Sign-in error', 'color: red; font-weight: bold', {
        code: firebaseError.code,
        message: firebaseError.message,
        fullError: error,
      });

      // Log special error cases
      if (firebaseError.code === 'auth/popup-blocked') {
        console.warn('⚠️ Popup was blocked. User may need to allow popups.');
      } else if (firebaseError.code === 'auth/popup-closed-by-user') {
        console.warn('⚠️ User closed the popup.');
      } else if (firebaseError.code === 'auth/cancelled-popup-request') {
        console.warn('⚠️ Popup request was cancelled.');
      } else if (firebaseError.code === 'auth/unauthorized-domain') {
        console.error('🔴 CRITICAL: Domain not authorized in Firebase Console!');
        console.error('Please add the current domain to Firebase > Authentication > Settings > Authorized domains');
      } else if (firebaseError.code === 'auth/invalid-credential') {
        console.error('🔴 Invalid credentials. Check Firebase configuration.');
      } else if (firebaseError.code === 'auth/operation-not-supported-in-this-environment') {
        console.error('🔴 Google sign-in not supported in this environment.');
      }

      // Return null so the caller can show a fallback (email dialog)
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
      await updateProfile(credential.user, { displayName: name });

      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

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
          role: loginData.role || 'user',
          image: loginData.image || undefined,
        };
        localStorage.setItem('resumeai_user', JSON.stringify(userData));
        return userData;
      }

      return await syncWithLocalApi(credential.user, name);
    } catch (error: unknown) {
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
          role: loginData.role || 'user',
          image: loginData.image || credential.user.photoURL || undefined,
        };
        localStorage.setItem('resumeai_user', JSON.stringify(userData));
        return userData;
      }

      return await syncWithLocalApi(credential.user);
    } catch (error: unknown) {
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
      // Sign-out error handled silently
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
