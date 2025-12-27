import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    SignUp: undefined;
    SignUpForm: undefined;
    Login: undefined;
    Welcome: { userName?: string };
    ChooseTopic: undefined;
    Reminders: { selectedTopic?: string; topicId?: number };
    Home: { userName?: string };
    CourseDetails: { courseId?: string; title?: string; session?: any };
    MeditateV2: { userName?: string };
    MeditationSessions: {
        activeTab?: string;
        userName?: string;
        category?: {
            title: string;
            subtitle: string;
            color: string;
        };
    };
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
    Sleep: { userName?: string };
    PlayOption: {
        content: {
            title: string;
            duration: string;
            type: string;
            description: string;
            favoriteCount: string;
            listeningCount: string;
            image: any;
        };
    };
    SleepMusic: { category?: string; userName?: string };
    Settings: undefined;
    Profile: undefined;
    EditProfile: undefined;
    Preferences: undefined;
    NotificationSettings: undefined;
    Music: undefined;
    MusicPlayer: { song: { id: number; title: string; category: string; image: any; audioUrl: string; duration: string; artist: string } };
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

export type ScreenProps<T extends keyof RootStackParamList> = {
    navigation: NavigationProp<T>;
    route: RoutePropType<T>;
};

export interface User {
    uid: string;
    email: string;
    name?: string;
}

export interface UserProfile {
    uid?: string;
    name: string;
    email?: string | null;
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

export interface BottomMenuProps {
    navigation: any;
    activeTab: string;
    userName?: string;
    backgroundColor?: string;
}

export interface ScreenDimensions {
    width: number;
    height: number;
}

export interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
}
