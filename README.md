# Silent Moon - Meditation & Mindfulness App

A beautiful, calming meditation and mindfulness mobile application built with React Native (Expo). This app helps users improve mental well-being through guided meditation sessions, calming music, sleep stories, breathing exercises, and personalized progress insights.

## 🌙 Features

### Authentication & User Management

- Email/password signup and login via Firebase Auth
- Password recovery functionality
- Persistent login sessions
- Secure user data management

### Onboarding Experience

- Welcome screens introducing app benefits
- User mood and goal selection (Reduce Stress, Better Sleep, Focus)
- Theme customization options

### Core Features

- **Home Screen**: Daily recommended sessions with personalized greetings
- **Meditation Courses**: Categorized content (Focus, Relax, Sleep)
- **Audio Player**: Full playback controls with background audio support
- **Sleep Section**: Sleep stories, ambient sounds, and bedtime music
- **Progress Tracking**: Daily streaks, total minutes, courses completed
- **Offline Support**: Download sessions for offline listening
- **Notifications**: Daily meditation reminders via OneSignal

### User Preferences

- Light/dark theme options
- Language selection
- Customizable reminder times
- Download management

## 🎨 Design Philosophy

The app features:

- Soft gradients and calming pastel color palette
- Soothing illustrations with minimal visual noise
- Smooth transitions and animations
- Intuitive navigation
- Accessible design with proper contrast ratios

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **State Management**: Redux Toolkit
- **Backend**: Firebase (Authentication & Firestore)
- **Notifications**: OneSignal
- **Audio**: expo-av
- **Navigation**: React Navigation

## 📁 Project Structure

```
/src
  /components      # Reusable UI components
  /screens         # App screens
  /redux           # Redux store and slices
    /slices        # Redux slices (auth, user)
  /assets          # Images, icons, audio files
  /utils           # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd "Meditation App"
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📱 Current Implementation

### Completed Screens

- ✅ **SignUpScreen**: Welcome screen with app branding and illustration
- ✅ **SignUpFormScreen**: User registration form with validation

### Redux State Management

- ✅ Auth slice (login, signup, logout)
- ✅ User slice (profile, preferences, stats, favorites, downloads)

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add your Firebase configuration to `src/utils/firebase.js`
3. Enable Email/Password authentication in Firebase Console

### OneSignal Setup

1. Create an account at [OneSignal](https://onesignal.com/)
2. Add your OneSignal App ID to the configuration
3. Configure push notification certificates for iOS/Android

## 📝 Coding Standards

- **Components**: PascalCase naming
- **Functions/Variables**: camelCase naming
- **Clean Code**: Modular, reusable components
- **Comments**: Clear documentation for complex logic
- **File Organization**: Logical grouping by feature

## 🎯 Next Steps

- [ ] Implement Login screen
- [ ] Create Onboarding flow
- [ ] Build Home screen with daily recommendations
- [ ] Develop Meditation courses catalog
- [ ] Implement Audio player with controls
- [ ] Add Sleep section with stories and sounds
- [ ] Create Profile and Stats screens
- [ ] Integrate Firebase authentication
- [ ] Set up OneSignal notifications
- [ ] Add offline download functionality
- [ ] Implement theme switching
- [ ] Add comprehensive testing

## 📄 License

This project is part of the TechloSet Bootcamp program.

## 🤝 Contributing

This is a learning project. Contributions and suggestions are welcome!

## 📞 Support

For questions or issues, please refer to the PRD document or contact the development team.

---

**#TechloSet #BootcampWise**
