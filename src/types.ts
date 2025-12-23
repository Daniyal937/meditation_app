// ============================================
// Navigation Types
// ============================================

import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    SignUp: undefined;
    SignUpForm: undefined;
    Login: undefined;
    Welcome: undefined;
    ChooseTopic: undefined;
    Reminders: { selectedTopic?: string; topicId?: number };
    Home: undefined;
    CourseDetails: { courseId?: string; title?: string };
    MeditateV2: undefined;
    MeditationSessions: { activeTab?: string };
    AudioDetails: { sessionId?: string };
    AudioDetails2: {
        session?: any;
        audioId?: string;
        title?: string;
        duration?: string;
        image?: any;
        audioFile?: any;
    };
    SleepStart: undefined;
    Sleep: undefined;
    PlayOption: undefined;
    SleepMusic: { category?: string };
    Settings: undefined;
    Profile: undefined;
    EditProfile: undefined;
    Preferences: undefined;
    NotificationSettings: undefined;
    AboutScreen: undefined;
    Congratulations: undefined;
    FirebaseTest: undefined;
};

export type NavigationProp<T extends keyof RootStackParamList> = StackNavigationProp<
    RootStackParamList,
    T
>;

export type RoutePropType<T extends keyof RootStackParamList> = RouteProp<
    RootStackParamList,
    T
>;

// ============================================
// User & Authentication Types
// ============================================

export interface User {
    uid: string;
    email: string;
    name?: string;
}

export interface UserProfile {
    uid?: string;
    name: string;
    email: string;
    profileImage?: string | null;
    phoneNumber?: string;
    dateOfBirth?: string;
    streetAddress?: string;
    country?: string;
    hasSeenWelcome?: boolean;
    createdAt?: string;
    lastLogin?: string;
    profile?: {
        preferences?: Record<string, any>;
        stats?: UserStats;
    };
}

export interface UserStats {
    totalMinutes: number;
    streakDays: number;
    dailyStreak: number;
    coursesCompleted: number;
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
}

// ============================================
// Redux State Types
// ============================================

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface UserState {
    profile: UserProfile | null;
    preferences: UserPreferences;
    stats: UserStats;
    favorites: string[];
    downloads: DownloadItem[];
}

export interface UserPreferences {
    theme: 'light' | 'dark';
    language: string;
    reminderTime: string | null;
    notificationsEnabled: boolean;
}

export interface DownloadItem {
    id: string;
    [key: string]: any;
}

// ============================================
// Theme Types
// ============================================

export interface ThemeColors {
    background: string;
    surface: string;
    card: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    navBackground: string;
    navBorder: string;
    navText: string;
    navTextActive: string;
    cardBackground: string;
    inputBackground: string;
    inputBorder: string;
    statusBar: 'light-content' | 'dark-content';
}

export interface Theme {
    mode: 'light' | 'dark';
    colors: ThemeColors;
}

export interface ThemeContextValue {
    theme: Theme;
    isDarkMode: boolean;
    toggleTheme: () => Promise<void>;
    isLoading: boolean;
}

// ============================================
// Component Props Types
// ============================================

export interface BottomMenuProps {
    navigation: any;
    activeTab: string;
    userName?: string;
    backgroundColor?: string;
}

export interface ScreenProps<T extends keyof RootStackParamList = any> {
    navigation: NavigationProp<T>;
    route: RoutePropType<T>;
}

// ============================================
// Dimension Types
// ============================================

export interface ScreenDimensions {
    width: number;
    height: number;
}

// ============================================
// Firebase Types
// ============================================

export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}
