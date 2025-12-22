# Production Build Guide
**Silent Moon Meditation App**  
**Version:** 1.0.0  
**Date:** December 22, 2025

---

## ✅ Pre-Build Checklist

### 1. **Code Cleanup** ✅
- ✅ Removed debug console.logs
- ✅ Hidden FirebaseTest screen from production
- ✅ Cleaned up unused imports
- ✅ Error handling in place

### 2. **OneSignal Notifications** ✅
- ✅ OneSignal package installed
- ✅ Configuration ready (commented for easy activation)
- ✅ App ID configured: `66c6114a-f5fa-4c4d-b94f-17387cc07b46`

**To Enable OneSignal:**
1. Open `App.js`
2. Uncomment line 8: `import { LogLevel, OneSignal } from 'react-native-onesignal';`
3. Uncomment lines 127-137 (OneSignal initialization code)
4. Rebuild the app

### 3. **Configuration Files** ✅
- ✅ `app.json` - App metadata configured
- ✅ `package.json` - All dependencies installed
- ✅ Firebase configuration - Connected and working
- ✅ Redux store - Properly configured

---

## 📱 Building Production APK

### **Option 1: EAS Build (Recommended)**

#### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 2: Login to Expo
```bash
eas login
```

#### Step 3: Configure EAS
```bash
eas build:configure
```

#### Step 4: Build APK
```bash
# For Android APK
eas build --platform android --profile preview

# For production AAB (Google Play Store)
eas build --platform android --profile production
```

#### Step 5: Download APK
Once the build completes, EAS will provide a download link.

---

### **Option 2: Local Build**

#### Prerequisites
- ✅ Android SDK installed
- ✅ Java JDK configured
- ✅ Environment variables set (ANDROID_HOME, JAVA_HOME)

#### Build Commands

**Development Build:**
```bash
npx expo run:android --variant release
```

**Production APK:**
```bash
cd android
./gradlew assembleRelease
```

**APK Location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🔐 App Signing (For Production)

### Generate Keystore
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore silent-moon.keystore -alias silent-moon-key -keyalg RSA -keysize 2048 -validity 10000
```

### Configure Signing in `android/app/build.gradle`
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('silent-moon.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'silent-moon-key'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

---

## 📦 App Store Deployment

### **Google Play Store**

#### 1. Prepare Assets
- ✅ App Icon (512x512 PNG)
- ✅ Feature Graphic (1024x500 PNG)
- ✅ Screenshots (at least 2)
- ✅ Privacy Policy URL
- ✅ App Description

#### 2. Build AAB
```bash
eas build --platform android --profile production
```

#### 3. Upload to Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Upload AAB file
4. Fill in app details
5. Submit for review

---

### **Apple App Store** (iOS)

#### 1. Build IPA
```bash
eas build --platform ios --profile production
```

#### 2. Upload to App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Upload IPA via Transporter
4. Fill in app details
5. Submit for review

---

## 🔧 Environment Configuration

### **Production Environment Variables**

Create `.env.production`:
```env
# Firebase
FIREBASE_API_KEY=AIzaSyA95k7vqo-JpJVvcixpa-KiYBq5pMgK6JM
FIREBASE_AUTH_DOMAIN=silent-moon-meditation1.firebaseapp.com
FIREBASE_PROJECT_ID=silent-moon-meditation1

# OneSignal
ONESIGNAL_APP_ID=66c6114a-f5fa-4c4d-b94f-17387cc07b46

# App
APP_ENV=production
```

---

## 📊 Build Variants

### Development
- Debug mode enabled
- Console logs visible
- Hot reload enabled
- Test screens available

### Staging
- Production-like environment
- Limited logging
- Test data
- Internal testing

### Production
- Optimized build
- Minimal logging
- Real data
- App store ready

---

## ✅ Final Checklist Before Release

- [ ] Test all features thoroughly
- [ ] Verify Firebase connection
- [ ] Test authentication flows
- [ ] Check audio playback
- [ ] Verify responsive design on multiple devices
- [ ] Test on different Android versions
- [ ] Enable OneSignal (if needed)
- [ ] Update version number in `app.json`
- [ ] Generate signed APK/AAB
- [ ] Test signed build on physical device
- [ ] Prepare app store assets
- [ ] Write release notes
- [ ] Submit to app stores

---

## 🚀 Quick Build Commands

**Development:**
```bash
npx expo start
```

**Android Development Build:**
```bash
npx expo run:android
```

**Production APK (EAS):**
```bash
eas build --platform android --profile production
```

**Production APK (Local):**
```bash
cd android && ./gradlew assembleRelease
```

---

## 📱 Testing Checklist

### Functional Testing
- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Password reset
- [ ] Complete onboarding
- [ ] Play meditation audio
- [ ] Play sleep stories
- [ ] Edit profile
- [ ] Change preferences
- [ ] Set reminders
- [ ] Navigate all screens
- [ ] Test bottom navigation

### Performance Testing
- [ ] App startup time < 3 seconds
- [ ] Smooth scrolling
- [ ] No memory leaks
- [ ] Audio playback smooth
- [ ] Image loading optimized

### Device Testing
- [ ] Small phones (< 375px width)
- [ ] Medium phones (375-414px)
- [ ] Large phones (> 414px)
- [ ] Tablets
- [ ] Different Android versions (8.0+)

---

## 🔍 Troubleshooting

### Build Fails
1. Clean build cache: `cd android && ./gradlew clean`
2. Clear node modules: `rm -rf node_modules && npm install`
3. Clear Expo cache: `npx expo start --clear`

### APK Not Installing
1. Enable "Unknown Sources" on device
2. Check minimum SDK version compatibility
3. Verify APK is signed correctly

### App Crashes on Launch
1. Check Firebase configuration
2. Verify all dependencies installed
3. Check for missing permissions in AndroidManifest.xml

---

## 📞 Support

**Developer:** Your Name  
**Email:** your.email@example.com  
**Project:** Silent Moon Meditation App  
**Repository:** [GitHub Link]

---

## 📝 Version History

### v1.0.0 (Current)
- Initial release
- Full meditation and sleep features
- User authentication
- Profile management
- Audio playback
- Responsive design

---

**Last Updated:** December 22, 2025  
**Status:** ✅ Ready for Production Build
