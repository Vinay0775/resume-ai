import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBXgLj6Qdi-HnDZVXntS5F7R10C-8ScMqo',
  authDomain: 'resume-ai-336b4.firebaseapp.com',
  projectId: 'resume-ai-336b4',
  storageBucket: 'resume-ai-336b4.firebasestorage.app',
  messagingSenderId: '951102807650',
  appId: '1:951102807650:web:f305c578c5ae0028977b3b',
  measurementId: 'G-7BK97R3SEZ',
};

// Initialize Firebase only once (prevents re-initialization in dev with HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

export { app, auth };
