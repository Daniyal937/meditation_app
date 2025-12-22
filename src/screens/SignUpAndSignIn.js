import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, fs, spacing } from '../utils/responsive';

const SignUpAndSignIn = ({ navigation }) => {
  const handleSignUp = () => {
    // Navigate to sign up form or handle sign up logic
    navigation.navigate('SignUpForm');
  };

  const handleLogIn = () => {
    // Navigate to login screen
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/silent-moon-logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      {/* Illustration Section */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require('../../assets/images/signup-illustration.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.heading}>We are what we do</Text>
        <Text style={styles.subtitle}>
          Thousand of people are using silent moon{'\n'}for smalls meditation
        </Text>
      </View>

      {/* Button Section */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSignUp}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8E97FD', '#A5AFFF']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.signUpButtonText}>SIGN UP</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
        </View>

        {/* Login Link */}
        <TouchableOpacity onPress={handleLogIn} activeOpacity={0.7}>
          <Text style={styles.loginText}>
            ALREADY HAVE AN ACCOUNT?{' '}
            <Text style={styles.loginLink}>LOG IN</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: hp(30),
    marginBottom: hp(20),
  },
  logoImage: {
    width: wp(200),
    height: hp(40),
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing(40),
    marginTop: hp(-20),
  },
  illustration: {
    width: '100%',
    height: '100%',
    maxHeight: hp(300),
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing(40),
    marginBottom: hp(30),
  },
  heading: {
    fontSize: fs(28),
    fontWeight: '700',
    color: '#3F414E',
    marginBottom: hp(12),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fs(15),
    fontWeight: '300',
    color: '#A1A4B2',
    textAlign: 'center',
    lineHeight: fs(22),
  },
  buttonContainer: {
    paddingHorizontal: spacing(20),
    paddingBottom: hp(40),
  },
  signUpButton: {
    borderRadius: wp(38),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#8E97FD',
    shadowOffset: { width: 0, height: hp(4) },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    paddingVertical: hp(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpButtonText: {
    fontSize: fs(14),
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  dividerContainer: {
    alignItems: 'center',
    marginVertical: hp(24),
  },
  divider: {
    width: wp(80),
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  loginText: {
    fontSize: fs(13),
    fontWeight: '400',
    color: '#A1A4B2',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loginLink: {
    color: '#8E97FD',
    fontWeight: '600',
  },
});

export default SignUpAndSignIn;
