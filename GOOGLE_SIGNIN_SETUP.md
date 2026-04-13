# Google Sign-In Setup Guide

यह guide Firebase Console में Google Sign-In enable करने के लिए है। अगर Google sign-in fail हो रहा है, तो यह steps follow करें।

## समस्याएं और समाधान

### समस्या: "Google sign-in failed" message दिखता है

**मुख्य कारण:**
1. Firebase Console में Google provider enable नहीं है
2. Domain को Firebase में authorized नहीं किया गया है  
3. OAuth Consent Screen configured नहीं है

---

## Step 1: Firebase Console खोलें

1. https://console.firebase.google.com/ जाएं
2. Project `resume-ai-336b4` select करें

---

## Step 2: Google Sign-In Provider Enable करें

### A. Authentication जाएं
1. बाईं तरफ menu में "Build" → "Authentication" पर क्लिक करें
2. "Sign-in method" tab खोलें

### B. Google Provider Enable करें  
1. "Add new provider" button दिखेगा
2. **Google** को click करके enable करें
3. अगर पहले से enable है, तो आगे बढ़ें

### C. OAuth Consent Screen Setup (महत्वपूर्ण!)
1. Google Setup में एक warning दिखेगी: "Please configure your OAuth consent screen"
2. Firebase द्वारा दिया गया link (या Google Cloud Console जाएं:
   - https://console.cloud.google.com/apis/consent
3. यहां:
   - **User Type:** "External" select करें
   - **App Information:**
     - App name: "Resume AI"
     - User support email: अपनी email भरें
     - Developer contact: अपनी email भरें
   - **Scopes:** 
     - `email`, `profile`, `openid` automatically add हो जाएंगी
   - Save करके आगे बढ़ें

4. **Test Users add करें (Optional but recommended):**
   - आपकी email को test user के रूप में add करें
   - यह production में release से पहले testing के लिए है

---

## Step 3: Authorized Domains जोड़ें (Most Important!)

### Firebase Console में
1. Authentication → Sign-in method → Google provider edit करें
2. "Authorized domains" section ढूंढें
3. अपना domain add करें:

**Local Development के लिए:**
```
localhost
127.0.0.1
```

**Production के लिए:**
```
yourdomain.com
www.yourdomain.com
```

**वर्तमान में अगर port के साथ चला रहे हैं:**
```
localhost:3000
```

### Google Cloud Console में भी authorize करें
1. APIs & Services → Credentials जाएं
2. "OAuth 2.0 Client IDs" में अपना web application क्लिक करें
3. **Authorized JavaScript origins** में add करें:
   ```
   http://localhost:3000
   http://localhost:81
   https://yourdomain.com
   ```

4. **Authorized redirect URIs** में add करें:
   ```
   http://localhost:3000/__/auth/handler
   http://localhost:81/__/auth/handler
   https://yourdomain.com/__/auth/handler
   ```

---

## Step 4: Verification करें

### Browser Console में Debug Messages देखें

1. अपनी website खोलें: http://localhost:3000
2. Login/Signup page जाएं  
3. **F12** दबाएं (Developer Console खोलें)
4. Google Sign-In button click करें
5. Console में आपको यह messages दिखेंगे:

**अगर सफल है:**
```
🔥 Firebase Configuration Loaded
🔥 Google Sign-in initiated: signInWithPopup
✅ Google Sign-in successful
```

**अगर fail है, तो error code देखें:**
```
❌ Google Sign-in error
code: "auth/unauthorized-domain"
```

---

## Common Error Codes और Solutions

### `auth/unauthorized-domain`
**यानी:** Domain Firebase में authorized नहीं है  
**समाधान:** Step 3 फिर से करें और domain को add करें

### `auth/invalid-credential`  
**यानी:** Firebase config गलत है या Google provider disable है  
**समाधान:** Firebase Console check करें कि Google provider enabled है या नहीं

### `auth/operation-not-supported-in-this-environment`
**यानी:** Popup को browser block कर रहा है  
**समाधान:**
- Browser settings में popups allow करें
- Private/Incognito mode में try करें
- Extensions disable करके try करें

### `auth/popup-blocked`
**यानी:** Google popup/redirect थम गया
**समाधान:** Browser popups को allow करें

---

## Troubleshooting Checklist

यह checklist follow करें अगर Google sign-in still fail हो:

- [ ] Firebase Console में Google provider **enabled** है?
- [ ] OAuth Consent Screen **configured** है?
- [ ] Authorized Domains में अपना domain/localhost **add** है?
- [ ] Google Cloud Console में JavaScript origins **add** हैं?
- [ ] `.env` file में सही Firebase credentials हैं?
- [ ] Browser console में error code क्या है?
- [ ] Incognito/Private mode में try किया?
- [ ] Browser extensions disable करके try किया?

---

## Production Deploy के लिए

जब production पर deploy करें:

1. **Domain को authorized करें:**
   - Firebase Console → Authentication → Authorized domains में अपना domain add करें

2. **`.env` file update करें:**
   ```env
   NEXT_PUBLIC_APP_URL="https://yourdomain.com"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="resume-ai-336b4.firebaseapp.com"
   ```

3. **Google Cloud Console में redirect URIs update करें:**
   ```
   https://yourdomain.com/__/auth/handler
   ```

4. **Test करें** production domain से पहले deployment करने से

---

## Quick Fix Commands

अगर cached config issue हो तो:

```bash
# 1. Clear Node modules
rm -rf node_modules
npm install

# 2. Clear Next.js cache  
rm -rf .next

# 3. Restart dev server
npm run dev
```

---

## Firebase Admin SDK भी Check करें

Production में Firebase Admin SDK authenticate करने के लिए:

1. Firebase Console → Project settings → Service accounts
2. "Generate new private key" करें
3. File को root directory में रखें (पहले से `resume-ai-336b4-firebase-adminsdk-fbsvc-fea78ac206.json` है)

---

## Support Links

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Google OAuth Setup Guide](https://cloud.google.com/docs/authentication/oauth2)
- [Firebase Console](https://console.firebase.google.com)
- [Google Cloud Console](https://console.cloud.google.com)

---

**अगर अभी भी issue है, तो browser console से error code note करें और above checklist follow करें।**
