import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';
import * as fs from 'fs';

let adminApp: App | null = null;
let db: any = null;
let auth: any = null;

// Only initialize during runtime, NOT during build
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

if (!isBuildTime && !getApps().length) {
  try {
    // Try to load from JSON file first
    const serviceAccountPath = path.join(process.cwd(), 'resume-ai-336b4-firebase-adminsdk-fbsvc-fea78ac206.json');
    const privateKeyPath = path.join(process.cwd(), 'firebase_private_key.json');

    if (fs.existsSync(serviceAccountPath)) {
      const credentialConfig = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      adminApp = initializeApp({ credential: cert(credentialConfig) });
      console.log('✅ Firebase Admin initialized from JSON file');
    } else if (fs.existsSync(privateKeyPath)) {
      // Load from firebase_private_key.json
      const credentialConfig = JSON.parse(fs.readFileSync(privateKeyPath, 'utf8'));
      adminApp = initializeApp({ credential: cert(credentialConfig) });
      console.log('✅ Firebase Admin initialized from firebase_private_key.json');
    } else if (process.env.FIREBASE_PRIVATE_KEY) {
      // Load from environment variable
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      // Handle different formats
      if (privateKey.includes('BEGIN PRIVATE KEY')) {
        // Already in correct format, just replace \n
        privateKey = privateKey.replace(/\\n/g, '\n');
      } else if (privateKey.includes('BEGIN RSA PRIVATE KEY')) {
        // RSA format, still valid
        privateKey = privateKey.replace(/\\n/g, '\n');
      }
      
      adminApp = initializeApp({
        credential: cert({
          projectId: 'resume-ai-336b4',
          clientEmail: 'firebase-adminsdk-fbsvc@resume-ai-336b4.iam.gserviceaccount.com',
          privateKey: privateKey,
        }),
      });
      console.log('✅ Firebase Admin initialized from environment variable');
    } else {
      console.error('⚠️⚠️⚠️ CRITICAL: Firebase Admin credentials not found!');
      console.error('User data will NOT be saved to Firestore database.');
      console.error('');
      console.error('To fix this, you need to:');
      console.error('1. Go to Firebase Console: https://console.firebase.google.com/');
      console.error('2. Select project: resume-ai-336b4');
      console.error('3. Settings → Service accounts → Generate new private key');
      console.error('4. Download the JSON file');
      console.error('5. Place it in the project root as: resume-ai-336b4-firebase-adminsdk-fbsvc-fea78ac206.json');
      console.error('');
      console.error('OR set these environment variables in .env.local:');
      console.error('FIREBASE_PROJECT_ID=resume-ai-336b4');
      console.error('FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@resume-ai-336b4.iam.gserviceaccount.com');
      console.error('FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n..."');
    }
  } catch (error: any) {
    console.error('❌ Firebase Admin initialization failed:', error?.message || error);
    console.warn('⚠️ Continuing without Firebase Admin SDK. Database features will be disabled.');
    adminApp = null;
  }
} else if (getApps().length) {
  adminApp = getApps()[0];
}

// Initialize db and auth only if adminApp is available
if (adminApp) {
  try {
    db = getFirestore(adminApp);
    auth = getAuth(adminApp);
  } catch (error) {
    console.error('Failed to get Firestore/Auth:', error);
    db = null;
    auth = null;
  }
}

export { adminApp, db, auth };
