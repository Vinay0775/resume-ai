# 🔥 Firebase Database Not Saving - Problem & Solution

## Problem Identified
When users sign up via Google or Email/Password, their data is **NOT being saved to Firebase Firestore database**. Firebase Authentication works, but user records are not appearing in your Firebase Console.

## Root Cause
The **Firebase Admin SDK is not initialized** because the service account credentials file is missing from the project. Without it, Firestore database operations are disabled.

### What's Happening:
1. ✅ User signs up via Google or Email/Password
2. ✅ Firebase Authentication creates the user (Auth works fine)
3. ❌ The app tries to save user data to Firestore via `/api/user`
4. ❌ `db.user.create()` returns `null` because Firebase Admin is not initialized
5. ❌ A "mock user" is returned but NOT saved to the database
6. ❌ User data never appears in Firebase Console

## Solution (Choose ONE method):

### Method 1: Download Service Account JSON File (Recommended)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select your project: `resume-ai-336b4`

2. **Download the Service Account Key**
   - Click ⚙️ (Settings) → Project settings
   - Go to "Service accounts" tab
   - Click "Firebase Admin SDK" → "Generate new private key"
   - Click "Generate key" to download the JSON file

3. **Add the file to your project**
   - Rename the downloaded file to: `resume-ai-336b4-firebase-adminsdk-fbsvc-fea78ac206.json`
   - Place it in the project root directory (same level as `package.json`)
   - The file is already in `.gitignore` so it won't be committed

4. **Restart your development server**
   ```bash
   npm run dev
   ```

5. **Verify**
   - Sign up with a new account
   - Check Firebase Console → Firestore Database
   - You should see a `users` collection with the new user

---

### Method 2: Use Environment Variables

1. **Get your service account credentials**
   - Follow steps 1-2 from Method 1 to download the JSON file
   - Open the downloaded JSON file

2. **Create `.env.local` file**
   - Copy `.env.local.example` to `.env.local`:
     ```bash
     copy .env.local.example .env.local
     ```

3. **Update the values**
   - Open the JSON file you downloaded
   - Copy these values to `.env.local`:
     ```
     FIREBASE_PROJECT_ID=your_project_id
     FIREBASE_CLIENT_EMAIL=your_client_email
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
     ```

4. **Restart your development server**
   ```bash
   npm run dev
   ```

---

## How to Verify It's Working

1. **Check the console logs when server starts:**
   - ✅ Good: `✅ Firebase Admin initialized from JSON file`
   - ❌ Bad: `⚠️⚠️⚠️ CRITICAL: Firebase Admin credentials not found!`

2. **Test signup:**
   - Create a new account via Google or Email/Password
   - Check Firebase Console → Firestore Database
   - You should see a `users` collection with your new user

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for any database-related errors

---

## What I Changed

1. **Improved error messages** in `src/lib/firebase-admin.ts`
   - Now shows clear instructions when credentials are missing
   - Displays setup steps in console

2. **Enhanced warnings** in `src/lib/db.ts`
   - Shows critical warning when database is not initialized
   - Makes it obvious that user data won't be saved

3. **Created `.env.local.example`**
   - Template file with instructions for environment variables
   - Makes it easier to set up credentials

---

## Additional Notes

### Why Firebase Admin SDK?
- Firebase Client SDK (in browser) handles authentication
- Firebase Admin SDK (on server) handles database operations
- This architecture keeps your database secure

### Security
- The service account file is in `.gitignore` - never commit it
- For production, use environment variables (Vercel, Railway, etc.)
- Never expose private keys in client-side code

### Troubleshooting

**Still not working?**
1. Check server console for initialization messages
2. Verify the JSON file is in the correct location
3. Ensure the file name matches exactly
4. Restart the dev server after adding credentials
5. Check browser console for errors

**Getting "permission denied" errors?**
- In Firebase Console → Firestore Database → Rules
- Make sure rules allow writes (for development):
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```
  ⚠️ Only use this for development. Update rules for production!

---

## Need Help?

Check these files for more details:
- `src/lib/firebase-admin.ts` - Firebase Admin initialization
- `src/lib/db.ts` - Database operations
- `.env.local.example` - Environment variable template
