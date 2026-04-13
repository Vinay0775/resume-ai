// Database abstraction layer - Now using Firebase Firestore
// This file replaces the old Prisma client with Firebase Admin SDK
import { db_api } from './firestore';
import { adminApp, db as firebaseDb } from './firebase-admin';

// Check if Firebase is initialized
if (!adminApp) {
  console.error('⚠️⚠️⚠️ WARNING: Firebase Admin is not initialized!');
  console.error('Database operations will return empty/null.');
  console.error('User signup data will NOT be saved to Firestore.');
  console.error('Please check src/lib/firebase-admin.ts for setup instructions.');
}

// Safe wrapper that handles missing Firebase gracefully with try/catch
const safeCall = async <T>(fn: (...args: any[]) => Promise<T>, fallback: T = null as any): Promise<T> => {
  if (!adminApp || !firebaseDb) {
    console.warn('Database call skipped - Firebase or Firestore not initialized');
    return fallback;
  }
  try {
    return await fn();
  } catch (error) {
    console.error('Database call failed:', error);
    return fallback;
  }
};

// Export wrapped db functions that gracefully handle missing Firebase
export const db = {
  user: {
    findUnique: (...args: any[]) => safeCall(() => db_api.user.findUnique(...args), null),
    findUniqueById: (...args: any[]) => safeCall(() => db_api.user.findUniqueById(...args), null),
    create: (...args: any[]) => safeCall(() => db_api.user.create(...args), null),
    update: (...args: any[]) => safeCall(() => db_api.user.update(...args)),
    delete: (...args: any[]) => safeCall(() => db_api.user.delete(...args)),
    findMany: (...args: any[]) => safeCall(() => db_api.user.findMany(...args), []),
    count: (...args: any[]) => safeCall(() => db_api.user.count(...args), 0),
  },
  resume: {
    findMany: (...args: any[]) => safeCall(() => db_api.resume.findMany(...args), []),
    findUnique: (...args: any[]) => safeCall(() => db_api.resume.findUnique(...args), null),
    create: (...args: any[]) => safeCall(() => db_api.resume.create(...args), null),
    update: (...args: any[]) => safeCall(() => db_api.resume.update(...args)),
    delete: (...args: any[]) => safeCall(() => db_api.resume.delete(...args)),
    count: (...args: any[]) => safeCall(() => db_api.resume.count(...args), 0),
  },
  template: {
    findMany: (...args: any[]) => safeCall(() => db_api.template.findMany(...args), []),
    create: (...args: any[]) => safeCall(() => db_api.template.create(...args), null),
    update: (...args: any[]) => safeCall(() => db_api.template.update(...args)),
    delete: (...args: any[]) => safeCall(() => db_api.template.delete(...args)),
    count: (...args: any[]) => safeCall(() => db_api.template.count(...args), 0),
  },
  payment: {
    findMany: (...args: any[]) => safeCall(() => db_api.payment.findMany(...args), []),
    create: (...args: any[]) => safeCall(() => db_api.payment.create(...args), null),
    update: (...args: any[]) => safeCall(() => db_api.payment.update(...args)),
    count: (...args: any[]) => safeCall(() => db_api.payment.count(...args), 0),
  },
  siteSetting: {
    findMany: (...args: any[]) => safeCall(() => db_api.siteSetting.findMany(...args), []),
    findUnique: (...args: any[]) => safeCall(() => db_api.siteSetting.findUnique(...args), null),
    upsert: (...args: any[]) => safeCall(() => db_api.siteSetting.upsert(...args)),
  },
};

// For backwards compatibility, also export individual collections
export const user = db.user;
export const resume = db.resume;
export const template = db.template;
export const payment = db.payment;
export const siteSetting = db.siteSetting;
