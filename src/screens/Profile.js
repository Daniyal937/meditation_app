import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image,
    Switch,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { useTheme } from '../context/ThemeContext';
import { auth } from '../config/firebaseConfig';
import { getUserProfile } from '../services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile as setUserProfileAction, clearUserData } from '../redux/slices/userSlice';
import BottomMenu from '../components/BottomMenu';
import { wp, hp, fs, spacing } from '../utils/responsive'; // Import responsive utilities

const Profile = ({ navigation }) => {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const dispatch = useDispatch();
    const userProfileFromRedux = useSelector(state => state.user.profile);

    // Use Redux state or local defaults
    const [userName, setUserName] = useState(userProfileFromRedux?.name || 'User');
    const [userEmail, setUserEmail] = useState(userProfileFromRedux?.email || '');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [profileImage, setProfileImage] = useState(null); // State for profile image

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    // Update email if invalid/missing
                    if (!userEmail) {
                        setUserEmail(currentUser.email);
                    }

                    if (userProfileFromRedux) {
                        setUserName(userProfileFromRedux.name);
                        // Update local email if Redux has it, otherwise keep currentUser.email
                        if (userProfileFromRedux.email) setUserEmail(userProfileFromRedux.email);
                        return; // Already have data
                    }

                    const userProfile = await getUserProfile(currentUser.uid);
                    if (userProfile && userProfile.name) {
                        setUserName(userProfile.name);
                        dispatch(setUserProfileAction({ ...userProfile, email: currentUser.email }));
                    } else {
                        const emailName = currentUser.email.split('@')[0];
                        const derivedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
                        setUserName(derivedName);
                        dispatch(setUserProfileAction({ name: derivedName, uid: currentUser.uid, email: currentUser.email }));
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [userProfileFromRedux]);

    const pickImage = async () => {
        // ... (unchanged)
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });



        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const menuItems = [
        {
            id: 'personal',
            title: 'Personal Info',
            icon: 'person-outline',
            onPress: () => navigation.navigate('EditProfile'),
        },
        {
            id: 'notification',
            title: 'Notification',
            icon: 'notifications-outline',
            onPress: () => navigation.navigate('NotificationSettings'),
        },
        {
            id: 'preferences',
            title: 'Preferences',
            icon: 'settings-outline',
            onPress: () => navigation.navigate('Preferences'),
        },
        {
            id: 'language',
            title: 'Language',
            icon: 'document-text-outline',
            value: 'English (US)',
            onPress: () => { }, // TODO: Implement Language selection
        },
    ];

    const handleLogout = () => {
        setShowLogoutModal(false);
        // Sign out from Firebase
        auth.signOut()
            .then(() => {
                dispatch(clearUserData()); // Clear global user state
                // Navigate to login screen
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignUp' }],
                });
            })
            .catch((error) => {
                console.error('Error signing out:', error);
            });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background} />

                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Profile</Text>
                    <View style={styles.menuButton}>
                        <Image
                            source={require('../../assets/images/menu_icon.png')}
                            style={styles.menuIcon}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{ paddingBottom: hp(100) }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* User Profile Card */}
                    <View style={[styles.profileCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
                        <View style={styles.profileHeader}>
                            <View style={styles.profileLeft}>
                                {/* Profile Picture */}
                                <TouchableOpacity
                                    style={[styles.profilePicture, { backgroundColor: theme.colors.primary }]}
                                    onPress={pickImage}
                                    activeOpacity={0.8}
                                >
                                    {profileImage ? (
                                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                                    ) : (
                                        <Text style={styles.profileInitial}>
                                            {userName.charAt(0).toUpperCase()}
                                        </Text>
                                    )}
                                </TouchableOpacity>

                                {/* User Info */}
                                <View style={styles.userInfo}>
                                    <Text style={[styles.userName, { color: theme.colors.text }]}>
                                        {userName}
                                    </Text>
                                    <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
                                        {userEmail}
                                    </Text>
                                </View>
                            </View>

                            {/* Edit Button */}
                            <TouchableOpacity
                                style={[styles.editButton, { backgroundColor: theme.colors.surface }]}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('EditProfile')}
                            >
                                <Ionicons name="pencil-outline" size={fs(18)} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Menu Items */}
                    <View style={styles.menuContainer}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.menuItem,
                                    {
                                        backgroundColor: theme.colors.card,
                                        borderColor: theme.colors.border,
                                        marginBottom: index === menuItems.length - 1 ? 0 : hp(12),
                                    }
                                ]}
                                onPress={item.onPress}
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuLeft}>
                                    <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.surface }]}>
                                        <Ionicons name={item.icon} size={fs(22)} color={theme.colors.text} />
                                    </View>
                                    <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                                        {item.title}
                                    </Text>
                                </View>
                                <View style={styles.menuRight}>
                                    {item.value && (
                                        <Text style={[styles.menuValue, { color: theme.colors.textSecondary }]}>
                                            {item.value}
                                        </Text>
                                    )}
                                    <Ionicons name="chevron-forward" size={fs(20)} color={theme.colors.textSecondary} />
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* Dark Mode Toggle */}
                        <View
                            style={[
                                styles.menuItem,
                                {
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                    marginBottom: hp(12),
                                }
                            ]}
                        >
                            <View style={styles.menuLeft}>
                                <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.surface }]}>
                                    <Ionicons name="moon-outline" size={fs(22)} color={theme.colors.text} />
                                </View>
                                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                                    Dark Mode
                                </Text>
                            </View>
                            <Switch
                                value={isDarkMode}
                                onValueChange={toggleTheme}
                                trackColor={{ false: '#E5E7EB', true: theme.colors.primary }}
                                thumbColor={isDarkMode ? '#FFFFFF' : '#F3F4F6'}
                                ios_backgroundColor="#E5E7EB"
                            />
                        </View>

                        {/* About */}
                        <TouchableOpacity
                            style={[
                                styles.menuItem,
                                {
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                    marginBottom: hp(12),
                                }
                            ]}
                            onPress={() => navigation.navigate('AboutScreen')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.surface }]}>
                                    <Ionicons name="information-circle-outline" size={fs(22)} color={theme.colors.text} />
                                </View>
                                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                                    About
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={fs(20)} color={theme.colors.textSecondary} />
                        </TouchableOpacity>

                        {/* Logout */}
                        <TouchableOpacity
                            style={[
                                styles.menuItem,
                                {
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                }
                            ]}
                            onPress={() => setShowLogoutModal(true)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <View style={[styles.menuIconContainer, { backgroundColor: theme.colors.error + '15' }]}>
                                    <Ionicons name="log-out-outline" size={fs(22)} color={theme.colors.error} />
                                </View>
                                <Text style={[styles.menuTitle, { color: theme.colors.error }]}>
                                    Logout
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={fs(20)} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Bottom padding for navigation */}
                    <View style={{ height: hp(100) }} />
                </ScrollView>
            </SafeAreaView>

            {/* Logout Confirmation Modal */}
            <Modal
                visible={showLogoutModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.colors.card }]}>
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Logout</Text>
                        <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
                            Are you sure you want to log out?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.colors.surface }]}
                                onPress={() => setShowLogoutModal(false)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.logoutButton]}
                                onPress={handleLogout}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.logoutButtonText}>Yes, Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Bottom Navigation */}
            <BottomMenu
                navigation={navigation}
                activeTab="Profile"
                userName={userName}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing(20),
        paddingVertical: hp(15),
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: fs(24),
        fontWeight: '700',
    },
    menuButton: {
        width: wp(44),
        height: wp(44),
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIcon: {
        width: wp(24),
        height: wp(24),
        tintColor: undefined, // Preserve original image colors
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing(20),
        paddingTop: hp(20),
    },
    profileCard: {
        borderRadius: wp(12),
        padding: spacing(16),
        marginBottom: hp(24),
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp(2) },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    profilePicture: {
        width: wp(60),
        height: wp(60),
        borderRadius: wp(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing(12),
        overflow: 'hidden', // Ensure image stays within bounds
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    profileInitial: {
        fontSize: fs(24),
        fontWeight: '700',
        color: '#FFFFFF',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: fs(18),
        fontWeight: '700',
        marginBottom: hp(4),
    },
    userEmail: {
        fontSize: fs(14),
        fontWeight: '400',
    },
    editButton: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        marginBottom: hp(20),
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing(16),
        borderRadius: wp(12),
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp(1) },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIconContainer: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing(12),
    },
    menuTitle: {
        fontSize: fs(16),
        fontWeight: '500',
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing(8),
    },
    menuValue: {
        fontSize: fs(14),
        fontWeight: '400',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        borderTopLeftRadius: wp(24),
        borderTopRightRadius: wp(24),
        paddingTop: hp(32),
        paddingBottom: hp(24),
        paddingHorizontal: spacing(24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp(-4) },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    modalTitle: {
        fontSize: fs(22),
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: hp(16),
    },
    modalMessage: {
        fontSize: fs(16),
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: hp(28),
        lineHeight: fs(22),
    },
    modalButtons: {
        flexDirection: 'row',
        gap: spacing(16),
    },
    modalButton: {
        flex: 1,
        height: hp(52),
        borderRadius: wp(26),
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 0,
    },
    logoutButton: {
        backgroundColor: '#000000',
    },
    cancelButtonText: {
        fontSize: fs(16),
        fontWeight: '600',
        color: '#1F2937',
    },
    logoutButtonText: {
        fontSize: fs(16),
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default Profile;
