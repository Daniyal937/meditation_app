import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UserState, UserProfile, UserPreferences, UserStats, DownloadItem } from '../../types';

const initialState: UserState = {
    profile: null,
    preferences: {
        theme: 'light',
        language: 'en',
        reminderTime: null,
        notificationsEnabled: true,
    },
    stats: {
        totalMinutes: 0,
        streakDays: 0,
        dailyStreak: 0,
        coursesCompleted: 0,
    },
    favorites: [],
    downloads: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserProfile: (state, action: PayloadAction<UserProfile>) => {
            state.profile = action.payload;
        },
        updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        updateStats: (state, action: PayloadAction<Partial<UserStats>>) => {
            state.stats = { ...state.stats, ...action.payload };
        },
        addFavorite: (state, action: PayloadAction<string>) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload);
            }
        },
        removeFavorite: (state, action: PayloadAction<string>) => {
            state.favorites = state.favorites.filter((id: string) => id !== action.payload);
        },
        addDownload: (state, action: PayloadAction<DownloadItem>) => {
            if (!state.downloads.find((d: DownloadItem) => d.id === action.payload.id)) {
                state.downloads.push(action.payload);
            }
        },
        removeDownload: (state, action: PayloadAction<string>) => {
            state.downloads = state.downloads.filter((d: DownloadItem) => d.id !== action.payload);
        },
        clearUserData: (state) => {
            return initialState;
        },
    },
});

export const {
    setUserProfile,
    updatePreferences,
    updateStats,
    addFavorite,
    removeFavorite,
    addDownload,
    removeDownload,
    clearUserData,
} = userSlice.actions;

export default userSlice.reducer;
