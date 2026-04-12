import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as path from 'path';
import * as fs from 'fs';

let adminApp: App | null = null;
let db: any = null;
let auth: any = null;

// Only initialize if we're NOT building (runtime only)
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

if (!isBuildTime && !getApps().length) {
  // Try to load from JSON file first, then fallback to environment variable
  const serviceAccountPath = path.join(process.cwd(), 'resume-ai-336b4-firebase-adminsdk-fbsvc-fea78ac206.json');

  let credentialConfig: any;

  if (fs.existsSync(serviceAccountPath)) {
    // Load from file
    credentialConfig = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    adminApp = initializeApp({
      credential: cert(credentialConfig),
    });
  } else if (process.env.FIREBASE_PRIVATE_KEY) {
    // Load from environment variable
    credentialConfig = {
      projectId: 'resume-ai-336b4',
      clientEmail: 'firebase-adminsdk-fbsvc@resume-ai-336b4.iam.gserviceaccount.com',
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
    adminApp = initializeApp({
      credential: cert(credentialConfig),
    });
  } else {
    // Gracefully handle missing credentials during build
    console.warn('⚠️ Firebase Admin credentials not found. Firebase features will be disabled.');
    console.warn('Please provide either the service account JSON file or FIREBASE_PRIVATE_KEY environment variable.');
  }
} else if (getApps().length) {
  adminApp = getApps()[0];
}

if (adminApp) {
  db = getFirestore(adminApp);
  auth = getAuth(adminApp);
}

export { adminApp, db, auth };
