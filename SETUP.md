# Silent Moon - Setup Guide

## Quick Start

Follow these steps to get the Silent Moon meditation app running on your local machine.

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native and Expo
- React Navigation
- Redux Toolkit
- Firebase SDK
- OneSignal
- And all other dependencies

### Step 2: Start the Development Server

```bash
npm start
```

This will start the Expo development server and open the Expo DevTools in your browser.

### Step 3: Run on Your Device

#### Option A: Use Expo Go App (Easiest)
1. Install "Expo Go" app on your iOS or Android device
2. Scan the QR code shown in the terminal or Expo DevTools
3. The app will load on your device

#### Option B: Use Emulator/Simulator

**For iOS (Mac only):**
```bash
npm run ios
```

**For Android:**
```bash
npm run android
```

Make sure you have Android Studio or Xcode installed with an emulator/simulator set up.

#### Option C: Run on Web
```bash
npm run web
```

## Project Structure Overview

```
Meditation App/
├── App.js                      # Main app entry point
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── babel.config.js             # Babel configuration
├── assets/                     # Static assets
│   └── images/
│       └── signup-illustration.png
├── src/
│   ├── screens/               # App screens
│   │   ├── SignUpScreen.js           # Welcome/signup screen
│   │   └── SignUpFormScreen.js       # Registration form
│   └── redux/                 # State management
│       ├── store.js                  # Redux store
│       └── slices/
│           ├── authSlice.js          # Authentication state
│           └── userSlice.js          # User data state
├── prd.text                   # Product Requirements Document
└── requirements.txt           # Technical requirements
```

## Current Features

### ✅ Implemented
- **SignUpScreen**: Beautiful welcome screen with:
  - Silent Moon branding
  - Calming illustration
  - Sign up call-to-action
  - Login link
  
- **SignUpFormScreen**: Registration form with:
  - Name, email, and password inputs
  - Form validation
  - Password visibility toggle
  - Terms of service acknowledgment
  
- **Redux State Management**:
  - Authentication state (login, signup, logout)
  - User profile and preferences
  - Statistics tracking
  - Favorites and downloads management

### 🚧 To Be Implemented
- Login screen
- Password recovery
- Onboarding flow
- Home screen
- Meditation courses
- Audio player
- Sleep section
- Profile and stats
- Settings and preferences
- Notifications setup

## Firebase Setup (Required for Authentication)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Add a web app to your project
4. Copy the Firebase configuration
5. Create `src/utils/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

6. Enable Email/Password authentication in Firebase Console

## OneSignal Setup (Required for Notifications)

1. Create account at [OneSignal](https://onesignal.com/)
2. Create a new app
3. Get your App ID
4. Add to `app.json` configuration

## Troubleshooting

### Common Issues

**Issue: "Module not found" errors**
- Solution: Run `npm install` again
- Clear cache: `npm start -- --clear`

**Issue: Expo Go won't connect**
- Ensure your phone and computer are on the same WiFi network
- Try restarting the Expo development server

**Issue: iOS build fails**
- Make sure you're on macOS
- Install Xcode from App Store
- Run `npx pod-install` in the ios directory

**Issue: Android build fails**
- Install Android Studio
- Set up Android SDK
- Create an Android Virtual Device (AVD)

## Development Tips

1. **Hot Reload**: Changes to your code will automatically reload in the app
2. **Debug Menu**: Shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android) to open debug menu
3. **Console Logs**: View in terminal or Expo DevTools
4. **Redux DevTools**: Install Redux DevTools extension for state debugging

## Next Steps

1. Complete Firebase setup for authentication
2. Implement Login screen
3. Create Onboarding flow
4. Build Home screen
5. Add meditation content
6. Implement audio player
7. Set up notifications

## Resources

- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Firebase Documentation](https://firebase.google.com/docs)

## Support

For issues or questions:
1. Check the PRD document for feature specifications
2. Review the requirements.txt for technical details
3. Consult React Native/Expo documentation
4. Reach out to the development team

---

**Happy Coding! 🌙**

#TechloSet #BootcampWise
