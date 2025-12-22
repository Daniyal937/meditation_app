import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} name - User's full name
 * @returns {Promise<Object>} User data
 */
export const signUpWithEmail = async (email, password, name) => {
    try {

        const userCredential = await Promise.race([
            createUserWithEmailAndPassword(auth, email, password),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Signup timeout after 10 seconds')), 10000)
            )
        ]);

        const user = userCredential.user;


        // Create user profile in Firestore

        await createUserProfile(user.uid, {
            name,
            email,
        });


        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                name,
            },
        };
    } catch (error) {
        console.error('❌ Signup error:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        return {
            success: false,
            error: getErrorMessage(error.code) || error.message,
        };
    }
};

/**
 * Sign in an existing user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} User data
 */
export const signInWithEmail = async (email, password) => {
    try {

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        // Get user profile from Firestore

        const userProfile = await getUserProfile(user.uid);


        // Update last login

        await updateUserProfile(user.uid, {
            lastLogin: new Date().toISOString(),
        });


        return {
            success: true,
            user: {
                uid: user.uid,
                email: user.email,
                ...userProfile,
            },
        };
    } catch (error) {
        console.error('❌ Sign-in error:', error.code, error.message);
        return {
            success: false,
            error: getErrorMessage(error.code),
        };
    }
};

/**
 * Sign out the current user
 * @returns {Promise<Object>} Success status
 */
export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: 'Failed to sign out',
        };
    }
};

/**
 * Get the current authenticated user
 * @returns {Object|null} Current user or null
 */
export const getCurrentUser = () => {
    return auth.currentUser;
};

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

/**
 * Create user profile in Firestore
 * @param {string} userId - User's UID
 * @param {Object} userData - User data to store
 */
export const createUserProfile = async (userId, userData) => {
    try {

        const userRef = doc(db, 'users', userId);

        // Use ISO string dates instead of serverTimestamp for web compatibility
        const profileData = {
            name: userData.name,
            email: userData.email,
            hasSeenWelcome: false,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            profile: {
                preferences: {},
                stats: {
                    totalMinutes: 0,
                    streakDays: 0,
                    coursesCompleted: 0,
                },
            },
        };

        await setDoc(userRef, profileData);


    } catch (error) {
        console.error('❌ Error creating user profile:', error.code, error.message);
        throw error;
    }
};

/**
 * Get user profile from Firestore
 * @param {string} userId - User's UID
 * @returns {Promise<Object>} User profile data
 */
export const getUserProfile = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
};

/**
 * Update user profile in Firestore
 * @param {string} userId - User's UID
 * @param {Object} updates - Data to update
 */
export const updateUserProfile = async (userId, updates) => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, updates, { merge: true });
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

/**
 * Convert Firebase error codes to user-friendly messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
const getErrorMessage = (errorCode) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please login instead.';
        case 'auth/weak-password':
            return 'Password is too weak. Please use at least 6 characters.';
        case 'auth/invalid-email':
            return 'Invalid email address. Please check and try again.';
        case 'auth/user-not-found':
            return 'No account found with this email. Please sign up first.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        default:
            return 'An error occurred. Please try again.';
    }
};

/**
 * Send password reset email
 * @param {string} email - User's email
 * @returns {Promise<Object>} Success status
 */
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    } catch (error) {
        console.error('Password reset error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};
