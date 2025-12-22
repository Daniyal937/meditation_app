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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../config/firebaseConfig';
import { getUserProfile } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import BottomMenu from '../components/BottomMenu';
import { wp, hp, fs, spacing } from '../utils/responsive';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile as setUserProfileAction } from '../redux/slices/userSlice';

const Home = ({ navigation, route }) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const userProfileFromRedux = useSelector(state => state.user.profile);
    const [userName, setUserName] = useState(userProfileFromRedux?.name || 'User');
    const [greeting, setGreeting] = useState('Good Morning');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;

                if (currentUser) {


                    if (userProfileFromRedux) {
                        setUserName(userProfileFromRedux.name);
                        setLoading(false);
                        return; // Already have data
                    }

                    if (route?.params?.userName) {
                        setUserName(route.params.userName);
                        // Store partial data if just name
                        dispatch(setUserProfileAction({ name: route.params.userName, uid: currentUser.uid, email: currentUser.email }));
                    } else {
                        const userProfile = await getUserProfile(currentUser.uid);
                        if (userProfile && userProfile.name) {
                            setUserName(userProfile.name);
                            dispatch(setUserProfileAction(userProfile)); // Save to Redux

                        } else {
                            const emailName = currentUser.email.split('@')[0];
                            const derivedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
                            setUserName(derivedName);
                            // Save payload to Redux
                            dispatch(setUserProfileAction({ name: derivedName, uid: currentUser.uid, email: currentUser.email }));

                        }
                    }
                } else {

                    setUserName('User');
                }

            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserName('User');
            } finally {
                setLoading(false);
            }
        };

        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good Morning');
        } else if (hour < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }

        fetchUserData();
    }, [route]);

    const featuredSessions = [
        { id: 1, title: 'Basics', type: 'COURSE', duration: '3-10 MIN', color: '#8E97FD' },
        { id: 2, title: 'Relaxation', type: 'MUSIC', duration: '3-10 MIN', color: '#FFCF86', textColor: '#3F414E', buttonBg: '#3F414E', buttonTextColor: '#FFFFFF' },
    ];

    const recommendedSessions = [
        { id: 1, title: 'Focus', duration: 'MEDITATION • 3-10 MIN', color: '#6CB28E' },
        { id: 2, title: 'Happiness', duration: 'MEDITATION • 3-10 MIN', color: '#FFCF86' },
        { id: 3, title: 'Calm', duration: 'MEDITATION • 3-10 MIN', color: '#8E97FD' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background} />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Text style={[styles.logoText, { color: theme.colors.text }]}>Silent </Text>
                        <Image
                            source={require('../../assets/images/silent_moon_header_logo.png')}
                            style={styles.headerLogo}
                            resizeMode="contain"
                        />
                        <Text style={[styles.logoText, { color: theme.colors.text }]}> Moon</Text>
                    </View>

                    {/* Greeting Section */}
                    <View style={styles.greetingSection}>
                        <Text style={[styles.greetingText, { color: theme.colors.text }]}>{greeting}, {userName}</Text>
                        <Text style={[styles.greetingSubtext, { color: theme.colors.textSecondary }]}>We Wish you have a good day</Text>
                    </View>

                    {/* Featured Cards */}
                    <View style={styles.featuredContainer}>
                        {featuredSessions.map((session, index) => (
                            <TouchableOpacity
                                key={session.id}
                                style={[
                                    styles.featuredCard,
                                    {
                                        backgroundColor: session.color,
                                        marginRight: index === 0 ? spacing(10) : 0,
                                        marginLeft: index === 1 ? spacing(10) : 0,
                                    }
                                ]}
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate('CourseDetails', { session })}
                            >
                                {session.id === 1 && (
                                    <Image
                                        source={require('../../assets/images/basics_logo.png')}
                                        style={styles.basicsLogo}
                                        resizeMode="contain"
                                    />
                                )}
                                {session.id === 2 && (
                                    <View style={styles.relaxationLogoContainer}>
                                        <Image
                                            source={require('../../assets/images/relaxation_logo.png')}
                                            style={styles.relaxationLogo}
                                            resizeMode="contain"
                                        />
                                        <Image
                                            source={require('../../assets/images/relaxation_overlay_logo.png')}
                                            style={styles.relaxationOverlayLogo}
                                            resizeMode="contain"
                                        />
                                    </View>
                                )}
                                <View style={styles.featuredContent}>
                                    <View>
                                        <Text style={[styles.featuredTitle, session.textColor && { color: session.textColor }]}>{session.title}</Text>
                                        <Text style={[styles.featuredSubtitle, session.textColor && { color: session.textColor }]}>{session.type}</Text>
                                    </View>
                                    <View style={styles.featuredFooter}>
                                        <Text style={[styles.featuredDuration, session.textColor && { color: session.textColor }]}>{session.duration}</Text>
                                        <TouchableOpacity
                                            style={[styles.startButton, session.buttonBg && { backgroundColor: session.buttonBg }]}
                                            activeOpacity={0.8}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                navigation.navigate('CourseDetails', { session });
                                            }}
                                        >
                                            <Text style={[styles.startButtonText, session.buttonTextColor && { color: session.buttonTextColor }]}>START</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Daily Thought */}
                    <TouchableOpacity style={styles.dailyThoughtCard} activeOpacity={0.8}>
                        <Image
                            source={require('../../assets/images/daily_thought_1.png')}
                            style={styles.dailyThoughtBg1}
                            resizeMode="cover"
                        />
                        <Image
                            source={require('../../assets/images/daily_thought_2.png')}
                            style={styles.dailyThoughtBg2}
                            resizeMode="contain"
                        />
                        <Image
                            source={require('../../assets/images/daily_thought_3.png')}
                            style={styles.dailyThoughtBg3}
                            resizeMode="contain"
                        />
                        <View style={styles.dailyThoughtContent}>
                            <View>
                                <Text style={styles.dailyThoughtTitle}>Daily Thought</Text>
                                <Text style={styles.dailyThoughtSubtitle}>MEDITATION • 3-10 MIN</Text>
                            </View>
                            <View style={styles.playButton}>
                                <Ionicons name="play" size={fs(24)} color="#3F414E" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Recommended Section */}
                    <View style={styles.recommendedSection}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recommended for you</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.recommendedScroll}
                        >
                            {recommendedSessions.map((session) => (
                                <View key={session.id} style={styles.recommendedCardWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            styles.recommendedCard,
                                            { backgroundColor: session.color },
                                            session.id === 1 && styles.focusCard
                                        ]}
                                        activeOpacity={0.8}
                                        onPress={() => navigation.navigate('MeditationSessions', { userName })}
                                    >
                                        {session.id === 1 && (
                                            <Image
                                                source={require('../../assets/images/focus_bg.png')}
                                                style={styles.focusBgImage}
                                                resizeMode="cover"
                                            />
                                        )}
                                        {session.id === 2 && (
                                            <Image
                                                source={require('../../assets/images/happiness_bg.png')}
                                                style={styles.happinessBgImage}
                                                resizeMode="contain"
                                            />
                                        )}
                                        {session.id === 3 && (
                                            <Image
                                                source={require('../../assets/images/focus_bg.png')}
                                                style={styles.calmBgImage}
                                                resizeMode="cover"
                                            />
                                        )}

                                    </TouchableOpacity>
                                    {session.id === 1 && (
                                        <View style={styles.focusTextContainer}>
                                            <Text style={[styles.recommendedTitle, { color: theme.colors.text }]}>{session.title}</Text>
                                            <Text style={[styles.recommendedDuration, { color: theme.colors.textSecondary, opacity: 1 }]}>{session.duration}</Text>
                                        </View>
                                    )}
                                    {session.id === 2 && (
                                        <View style={styles.focusTextContainer}>
                                            <Text style={[styles.recommendedTitle, { color: theme.colors.text }]}>{session.title}</Text>
                                            <Text style={[styles.recommendedDuration, { color: theme.colors.textSecondary, opacity: 1 }]}>{session.duration}</Text>
                                        </View>
                                    )}
                                    {session.id === 3 && (
                                        <View style={styles.focusTextContainer}>
                                            <Text style={[styles.recommendedTitle, { color: theme.colors.text }]}>{session.title}</Text>
                                            <Text style={[styles.recommendedDuration, { color: theme.colors.textSecondary, opacity: 1 }]}>{session.duration}</Text>
                                        </View>
                                    )}
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Bottom padding for navigation */}
                    <View style={{ height: hp(80) }} />
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Navigation */}
            <BottomMenu navigation={navigation} activeTab="Home" userName={userName} />
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
    scrollContent: {
        paddingHorizontal: spacing(20),
        paddingTop: hp(20),
        paddingBottom: hp(100), // Add padding for BottomMenu
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: hp(30),
        marginBottom: hp(30),
    },
    logoText: {
        fontSize: fs(16),
        fontWeight: '400',
        letterSpacing: 0.5,
    },
    headerLogo: {
        width: wp(30),
        height: wp(30),
        marginHorizontal: spacing(5),
    },
    greetingSection: {
        marginBottom: hp(25),
    },
    greetingText: {
        fontSize: fs(28),
        fontWeight: '700',
        marginBottom: hp(8),
        fontFamily: 'HelveticaNeue',
    },
    greetingSubtext: {
        fontSize: fs(20),
        fontWeight: '300',
        fontFamily: 'HelveticaNeue',
    },
    featuredContainer: {
        flexDirection: 'row',
        marginBottom: hp(25),
    },
    featuredCard: {
        flex: 1,
        borderRadius: wp(10),
        padding: spacing(16),
        height: hp(200),
        justifyContent: 'flex-end',
        position: 'relative',
        overflow: 'hidden',
    },
    basicsLogo: {
        width: wp(120),
        height: hp(92),
        position: 'absolute',
        top: 0,
        right: wp(-8),
    },
    relaxationLogo: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        right: 0,
    },
    relaxationLogoContainer: {
        position: 'absolute',
        top: hp(-10), // Adjusted positioning
        right: wp(-10), // Adjusted positioning
        width: wp(150),
        height: hp(150),
    },
    relaxationOverlayLogo: {
        width: wp(87),
        height: hp(101),
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: wp(-43.5) }, { translateY: hp(-50.5) }],
    },
    featuredContent: {
        gap: hp(16),
    },
    featuredFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    featuredTitle: {
        fontSize: fs(18),
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: hp(4),
    },
    featuredSubtitle: {
        fontSize: fs(11),
        fontWeight: '400',
        color: '#FFFFFF',
        opacity: 0.9,
    },
    featuredDuration: {
        fontSize: fs(11),
        fontWeight: '400',
        color: '#FFFFFF',
        opacity: 0.9,
    },
    startButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: hp(10),
        paddingHorizontal: spacing(20),
        borderRadius: wp(20),
    },
    startButtonText: {
        fontSize: fs(12),
        fontWeight: '600',
        color: '#3F414E',
        letterSpacing: 0.5,
    },
    dailyThoughtCard: {
        backgroundColor: '#333242',
        borderRadius: wp(12),
        padding: spacing(20),
        marginBottom: hp(30),
        overflow: 'hidden',
        position: 'relative',
        height: hp(95),
        justifyContent: 'center',
    },
    dailyThoughtBg1: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: wp(150),
        height: hp(100),
        opacity: 0.8,
    },
    dailyThoughtBg2: {
        position: 'absolute',
        right: 0,
        top: -14,
        width: wp(170),
        height: hp(80),
        opacity: 0.8,
    },
    dailyThoughtBg3: {
        position: 'absolute',
        right: wp(100),
        bottom: -20,
        width: wp(70),
        height: hp(60),
        opacity: 0.8,
    },
    dailyThoughtContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dailyThoughtTitle: {
        fontSize: fs(18),
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: hp(6),
    },
    dailyThoughtSubtitle: {
        fontSize: fs(11),
        fontWeight: '400',
        color: '#FFFFFF',
        opacity: 0.7,
    },
    playButton: {
        width: wp(50),
        height: wp(50),
        borderRadius: wp(25),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recommendedSection: {
        marginBottom: hp(20),
    },
    sectionTitle: {
        fontSize: fs(20),
        fontWeight: '600',
        marginBottom: hp(15),
    },
    recommendedScroll: {
        paddingRight: spacing(20),
    },
    recommendedCard: {
        width: wp(162),
        height: hp(113),
        borderRadius: wp(12),
        padding: spacing(16),
        justifyContent: 'flex-end',
        overflow: 'hidden',
        position: 'relative',
    },
    focusBgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    happinessBgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: wp(162),
        height: hp(113),
    },
    calmBgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    focusCard: {
        width: wp(162),
        height: hp(113),
    },
    recommendedCardWrapper: {
        marginRight: spacing(15),
    },
    focusTextContainer: {
        marginTop: hp(8),
        gap: hp(4),
    },
    recommendedContent: {
        gap: hp(6),
    },
    recommendedTitle: {
        fontSize: fs(16),
        fontWeight: '700',
        color: '#FFFFFF',
    },
    recommendedDuration: {
        fontSize: fs(10),
        fontWeight: '400',
        color: '#FFFFFF',
        opacity: 0.9,
    },
});

export default Home;
