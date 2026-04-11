// Database abstraction layer - Now using Firebase Firestore
// This file replaces the old Prisma client with Firebase Admin SDK
import { db_api } from './firestore';

export { db_api as db };

// For backwards compatibility, also export individual collections
export const { user, resume, template, payment, siteSetting } = db_api;
