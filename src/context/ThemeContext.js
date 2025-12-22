import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const lightTheme = {
    mode: 'light',
    colors: {
        background: '#FFFFFF',
        surface: '#F5F5F5',
        card: '#FFFFFF',
        primary: '#8E97FD',
        secondary: '#FFCF86',
        accent: '#6CB28E',
        text: '#3F414E',
        textSecondary: '#A1A4B2',
        border: '#F0F0F0',
        error: '#FF6B6B',
        success: '#6CB28E',
        // Specific component colors
        navBackground: '#FFFFFF',
        navBorder: '#F0F0F0',
        navText: '#A1A4B2',
        navTextActive: '#8E97FD',
        cardBackground: '#FFFFFF',
        inputBackground: '#F2F3F7',
        inputBorder: '#E8ECF4',
        statusBar: 'dark-content',
    }
};

export const darkTheme = {
    mode: 'dark',
    colors: {
        background: '#03174C',
        surface: '#1E3A8A',
        card: '#1E3A8A',
        primary: '#8E97FD',
        secondary: '#FFCF86',
        accent: '#6CB28E',
        text: '#FFFFFF',
        textSecondary: '#B0B3C1',
        border: '#2A4A9A',
        error: '#FF6B6B',
        success: '#6CB28E',
        // Specific component colors
        navBackground: '#1E3A8A',
        navBorder: '#2A4A9A',
        navText: '#B0B3C1',
        navTextActive: '#8E97FD',
        cardBackground: '#1E3A8A',
        inputBackground: '#2A4A9A',
        inputBorder: '#3A5AAA',
        statusBar: 'light-content',
    }
};

const THEME_STORAGE_KEY = '@meditation_app_theme';

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load theme preference from storage
    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme !== null) {
                setIsDarkMode(savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleTheme = async () => {
        try {
            const newMode = !isDarkMode;
            setIsDarkMode(newMode);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    const value = {
        theme,
        isDarkMode,
        toggleTheme,
        isLoading,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export default ThemeContext;
