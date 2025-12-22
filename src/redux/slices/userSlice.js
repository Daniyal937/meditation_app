import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: null,
    preferences: {
        theme: 'light',
        language: 'en',
        reminderTime: null,
        notificationsEnabled: true,
    },
    stats: {
        totalMinutes: 0,
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
        setUserProfile: (state, action) => {
            state.profile = action.payload;
        },
        updatePreferences: (state, action) => {
            state.preferences = { ...state.preferences, ...action.payload };
        },
        updateStats: (state, action) => {
            state.stats = { ...state.stats, ...action.payload };
        },
        addFavorite: (state, action) => {
            if (!state.favorites.includes(action.payload)) {
                state.favorites.push(action.payload);
            }
        },
        removeFavorite: (state, action) => {
            state.favorites = state.favorites.filter(id => id !== action.payload);
        },
        addDownload: (state, action) => {
            if (!state.downloads.find(d => d.id === action.payload.id)) {
                state.downloads.push(action.payload);
            }
        },
        removeDownload: (state, action) => {
            state.downloads = state.downloads.filter(d => d.id !== action.payload);
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
