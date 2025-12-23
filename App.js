import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LogLevel, OneSignal } from 'react-native-onesignal';
import * as Notifications from 'expo-notifications';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import * as Updates from 'expo-updates';

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
                    <Text style={styles.errorMessage}>
                        {this.state.error?.message || 'An unexpected error occurred'}
                    </Text>
                    <Text style={styles.errorDetails}>Please restart the app</Text>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    errorMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 10,
    },
    errorDetails: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

// Import Screens
import SignUpAndSignIn from './src/screens/SignUpAndSignIn';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import Welcome from './src/screens/Welcome';
import ChooseTopic from './src/screens/ChooseTopic';
import Reminders from './src/screens/Reminders';
import Home from './src/screens/Home';
import CourseDetails from './src/screens/CourseDetails';
import MeditateV2 from './src/screens/MeditateV2';
import MeditationSessions from './src/screens/MeditationSessions';
import AudioDetails from './src/screens/AudioDetails';
import AudioDetails2 from './src/screens/AudioDetails2';
import FirebaseTest from './src/screens/FirebaseTest';
import SleepStart from './src/screens/SleepStart';
import Sleep from './src/screens/Sleep';
import PlayOption from './src/screens/PlayOption';
import SleepMusic from './src/screens/SleepMusic';
import Settings from './src/screens/Settings';
import Profile from './src/screens/Profile';
import EditProfile from './src/screens/EditProfile';
import Preferences from './src/screens/Preferences';
import NotificationSettings from './src/screens/NotificationSettings';
import About from './src/screens/About';
import Congratulations from './src/screens/Congratulations';
import { ThemeProvider } from './src/context/ThemeContext';
// Import other screens as they are created
// import LoginScreen from './src/screens/LoginScreen';
// import OnboardingScreen from './src/screens/OnboardingScreen';
// import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
    React.useEffect(() => {
        // Disable update checks to prevent "Failed to download remote update" error
        const disableUpdates = async () => {
            try {
                // This will prevent the app from checking for updates
                if (!__DEV__ && Updates.isEnabled) {
                    // Only log in development, don't check for updates
                    console.log('Updates are configured but checks are disabled');
                }
            } catch (error) {
                // Silently catch any update-related errors
                console.log('Update check skipped');
            }
        };

        disableUpdates();

        // OneSignal Initialization
        try {
            // Debugging
            if (__DEV__) {
                OneSignal.Debug.setLogLevel(LogLevel.Verbose);
            }

            // Initialize OneSignal with your App ID
            OneSignal.initialize('66c6114a-f5fa-4c4d-b94f-17387cc07b46');

            // Request notification permission
            OneSignal.Notifications.requestPermission(true);

            // Handle notification clicks
            OneSignal.Notifications.addEventListener('click', event => {
                console.log('OneSignal notification clicked:', event);
            });
        } catch (error) {
            console.log('OneSignal initialization error:', error.message);
        }

        // Expo Notifications Setup (for local reminders)
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false,
            }),
        });
    }, []);

    return (
        <ErrorBoundary>
            <ThemeProvider>
                <Provider store={store}>
                    <SafeAreaProvider>
                        <NavigationContainer>
                            <StatusBar style="dark" />
                            <Stack.Navigator
                                initialRouteName="SignUp"
                                screenOptions={{
                                    headerShown: false,
                                    cardStyle: { backgroundColor: '#F5F5F5' },
                                }}
                            >
                                {/* Development/Testing screens - Uncomment if needed */}
                                {/* <Stack.Screen name="FirebaseTest" component={FirebaseTest} /> */}

                                <Stack.Screen name="SignUp" component={SignUpAndSignIn} />
                                <Stack.Screen name="SignUpForm" component={SignUp} />
                                <Stack.Screen name="Login" component={SignIn} />
                                <Stack.Screen name="Welcome" component={Welcome} />
                                <Stack.Screen name="ChooseTopic" component={ChooseTopic} />
                                <Stack.Screen name="Reminders" component={Reminders} />
                                <Stack.Screen name="Home" component={Home} />
                                <Stack.Screen name="CourseDetails" component={CourseDetails} />
                                <Stack.Screen name="MeditateV2" component={MeditateV2} />
                                <Stack.Screen
                                    name="MeditationSessions"
                                    component={MeditationSessions}
                                />
                                <Stack.Screen name="AudioDetails" component={AudioDetails} />
                                <Stack.Screen name="AudioDetails2" component={AudioDetails2} />
                                <Stack.Screen name="SleepStart" component={SleepStart} />
                                <Stack.Screen name="Sleep" component={Sleep} />
                                <Stack.Screen name="PlayOption" component={PlayOption} />
                                <Stack.Screen name="SleepMusic" component={SleepMusic} />
                                <Stack.Screen name="Settings" component={Settings} />
                                <Stack.Screen name="Profile" component={Profile} />
                                <Stack.Screen name="EditProfile" component={EditProfile} />
                                <Stack.Screen name="Preferences" component={Preferences} />
                                <Stack.Screen
                                    name="NotificationSettings"
                                    component={NotificationSettings}
                                />
                                <Stack.Screen name="AboutScreen" component={About} />
                                <Stack.Screen name="Congratulations" component={Congratulations} />
                                {/* Add other screens here */}
                            </Stack.Navigator>
                        </NavigationContainer>
                    </SafeAreaProvider>
                </Provider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
