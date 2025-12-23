import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, Auth } from 'firebase/auth';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseConfig } from '../types';

// Your web app's Firebase configuration
const firebaseConfig: FirebaseConfig = {
    apiKey: 'AIzaSyA95k7vqo-JpJVvcixpa-KiYBq5pMgK6JM',
    authDomain: 'silent-moon-meditation1.firebaseapp.com',
    projectId: 'silent-moon-meditation1',
    storageBucket: 'silent-moon-meditation1.firebasestorage.app',
    messagingSenderId: '147603561872',
    appId: '1:147603561872:web:c81509cd609931a9d5e715',
    measurementId: 'G-928NPLQD2V',
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth with persistence
export const auth: Auth = initializeAuth(app, {
    persistence: (FirebaseAuth as any).getReactNativePersistence(ReactNativeAsyncStorage),
});

// Initialize Cloud Firestore and get a reference to the service
export const db: Firestore = getFirestore(app);

export default app;
