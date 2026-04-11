import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDemoPlaceholderReplaceMeWithRealKey',
  authDomain: 'resumeai-demo.firebaseapp.com',
  projectId: 'resumeai-demo',
  storageBucket: 'resumeai-demo.firebasestorage.app',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:0000000000000000',
};

// Initialize Firebase only once (prevents re-initialization in dev with HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { app, auth };
