// Database abstraction layer - Now using Firebase Firestore
// This file replaces the old Prisma client with Firebase Admin SDK
import { db_api } from './firestore';
import { adminApp } from './firebase-admin';

// Check if Firebase is initialized
if (!adminApp) {
  console.warn('⚠️ Firebase Admin is not initialized. Database will return empty data.');
}

// Export wrapped db functions that gracefully handle missing Firebase
export const db = {
  user: {
    ...db_api.user,
    async count(options?: any) {
      if (!adminApp) return 0;
      return db_api.user.count(options);
    },
  },
  resume: {
    ...db_api.resume,
    async count() {
      if (!adminApp) return 0;
      return db_api.resume.count();
    },
  },
  template: {
    ...db_api.template,
    async count() {
      if (!adminApp) return 0;
      return db_api.template.count();
    },
  },
  payment: {
    ...db_api.payment,
    async count() {
      if (!adminApp) return 0;
      return db_api.payment.count();
    },
  },
  siteSetting: db_api.siteSetting,
};

// For backwards compatibility, also export individual collections
export const user = db.user;
export const resume = db.resume;
export const template = db.template;
export const payment = db.payment;
export const siteSetting = db.siteSetting;
