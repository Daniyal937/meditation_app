import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { wp, hp, fs } from '../utils/responsive';

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const insets = useSafeAreaInsets();

    const handleFacebookLogin = () => {
        Alert.alert('Facebook Login', 'Facebook authentication will be implemented with Firebase');
    };

    const handleGoogleLogin = () => {
        Alert.alert('Google Login', 'Google authentication will be implemented with Firebase');
    };

    const handleForgotPassword = async () => {
        if (!email.trim()) {
            Alert.alert('Forgot Password', 'Please enter your email address first.');
            return;
        }

        setIsLoading(true);
        try {
            const { resetPassword } = require('../services/authService');
            const result = await resetPassword(email);

            if (result.success) {
                Alert.alert('Reset Password', 'Check your email for a password reset link.');
            } else {
                Alert.alert('Error', result.error);
            }
        } catch (error) {
            console.error('Reset password error:', error);
            Alert.alert('Error', 'Failed to send reset email.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignUp = () => {
        navigation.navigate('SignUpForm');
    };

    const handleLogin = async () => {
        // Validation
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter your password');
            return;
        }

        setIsLoading(true);

        try {
            // Firebase Authentication
            const { signInWithEmail } = require('../services/authService');
            const result = await signInWithEmail(email, password);

            setIsLoading(false);

            if (result.success) {
                // Navigate based on whether user has seen welcome screen
                if (result.user.hasSeenWelcome) {
                    navigation.replace('Home');
                } else {
                    const userName = result.user.name || 'User';

                    navigation.navigate('Welcome', { userName });
                }
            } else {
                console.error('❌ Login failed:', result.error);
                // Show error message from Firebase
                Alert.alert('Login Failed', result.error);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('❌ Login exception:', error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            console.error('Login error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../../assets/images/login_bg.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            />
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

            <View style={[styles.safeArea, { paddingTop: insets.top }]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => navigation.goBack()}
                                style={styles.backButton}
                            >
                                <Ionicons name="arrow-back" size={24} color="#3F414E" />
                            </TouchableOpacity>
                        </View>

                        {/* Title */}
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Welcome Back!</Text>
                        </View>

                        {/* Social Login Buttons */}
                        <View style={styles.socialButtonsContainer}>
                            {/* Facebook Button */}
                            <TouchableOpacity
                                style={styles.facebookButton}
                                onPress={handleFacebookLogin}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#8E97FD', '#A5AFFF']}
                                    style={styles.facebookGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <FontAwesome name="facebook-f" size={20} color="#FFFFFF" />
                                    <Text style={styles.facebookButtonText}>
                                        CONTINUE WITH FACEBOOK
                                    </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Google Button */}
                            <TouchableOpacity
                                style={styles.googleButton}
                                onPress={handleGoogleLogin}
                                activeOpacity={0.8}
                            >
                                <Image
                                    source={require('../../assets/images/google-logo.png')}
                                    style={styles.googleLogo}
                                />
                                <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Divider */}
                        <View style={styles.dividerContainer}>
                            <Text style={styles.dividerText}>OR LOG IN WITH EMAIL</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            {/* Email Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email address"
                                    placeholderTextColor="#A1A4B2"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            {/* Password Input */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    placeholderTextColor="#A1A4B2"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeIcon}
                                >
                                    <Image
                                        source={require('../../assets/images/eye_icon.png')}
                                        style={{ width: 20, height: 20, tintColor: '#A1A4B2' }}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Log In Button */}
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={['#8E97FD', '#A5AFFF']}
                                style={styles.buttonGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.loginButtonText}>
                                    {isLoading ? 'LOGGING IN...' : 'LOG IN'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Forgot Password Link */}
                        <TouchableOpacity
                            onPress={handleForgotPassword}
                            style={styles.forgotPasswordContainer}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Sign Up Link */}
                        <TouchableOpacity
                            onPress={handleSignUp}
                            style={styles.signUpContainer}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.signUpText}>
                                ALREADY HAVE AN ACCOUNT?{' '}
                                <Text style={styles.signUpLink}>SIGN UP</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: hp(428),
        zIndex: -1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: wp(20),
        paddingBottom: hp(30),
    },
    header: {
        paddingTop: hp(10),
        paddingBottom: hp(10),
    },
    backButton: {
        width: wp(44),
        height: wp(44),
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    titleContainer: {
        marginBottom: hp(30),
        alignItems: 'center',
    },
    title: {
        fontSize: fs(24),
        fontWeight: '700',
        color: '#3F414E',
        textAlign: 'center',
    },
    socialButtonsContainer: {
        marginBottom: hp(25),
    },
    facebookButton: {
        borderRadius: wp(38),
        overflow: 'hidden',
        marginBottom: hp(15),
        elevation: 2,
        shadowColor: '#8E97FD',
        shadowOffset: { width: 0, height: hp(2) },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    facebookGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(16),
        gap: wp(12),
    },
    facebookButtonText: {
        fontSize: fs(13),
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: wp(38),
        paddingVertical: hp(16),
        borderWidth: 1,
        borderColor: '#E8E8E8',
        gap: wp(12),
    },
    googleButtonText: {
        fontSize: fs(13),
        fontWeight: '600',
        color: '#3F414E',
        letterSpacing: 0.5,
    },
    googleLogo: {
        width: wp(20),
        height: wp(20),
    },
    dividerContainer: {
        alignItems: 'center',
        marginVertical: hp(25),
    },
    dividerText: {
        fontSize: fs(12),
        fontWeight: '500',
        color: '#A1A4B2',
        letterSpacing: 0.5,
    },
    formContainer: {
        marginBottom: hp(25),
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F3F7',
        borderRadius: wp(15),
        paddingHorizontal: wp(20),
        height: hp(56),
        marginBottom: hp(15),
    },
    input: {
        flex: 1,
        fontSize: fs(15),
        color: '#3F414E',
        fontWeight: '400',
    },
    eyeIcon: {
        padding: wp(4),
        marginLeft: wp(8),
    },
    loginButton: {
        borderRadius: wp(38),
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#8E97FD',
        shadowOffset: { width: 0, height: hp(4) },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginBottom: hp(20),
    },
    buttonGradient: {
        paddingVertical: hp(18),
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        fontSize: fs(14),
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 1.2,
    },
    forgotPasswordContainer: {
        alignItems: 'center',
        marginBottom: hp(30),
    },
    forgotPasswordText: {
        fontSize: fs(14),
        color: '#3F414E',
        fontWeight: '400',
    },

    signUpContainer: {
        alignItems: 'center',
        paddingVertical: hp(10),
    },
    signUpText: {
        fontSize: fs(13),
        fontWeight: '400',
        color: '#A1A4B2',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    signUpLink: {
        color: '#8E97FD',
        fontWeight: '600',
    },
});

export default SignIn;
