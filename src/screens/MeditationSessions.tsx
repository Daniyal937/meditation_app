import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebaseConfig';
import { getUserProfile } from '../services/authService';

import { useTheme } from '../context/ThemeContext';

import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile as setUserProfileAction } from '../redux/slices/userSlice';
import BottomMenu from '../components/BottomMenu';
import { wp, hp, fs, spacing } from '../utils/responsive';
import { ScreenProps } from '../types';
import { RootState } from '../redux/store';

const MeditationSessions = ({ navigation, route }: ScreenProps<'MeditationSessions'>) => {
    const { theme } = useTheme(); // Get theme
    const dispatch = useDispatch();
    const userProfileFromRedux = useSelector((state: RootState) => state.user.profile);
    const [userName, setUserName] = useState(userProfileFromRedux?.name || 'User');
    const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
    const insets = useSafeAreaInsets();

    // Get category data from route params or use default
    const categoryData = route?.params?.category || {
        title: 'Mindfulness',
        subtitle: 'Practice and develop mindfulness',
        color: '#8E97FD',
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    if (userProfileFromRedux) {
                        setUserName(userProfileFromRedux.name);
                        return; // Already have data
                    }

                    if (route?.params?.userName) {
                        setUserName(route.params.userName);
                    } else {
                        const userProfile = await getUserProfile(currentUser.uid);
                        if (userProfile && userProfile.name) {
                            setUserName(userProfile.name);
                            dispatch(setUserProfileAction(userProfile));
                        } else {
                            if (currentUser.email) {
                                const emailName = currentUser.email.split('@')[0];
                                const derivedName =
                                    emailName.charAt(0).toUpperCase() + emailName.slice(1);
                                setUserName(derivedName);
                                // Store partial data if just name
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
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [route, userProfileFromRedux]);

    const sessions = [
        {
            id: 1,
            name: 'First Session',
            duration: '2 - 5 min',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        },
        {
            id: 2,
            name: 'Introduction to Mindfulness',
            duration: '5 - 15 min',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        },
        {
            id: 3,
            name: 'Vipassana',
            duration: '5 - 10 min',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        },
        {
            id: 4,
            name: 'Mindful Living',
            duration: '5 - 20 min',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        },
        {
            id: 5,
            name: 'Science of Meditation',
            duration: '5 - 20 min',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        },
        {
            id: 6,
            name: 'Manage Negative Emotions',
            duration: '5 - 25 min',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        },
        {
            id: 7,
            name: 'Meditation Sounds',
            duration: '5 - 30 min',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        },
    ];

    const handlePlaySession = (session: typeof sessions[0]) => {
        // Navigate to AudioDetails2 screen (using v2 as requested implicitly by user editing AudioDetails2)
        navigation.navigate('AudioDetails2', { session });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <StatusBar
                    barStyle={theme.colors.statusBar}
                    backgroundColor={theme.colors.background}
                />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{
                        paddingHorizontal: spacing(20),
                        paddingTop: hp(20),
                        paddingBottom: hp(140),
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Back Button */}
                    <TouchableOpacity
                        style={[
                            styles.backButton,
                            { borderColor: theme.colors.border, borderWidth: 1 },
                        ]}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>

                    {/* Category Header Card */}
                    {/* ... (this part uses categoryData.color, which is passed in, so it's dynamic enough or specific) ... */}
                    <View style={[styles.categoryCard, { backgroundColor: categoryData.color }]}>
                        <View style={styles.categoryInfo}>
                            <Text style={styles.categoryTitle}>{categoryData.title}</Text>
                            <Text style={styles.categorySubtitle}>{categoryData.subtitle}</Text>
                        </View>
                        <View style={styles.categoryIllustration}>
                            <Image
                                source={require('../../assets/images/mindfulness_logo.png')}
                                style={styles.categoryLogo}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Session List */}
                    <View style={styles.sessionList}>
                        {sessions.map(session => (
                            <TouchableOpacity
                                key={session.id}
                                style={styles.sessionItem}
                                onPress={() => {
                                    setActiveSessionId(session.id);
                                    handlePlaySession(session);
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={styles.playIconContainer}>
                                    <Ionicons
                                        name="play-circle"
                                        size={wp(40)}
                                        color={
                                            activeSessionId === session.id ? '#8E97FD' : '#000000'
                                        }
                                    />
                                </View>
                                <View style={styles.sessionInfo}>
                                    <Text
                                        style={[styles.sessionName, { color: theme.colors.text }]}
                                    >
                                        {session.name}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.sessionDuration,
                                            { color: theme.colors.textSecondary },
                                        ]}
                                    >
                                        {session.duration}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {/* Bottom Navigation */}
            <BottomMenu
                navigation={navigation}
                activeTab={route?.params?.activeTab || 'Meditate'}
                userName={userName}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    backButton: {
        width: wp(40),
        height: wp(40),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(20),
        borderRadius: wp(20),
    },
    categoryCard: {
        borderRadius: wp(15),
        padding: spacing(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(30),
        height: hp(135),
    },
    categoryInfo: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: fs(22),
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: hp(6),
    },
    categorySubtitle: {
        fontSize: fs(13),
        fontWeight: '300',
        color: '#FFFFFF',
        opacity: 0.9,
    },
    categoryIllustration: {
        marginLeft: spacing(15),
    },
    categoryLogo: {
        width: wp(93),
        height: hp(97),
    },
    sessionList: {
        gap: hp(5),
    },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(10),
    },
    playIconContainer: {
        width: wp(60),
        height: wp(60),
        borderRadius: wp(30),
        backgroundColor: '#E5E4E2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing(15),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: hp(2),
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    sessionInfo: {
        flex: 1,
    },
    sessionName: {
        fontSize: fs(16),
        fontWeight: '600',
        marginBottom: hp(4),
    },
    sessionDuration: {
        fontSize: fs(12),
        fontWeight: '400',
    },
});

export default MeditationSessions;
