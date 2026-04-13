# 🎯 Google Sign-In Fix - Step-by-Step Checklist

---

## STEP 1️⃣: Firebase Console खोलें
```
📱 Browser में open करें:
👉 https://console.firebase.google.com/

✅ Project select करें: resume-ai-336b4
```

**Status:** [ ] Done

---

## STEP 2️⃣: Authentication Section खोलें
```
🔧 Left sidebar में:
👉 Build → Authentication → Sign-in method tab

📋 Check करें:
   ☑ Google provider दिख रहा है?
   ☑ Status: Enabled (green checkmark)?
```

**Status:** [ ] Done

---

## STEP 3️⃣: OAuth Consent Screen (अगर ज़रूरत हो)
```
⚠️ अगर warning दिख रहा हो:
"Please configure your OAuth consent screen"

📝 Link click करें → Google setup page जाएगा
👉 https://console.cloud.google.com/apis/consent

📋 Fill करें:
   - App name: "Resume AI"
   - User support email: yourmail@gmail.com
   - Developer contact: yourmail@gmail.com
   
✅ Save करके आगे बढ़ें
```

**Status:** [ ] Done (अगर needed हो)

---

## STEP 4️⃣: Authorized Domains Add करें ⭐ IMPORTANT!
```
🔐 Same page पर (Authentication > Sign-in method):
👉 "Authorized domains" section ढूंढ़ें

➕ Click करें: Add domain (या edit करें)

📝 LOCAL DEVELOPMENT के लिए add करें:
   ☐ localhost
   ☐ 127.0.0.1
   ☐ localhost:3000
   ☐ localhost:81

💾 Save करें
```

**Status:** [ ] Done

---

## STEP 5️⃣: .env File Check करें
```
📂 Project root folder में:
👉 .env file खोलें

✅ Check करें कि यह lines हैं:
   
   NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBXgLj6Qdi-HnDZVXntS5F7R10C-8ScMqo"
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="resume-ai-336b4.firebaseapp.com"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="resume-ai-336b4"
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="resume-ai-336b4.firebasestorage.app"
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="951102807650"
   NEXT_PUBLIC_FIREBASE_APP_ID="1:651102807650:web:f305c578c5ae0028977b3b"
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="G-7BK97R3SEZ"

👍 Sab ek jaise hain? Good!
```

**Status:** [ ] Done

---

## STEP 6️⃣: Dev Server Restart करें
```
💻 Terminal में:
👉 Ctrl+C (पुरानी process को stop करने के लिए)

👉 npm run dev

⏳ Wait करें जब तक:
   "ready - started server on 0.0.0.0:3000"
   दिख जाए
```

**Status:** [ ] Done

---

## STEP 7️⃣: Test करें! 
```
📱 Browser खोलें:
👉 http://localhost:3000

📖 Signup या Login page खोलें

🖱️ Click: Google Sign-In button

⏳ Wait करें...

✅ अगर काम करता है:
   - Dashboard पर redirect हो जाएगा
   - Success! 🎉

❌ अगर fail होता है:
   - Error message दिख जाएगा
   - Continue to STEP 8️⃣
```

**Status:** [ ] Test Done

---

## STEP 8️⃣: Debug करें (अगर fail हो)
```
🔍 Browser Console खोलें:
👉 F12 key दबाएं

👉 Console tab खोलें

🖱️ Google button फिर से click करें

📋 देखें क्या message आता है:

❓ Messages देखें:

✅ SUCCESS message:
   ✓ 🔵 Google Sign-in initiated: signInWithPopup
   ✓ ✅ Google Sign-in successful

❌ ERROR message:
   ✓ ❌ Google Sign-in error
   ✓ code: "auth/..."
   
👉 Error code को ya GOOGLE_SIGNIN_DEBUG.md में search करें
```

**Status:** [ ] Debug Done

---

## Error Code Solutions

### 🔴 `auth/unauthorized-domain`
```
समस्या: Domain authorized नहीं है

समाधान:
1. Firebase Console खोलें
2. Authentication > Sign-in method
3. Authorized domains में अपना domain/localhost add करें
4. Save करें
5. Dev server restart करें (npm run dev)
```

### 🔴 `auth/invalid-credential`
```
समस्या: Firebase credentials गलत हैं

समाधान:
1. Firebase console में project settings check करें
2. GOOGLE_SIGNIN_SETUP.md read करें
3. Credentials को फिर से copy करें
```

### 🔴 `auth/popup-blocked`
```
समस्या: Browser popups को block कर रहा है

समाधान:
1. Browser settings में popups allow करें
2. Incognito/Private mode में try करें
3. Browser extensions disable करके try करें
```

### 🔴 `auth/operation-not-supported`
```
समस्या: Environment issue

समाधान:
1. Incognito/Private mode में try करें
2. Different browser में try करें
3. npm run dev से server restart करें
```

---

## ✅ Final Checklist

```
Pre-requisites:
☐ Firebase project access है?
☐ .env file values correct हैं?

Firebase Setup:
☐ Google provider enabled है?
☐ Authorized domains add हैं?
☐ OAuth consent screen setup है?

Code:
☐ npm run dev successfully run हो रहा है?
☐ Linting errors नहीं हैं?

Testing:
☐ http://localhost:3000 खुलता है?
☐ Login page load होता है?
☐ F12 console error नहीं दिख रहा?

Google Sign-In:
☐ Google button दिख रहा है?
☐ Button click करने देता है?
☐ Popup/redirect open होता है?
☐ Success या clear error message आता है?
```

---

## 📞 Still Having Issues?

```
1. GOOGLE_SIGNIN_SETUP.md को पूरा read करें (step-by-step)
2. GOOGLE_SIGNIN_DEBUG.md से troubleshooting करें
3. Browser console errors को note करें
4. Firebase project settings को re-check करें
```

---

## 🎯 Success Indicators

✅ Google button click होता है  
✅ Browser popup/redirect open होता है  
✅ Google account select करने देता है  
✅ Dashboard पर login हो जाता है  
✅ User data localStorage में save होता है  

---

**Ready? Start from STEP 1! 🚀**

आप सब steps follow करते हैं तो 100% काम करेगा!

Good luck! 💪
