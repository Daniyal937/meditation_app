import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Switch,
    Modal,
    StatusBar,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; 
import { useTheme } from '../context/ThemeContext';
import { auth } from '../config/firebaseConfig';
import { getUserProfile } from '../services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile as setUserProfileAction, clearUserData } from '../redux/slices/userSlice';
import BottomMenu from '../components/BottomMenu';
import { wp, hp, fs, spacing } from '../utils/responsive'; 
import { ScreenProps } from '../types';
import { RootState } from '../redux/store';
const Profile = ({ navigation }: ScreenProps<'Profile'>) => {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const dispatch = useDispatch();
    const userProfileFromRedux = useSelector((state: RootState) => state.user.profile);
    const [userName, setUserName] = useState(userProfileFromRedux?.name || 'User');
    const [userEmail, setUserEmail] = useState(userProfileFromRedux?.email || '');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [profileImage, setProfileImage] = useState(userProfileFromRedux?.profileImage || null); 
    const insets = useSafeAreaInsets();
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    if (!userEmail && currentUser.email) {
                        setUserEmail(currentUser.email);
                    }
                    if (userProfileFromRedux) {
                        setUserName(userProfileFromRedux.name);
                        if (userProfileFromRedux.email) setUserEmail(userProfileFromRedux.email);
                        if (userProfileFromRedux.profileImage)
                            setProfileImage(userProfileFromRedux.profileImage);
                        return; 
                    }
                    const userProfile = await getUserProfile(currentUser.uid);
                    if (userProfile && userProfile.name) {
                        setUserName(userProfile.name);
                        dispatch(
                            setUserProfileAction({ ...userProfile, email: currentUser.email })
                        );
                    } else {
                        if (currentUser.email) {
                            const emailName = currentUser.email.split('@')[0];
                            const derivedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
                            setUserName(derivedName);
                            dispatch(
                                setUserProfileAction({
                                    name: derivedName,
                                    uid: currentUser.uid,
                                    email: currentUser.email,
                                })
                            );
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userProfileFromRedux]);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            const newImage = result.assets[0].uri;
            setProfileImage(newImage);
            if (userProfileFromRedux) {
                dispatch(setUserProfileAction({ ...userProfileFromRedux, profileImage: newImage }));
            }
        }
    };
    const menuItems = [
        {
            id: 'personal',
            title: 'Personal Info',
            iconImage: require('../../assets/images/personal_info_icon.png'),
            onPress: () => navigation.navigate('EditProfile'),
        },
        {
            id: 'notification',
            title: 'Notification',
            iconImage: require('../../assets/images/notification_icon.png'),
            onPress: () => navigation.navigate('NotificationSettings'),
        },
        {
            id: 'preferences',
            title: 'Preferences',
            iconImage: require('../../assets/images/preferences_icon.png'),
            onPress: () => navigation.navigate('Preferences'),
        },
        {
            id: 'language',
            title: 'Language',
            iconImage: require('../../assets/images/language_icon.png'),
            value: 'English (US)',
            onPress: () => { }, 
        },
    ];
    const handleLogout = () => {
        setShowLogoutModal(false);
        auth.signOut()
            .then(() => {
                dispatch(clearUserData()); 
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignUp' }],
                });
            })
            .catch(error => {
                console.error('Error signing out:', error);
            });
    };
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <StatusBar
                    barStyle={theme.colors.statusBar}
                    backgroundColor={theme.colors.background}
                />
                {}
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
                    {}
                    <View style={[styles.profileCard, { backgroundColor: theme.colors.card }]}>
                        <View style={styles.profileHeader}>
                            <View style={styles.profileLeft}>
                                {}
                                <TouchableOpacity
                                    style={[
                                        styles.profilePicture,
                                        { backgroundColor: theme.colors.primary },
                                    ]}
                                    onPress={pickImage}
                                    activeOpacity={0.8}
                                >
                                    {profileImage ? (
                                        <Image
                                            source={{ uri: profileImage }}
                                            style={styles.profileImage}
                                        />
                                    ) : (
                                        <Text style={styles.profileInitial}>
                                            {userName.charAt(0).toUpperCase()}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                {}
                                <View style={styles.userInfo}>
                                    <Text style={[styles.userName, { color: theme.colors.text }]}>
                                        {userName}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.userEmail,
                                            { color: theme.colors.textSecondary },
                                        ]}
                                    >
                                        {userEmail}
                                    </Text>
                                </View>
                            </View>
                            {}
                            <TouchableOpacity
                                style={styles.editButton}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('EditProfile')}
                            >
                                <Image
                                    source={require('../../assets/images/edit_icon.png')}
                                    style={{ width: wp(20), height: wp(20) }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {}
                    <View style={styles.menuContainer}>
                        {menuItems.map((item, index) => (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.menuItem,
                                    { backgroundColor: theme.colors.card },
                                    index === menuItems.length - 1 && styles.lastMenuItem,
                                ]}
                                onPress={item.onPress}
                                activeOpacity={0.7}
                            >
                                <View style={styles.menuLeft}>
                                    <Image
                                        source={item.iconImage}
                                        style={{
                                            width: wp(42),
                                            height: wp(42),
                                            marginRight: spacing(12),
                                        }}
                                        resizeMode="contain"
                                    />
                                    <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                                        {item.title}
                                    </Text>
                                </View>
                                <View style={styles.menuRight}>
                                    {item.value && (
                                        <Text
                                            style={[
                                                styles.menuValue,
                                                { color: theme.colors.textSecondary },
                                            ]}
                                        >
                                            {item.value}
                                        </Text>
                                    )}
                                    <Ionicons
                                        name="chevron-forward"
                                        size={fs(20)}
                                        color={theme.colors.textSecondary}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                        {}
                        <View style={[styles.menuItem, { backgroundColor: theme.colors.card }]}>
                            <View style={styles.menuLeft}>
                                <Image
                                    source={require('../../assets/images/darkmode_icon.png')}
                                    style={{
                                        width: wp(42),
                                        height: wp(42),
                                        marginRight: spacing(12),
                                    }}
                                    resizeMode="contain"
                                />
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
                        {}
                        <TouchableOpacity
                            style={[styles.menuItem, { backgroundColor: theme.colors.card }]}
                            onPress={() => navigation.navigate('AboutScreen')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <Image
                                    source={require('../../assets/images/about_icon_v6.png')}
                                    style={{
                                        width: wp(42),
                                        height: wp(42),
                                        marginRight: spacing(12),
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>
                                    About
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={fs(20)}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                        {}
                        <TouchableOpacity
                            style={[
                                styles.menuItem,
                                { backgroundColor: theme.colors.card },
                                styles.lastMenuItem,
                            ]}
                            onPress={() => setShowLogoutModal(true)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <Image
                                    source={require('../../assets/images/logout_icon.png')}
                                    style={{
                                        width: wp(42),
                                        height: wp(42),
                                        marginRight: spacing(12),
                                    }}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.menuTitle, { color: theme.colors.error }]}>
                                    Logout
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={fs(20)}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>
                    {}
                    <View style={{ height: hp(100) }} />
                </ScrollView>
            </View>
            {}
            <Modal
                visible={showLogoutModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowLogoutModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View
                        style={[
                            styles.modalContent,
                            {
                                backgroundColor: theme.colors.card,
                                paddingBottom: Math.max(insets.bottom, hp(24)),
                            },
                        ]}
                    >
                        <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                            Logout
                        </Text>
                        <View
                            style={{
                                height: 2,
                                backgroundColor: '#E5E7EB',
                                width: '100%',
                                marginBottom: hp(20),
                            }}
                        />
                        <Text style={[styles.modalMessage, { color: theme.colors.textSecondary }]}>
                            Are you sure you want to log out?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.modalButton,
                                    styles.cancelButton,
                                    { backgroundColor: theme.colors.surface },
                                ]}
                                onPress={() => setShowLogoutModal(false)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[styles.cancelButtonText, { color: theme.colors.text }]}
                                >
                                    Cancel
                                </Text>
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
            {}
            <BottomMenu navigation={navigation} activeTab="Profile" userName={userName} />
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
        paddingTop: hp(10),
        paddingBottom: hp(10),
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
        tintColor: undefined, 
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing(20),
        paddingTop: hp(20),
    },
    profileCard: {
        paddingVertical: spacing(16),
        paddingHorizontal: spacing(16),
        minHeight: hp(80),
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
        overflow: 'hidden', 
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
        padding: spacing(8),
    },
    menuContainer: {
        marginBottom: hp(20),
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing(16),
        paddingHorizontal: spacing(16),
        minHeight: hp(56),
    },
    lastMenuItem: {
        marginBottom: 0,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
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
        marginBottom: hp(12),
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
