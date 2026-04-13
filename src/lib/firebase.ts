import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBXgLj6Qdi-HnDZVXntS5F7R10C-8ScMqo',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'resume-ai-336b4.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'resume-ai-336b4',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'resume-ai-336b4.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '951102807650',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:951102807650:web:f305c578c5ae0028977b3b',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-7BK97R3SEZ',
};

// Log Firebase config on init (without sensitive keys)
if (typeof window !== 'undefined') {
  console.log('%c🔥 Firebase Configuration Loaded', 'color: orange; font-weight: bold', {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
  });
}

// Initialize Firebase only once (prevents re-initialization in dev with HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { app, auth };
