import React from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { wp, hp, fs, spacing } from '../utils/responsive';

const BottomMenu = ({ navigation, activeTab, userName = 'User', backgroundColor }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    // Calculate accurate padding
    const paddingBottom = insets.bottom > 0 ? insets.bottom + hp(2) : hp(24); // Increased fallback padding for better visibility on small screens

    return (
        <View style={[
            styles.bottomNav,
            {
                backgroundColor: backgroundColor || theme.colors.navBackground,
                borderTopColor: backgroundColor ? backgroundColor : theme.colors.navBorder,
                borderTopWidth: backgroundColor ? 0 : 1,
                paddingBottom: paddingBottom,
                paddingTop: hp(12),
            }
        ]}>
            <View style={styles.navItemWrapper}>
                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'Home' && styles.navItemActive]}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Image
                        source={require('../../assets/images/menu_home.png')}
                        style={[styles.navIcon, { tintColor: activeTab === 'Home' ? '#FFFFFF' : theme.colors.navText }]}
                        resizeMode="contain"
                    />
                    <Text style={[styles.navText, { color: activeTab === 'Home' ? '#FFFFFF' : theme.colors.navText }]}>Home</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.navItemWrapper}>
                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'Sleep' && styles.navItemActive]}
                    activeOpacity={0.7}
                    onPress={async () => {
                        try {
                            const hasSeen = await AsyncStorage.getItem('hasSeenSleepStart');
                            if (hasSeen === 'true') {
                                navigation.navigate('Sleep');
                            } else {
                                navigation.navigate('SleepStart');
                            }
                        } catch (e) {
                            navigation.navigate('SleepStart');
                        }
                    }}
                >
                    <Image
                        source={require('../../assets/images/menu_sleep.png')}
                        style={[styles.navIcon, { tintColor: activeTab === 'Sleep' ? '#FFFFFF' : theme.colors.navText }]}
                        resizeMode="contain"
                    />
                    <Text style={[styles.navText, { color: activeTab === 'Sleep' ? '#FFFFFF' : theme.colors.navText }]}>Sleep</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.navItemWrapper}>
                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'Meditate' && styles.navItemActive]}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('MeditateV2')}
                >
                    <Image
                        source={require('../../assets/images/menu_meditate.png')}
                        style={[styles.navIcon, { tintColor: activeTab === 'Meditate' ? '#FFFFFF' : theme.colors.navText }]}
                        resizeMode="contain"
                    />
                    <Text style={[styles.navText, { color: activeTab === 'Meditate' ? '#FFFFFF' : theme.colors.navText }]}>Meditate</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.navItemWrapper}>
                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'Music' && styles.navItemActive]}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('MeditationSessions', { activeTab: 'Music' })}
                >
                    <Image
                        source={require('../../assets/images/menu_music.png')}
                        style={[styles.navIcon, { tintColor: activeTab === 'Music' ? '#FFFFFF' : theme.colors.navText }]}
                        resizeMode="contain"
                    />
                    <Text style={[styles.navText, { color: activeTab === 'Music' ? '#FFFFFF' : theme.colors.navText }]}>Music</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.navItemWrapper}>
                <TouchableOpacity
                    style={[styles.navItem, activeTab === 'Profile' && styles.navItemActive]}
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Image
                        source={require('../../assets/images/menu_profile.png')}
                        style={[styles.navIcon, { tintColor: activeTab === 'Profile' ? '#FFFFFF' : theme.colors.navText }]}
                        resizeMode="contain"
                    />
                    <Text style={[styles.navText, { color: activeTab === 'Profile' ? '#FFFFFF' : theme.colors.navText }]}>{userName}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        paddingHorizontal: spacing(10),
        // paddingVertical removed in favor of dynamic padding
        borderTopWidth: 1,
        elevation: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: hp(-2) },
        shadowOpacity: 0.1,
        shadowRadius: wp(4),
        zIndex: 1000,
    },
    navItemWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navItem: {
        width: wp(70),
        height: wp(70),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp(35),
    },
    navItemActive: {
        backgroundColor: '#8E97FD', // Active background color
    },
    navIcon: {
        width: wp(24),
        height: hp(24),
    },
    navText: {
        fontSize: fs(10),
        fontWeight: '500',
        marginTop: hp(4),
    },
});

export default BottomMenu;
