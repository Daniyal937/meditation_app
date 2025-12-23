import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, fs, spacing } from '../utils/responsive'; // Import responsive utilities

const Welcome = ({ navigation, route }) => {
    // Get user name from route params or use default
    const userName = route?.params?.userName || 'Afsar';

    const handleGetStarted = async () => {
        try {
            // Update user profile to indicate welcome screen has been seen
            const { auth } = require('../config/firebaseConfig');
            const { updateUserProfile } = require('../services/authService');

            if (auth.currentUser) {
                await updateUserProfile(auth.currentUser.uid, { hasSeenWelcome: true });
            }
        } catch (error) {
            console.error('Error updating welcome status:', error);
        }

        // Navigate to Choose Topic screen
        navigation.navigate('ChooseTopic');
    };

    return (
        <LinearGradient
            colors={['#919CFF', '#919CFF']}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <StatusBar barStyle="light-content" backgroundColor="#919CFF" />

                {/* Logo Section */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoWrapper}>
                        <Text style={styles.logoText}>Silent</Text>
                        <Image
                            source={require('../../assets/images/silent_logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.logoText}>Moon</Text>
                    </View>
                </View>

                {/* Welcome Text Section */}
                <View style={styles.welcomeContainer}>
                    <Text style={styles.welcomeHeading}>Hi {userName}, Welcome</Text>
                    <Text style={styles.welcomeSubheading}>to Silent Moon</Text>
                </View>

                {/* Illustration Section with Decorations */}
                <View style={styles.illustrationContainer}>
                    {/* Bird - Top Left */}
                    <Image
                        source={require('../../assets/images/bird.png')}
                        style={styles.bird}
                        resizeMode="contain"
                    />

                    {/* Large Cloud - Right Side */}
                    <Image
                        source={require('../../assets/images/cloud-large.png')}
                        style={styles.cloudLarge}
                        resizeMode="contain"
                    />

                    {/* Small Cloud - Bottom Left */}
                    <Image
                        source={require('../../assets/images/cloud-small.png')}
                        style={styles.cloudSmall}
                        resizeMode="contain"
                    />

                    {/* Meditation Illustration */}
                    <Image
                        source={require('../../assets/images/welcome_v3.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                {/* Get Started Button */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={handleGetStarted}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.getStartedButtonText}>GET STARTED</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: hp(60),
        marginBottom: hp(60),
        paddingHorizontal: spacing(20),
    },
    logoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing(8),
    },
    logoText: {
        fontSize: fs(16),
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    logoImage: {
        width: wp(30),
        height: wp(30),
    },
    welcomeContainer: {
        alignItems: 'center',
        marginBottom: hp(10),
        paddingHorizontal: spacing(20),
    },
    welcomeHeading: {
        fontSize: fs(28),
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: hp(4),
    },
    welcomeSubheading: {
        fontSize: fs(28),
        fontWeight: '300',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: hp(16),
    },
    welcomeDescription: {
        fontSize: fs(15),
        fontWeight: '300',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: fs(22),
    },
    illustrationContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 0,
        position: 'relative',
        marginBottom: hp(20),
    },
    bird: {
        position: 'absolute',
        top: '10%',
        left: spacing(20),
        width: wp(45),
        height: hp(25),
        opacity: 0.8,
        zIndex: 1,
    },
    cloudLarge: {
        position: 'absolute',
        top: '35%',
        right: -spacing(10),
        width: wp(120),
        height: hp(80),
        opacity: 0.9,
        zIndex: 1,
    },
    cloudSmall: {
        position: 'absolute',
        top: '58%',
        left: spacing(10),
        width: wp(65),
        height: hp(40),
        opacity: 0.85,
        zIndex: 1,
    },
    illustration: {
        width: '400%',
        height: '100%',
        zIndex: 2,
    },
    buttonContainer: {
        paddingBottom: hp(40),
        paddingHorizontal: spacing(20),
    },
    getStartedButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: wp(38),
        paddingVertical: hp(18),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: hp(4) },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        marginBottom: hp(15),
    },
    getStartedButtonText: {
        fontSize: fs(14),
        fontWeight: '600',
        color: '#3F414E',
        letterSpacing: 1.2,
    },
});

export default Welcome;
