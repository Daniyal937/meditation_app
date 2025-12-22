import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { wp, hp, fs } from '../utils/responsive';

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Email validation
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleFacebookLogin = () => {
        Alert.alert('Facebook Login', 'Facebook authentication will be implemented with Firebase');
    };

    const handleGoogleLogin = () => {
        Alert.alert('Google Login', 'Google authentication will be implemented with Firebase');
    };

    const handleSignUp = async () => {


        // Validation
        if (!name.trim()) {

            Alert.alert('Error', 'Please enter your name');
            return;
        }
        if (!email.trim()) {

            Alert.alert('Error', 'Please enter your email');
            return;
        }
        if (!isValidEmail(email)) {

            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }
        if (!password.trim()) {

            Alert.alert('Error', 'Please enter your password');
            return;
        }
        if (password.length < 6) {

            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }
        if (!agreedToPrivacy) {

            Alert.alert('Error', 'Please agree to the Privacy Policy');
            return;
        }

        setIsLoading(true);

        try {
            // Firebase Authentication
            const { signUpWithEmail } = require('../services/authService');
            const result = await signUpWithEmail(email, password, name);

            setIsLoading(false);

            if (result.success) {
                // Show success message and navigate to Login screen
                Alert.alert(
                    'Success!',
                    'Account created successfully. Please login to continue.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Login')
                        }
                    ]
                );
            } else {
                // Show error message from Firebase
                Alert.alert('Signup Failed', result.error);
            }
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
            console.error('Signup error:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

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
                        <Text style={styles.title}>Create your account</Text>
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
                                <Text style={styles.facebookButtonText}>CONTINUE WITH FACEBOOK</Text>
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
                    <TouchableOpacity
                        style={styles.dividerContainer}
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.dividerText}>OR LOG IN WITH EMAIL</Text>
                    </TouchableOpacity>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        {/* Name Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Username"
                                placeholderTextColor="#A1A4B2"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                            {name.trim().length > 0 && (
                                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
                            )}
                        </View>

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
                            {isValidEmail(email) && (
                                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.checkIcon} />
                            )}
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

                        {/* Privacy Policy Checkbox */}
                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => {
                                setAgreedToPrivacy(!agreedToPrivacy);
                            }}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.checkboxText}>I have read the Privacy Policy</Text>
                            <View style={[styles.checkbox, agreedToPrivacy && styles.checkboxChecked]}>
                                {agreedToPrivacy && (
                                    <Ionicons name="checkmark" size={16} color="#8E97FD" />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Get Started Button */}
                    <TouchableOpacity
                        style={styles.getStartedButton}
                        onPress={handleSignUp}
                        activeOpacity={0.8}
                        disabled={isLoading}
                    >
                        <LinearGradient
                            colors={['#8E97FD', '#A5AFFF']}
                            style={styles.buttonGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.getStartedButtonText}>
                                {isLoading ? 'CREATING ACCOUNT...' : 'GET STARTED'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Bottom Divider */}
                    <View style={styles.bottomDivider} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    checkIcon: {
        marginLeft: wp(8),
    },
    eyeIcon: {
        padding: wp(4),
        marginLeft: wp(8),
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(5),
    },
    checkboxText: {
        fontSize: fs(13),
        color: '#A1A4B2',
        fontWeight: '400',
    },
    checkbox: {
        width: wp(22),
        height: wp(22),
        borderRadius: wp(4),
        borderWidth: 1.5,
        borderColor: '#A1A4B2',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    checkboxChecked: {
        borderColor: '#8E97FD',
        backgroundColor: '#F2F3F7',
    },
    getStartedButton: {
        borderRadius: wp(38),
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#8E97FD',
        shadowOffset: { width: 0, height: hp(4) },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        marginBottom: hp(25),
    },
    buttonGradient: {
        paddingVertical: hp(18),
        alignItems: 'center',
        justifyContent: 'center',
    },
    getStartedButtonText: {
        fontSize: fs(14),
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 1.2,
    },
    bottomDivider: {
        height: 1,
        backgroundColor: '#E8E8E8',
        marginHorizontal: wp(40),
    },
});

export default SignUp;
