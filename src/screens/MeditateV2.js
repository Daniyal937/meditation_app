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
import { useTheme } from '../context/ThemeContext';
import { auth } from '../config/firebaseConfig';
import { getUserProfile } from '../services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile as setUserProfileAction } from '../redux/slices/userSlice';
import BottomMenu from '../components/BottomMenu';
import { wp, hp, fs, spacing } from '../utils/responsive';

const MeditateV2 = ({ navigation, route }) => {
    const { theme } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const dispatch = useDispatch();
    const userProfileFromRedux = useSelector(state => state.user.profile);
    const [userName, setUserName] = useState(userProfileFromRedux?.name || 'User');
    const insets = useSafeAreaInsets();

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
                            const emailName = currentUser.email.split('@')[0];
                            const derivedName =
                                emailName.charAt(0).toUpperCase() + emailName.slice(1);
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
                } else {
                    setUserName('User');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setUserName('User');
            }
        };

        fetchUserData();
    }, [route, userProfileFromRedux]);

    const categories = [
        {
            id: 'all',
            label: 'All',
            icon: 'apps',
            image: require('../../assets/images/all_icon.png'),
            title: 'All Meditations',
            subtitle: 'Browse all meditation sessions',
            color: '#8E97FD',
        },
        {
            id: 'my',
            label: 'My',
            icon: 'heart',
            image: require('../../assets/images/my_icon.png'),
            title: 'My Favorites',
            subtitle: 'Your saved meditation sessions',
            color: '#FF84A7',
        },
        {
            id: 'anxious',
            label: 'Anxious',
            icon: 'radio-button-on',
            image: require('../../assets/images/anxious_icon.png'),
            title: 'Mindfulness',
            subtitle: 'Practice and develop mindfulness',
            color: '#8E97FD',
        },
        {
            id: 'sleep',
            label: 'Sleep',
            icon: 'moon',
            image: require('../../assets/images/sleep_icon.png'),
            title: 'Sleep Meditations',
            subtitle: 'Relax and fall asleep peacefully',
            color: '#6D9EEB',
        },
        {
            id: 'kids',
            label: 'Kids',
            icon: 'happy',
            image: require('../../assets/images/kids_icon.png'),
            title: 'Kids Meditations',
            subtitle: 'Meditation for children',
            color: '#FFCF86',
        },
    ];

    const meditationCards = [
        {
            id: 1,
            title: '7 Days of Calm',
            image: require('../../assets/images/7_days_calm_bg.png'),
            height: hp(210),
        },
        {
            id: 2,
            title: 'Anxiety Release',
            image: require('../../assets/images/anxiety_release_bg.png'),
            height: hp(167),
        },
        {
            id: 3,
            title: 'Mindful Walking',
            image: require('../../assets/images/mindful_walking_bg.png'),
            height: hp(167),
        },
        {
            id: 4,
            title: 'Deep Breathing',
            image: require('../../assets/images/deep_breathing_bg.png'),
            height: hp(210),
        },
    ];

    const handleCategoryPress = category => {
        setSelectedCategory(category.id);
        navigation.navigate('MeditationSessions', {
            category: {
                title: category.title,
                subtitle: category.subtitle,
                color: category.color,
            },
            userName: userName,
        });
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
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>Meditate</Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            we can learn how to recognize when our minds are doing their normal
                            everyday acrobatics.
                        </Text>
                    </View>

                    {/* Category Filter */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.categoryScroll}
                        contentContainerStyle={styles.categoryScrollContent}
                    >
                        {categories.map(category => (
                            <TouchableOpacity
                                key={category.id}
                                style={styles.categoryItem}
                                onPress={() => handleCategoryPress(category)}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={[
                                        styles.categoryIcon,
                                        {
                                            backgroundColor:
                                                selectedCategory === category.id
                                                    ? category.color
                                                    : theme.colors.surface,
                                        },
                                    ]}
                                >
                                    <Image
                                        source={category.image}
                                        style={[
                                            styles.categoryIconImage,
                                            {
                                                tintColor:
                                                    selectedCategory === category.id
                                                        ? '#FFFFFF'
                                                        : theme.colors.textSecondary,
                                            },
                                        ]}
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.categoryLabel,
                                        {
                                            color:
                                                selectedCategory === category.id
                                                    ? theme.colors.text
                                                    : theme.colors.textSecondary,
                                        },
                                    ]}
                                >
                                    {category.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Daily Calm Featured Card */}
                    <TouchableOpacity style={styles.dailyCalmCard} activeOpacity={0.8}>
                        <Image
                            source={require('../../assets/images/daily_calm_bg_beige_new.png')}
                            style={styles.dailyCalmBgBeige}
                            resizeMode="cover"
                        />
                        <Image
                            source={require('../../assets/images/daily_calm_bg_yellow.png')}
                            style={styles.dailyCalmBgYellow}
                            resizeMode="contain"
                        />
                        <Image
                            source={require('../../assets/images/daily_calm_bg_coral.png')}
                            style={styles.dailyCalmBgCoral}
                            resizeMode="contain"
                        />
                        <View style={styles.playButton}>
                            <Ionicons name="play" size={wp(20)} color="#FFFFFF" />
                        </View>
                        <View style={styles.dailyCalmContent}>
                            <Text style={styles.dailyCalmTitle}>Daily Calm</Text>
                            <Text style={styles.dailyCalmSubtitle}>APR 30 • PAUSE PRACTICE</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Meditation Cards Grid */}
                    <View style={styles.meditationGrid}>
                        {/* Left Column */}
                        <View style={styles.gridColumn}>
                            {meditationCards
                                .filter((_, index) => index % 2 === 0)
                                .map(card => (
                                    <TouchableOpacity
                                        key={card.id}
                                        style={[styles.meditationCard, { height: card.height }]}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            source={card.image}
                                            style={styles.meditationCardBgImage}
                                            resizeMode="cover"
                                        />
                                        <Text style={styles.meditationCardTitle}>{card.title}</Text>
                                    </TouchableOpacity>
                                ))}
                        </View>

                        {/* Right Column */}
                        <View style={styles.gridColumn}>
                            {meditationCards
                                .filter((_, index) => index % 2 !== 0)
                                .map(card => (
                                    <TouchableOpacity
                                        key={card.id}
                                        style={[styles.meditationCard, { height: card.height }]}
                                        activeOpacity={0.8}
                                    >
                                        <Image
                                            source={card.image}
                                            style={styles.meditationCardBgImage}
                                            resizeMode="cover"
                                        />
                                        <Text style={styles.meditationCardTitle}>{card.title}</Text>
                                    </TouchableOpacity>
                                ))}
                        </View>
                    </View>
                </ScrollView>
            </View>

            <BottomMenu navigation={navigation} activeTab="Meditate" userName={userName} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingBottom: 0,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing(20),
        paddingTop: hp(20),
        paddingBottom: hp(100), // Updated to accommodate BottomMenu
    },
    header: {
        marginTop: hp(30),
        marginBottom: hp(25),
        alignItems: 'center',
    },

    title: {
        fontSize: fs(28),
        fontWeight: '700',
        fontFamily: 'HelveticaNeue',
        color: '#3F414E',
        marginBottom: hp(12),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: fs(16),
        fontWeight: '300',
        fontFamily: 'HelveticaNeue',
        color: '#A1A4B2',
        lineHeight: fs(24),
        textAlign: 'center',
    },
    categoryScroll: {
        marginBottom: hp(25),
    },
    categoryScrollContent: {
        paddingRight: spacing(20),
    },
    categoryItem: {
        alignItems: 'center',
        marginRight: spacing(20),
    },
    categoryIcon: {
        width: wp(60),
        height: wp(60),
        borderRadius: wp(30),
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(8),
    },
    categoryIconSelected: {
        backgroundColor: '#8E97FD',
    },
    categoryIconImage: {
        width: wp(30),
        height: wp(30),
    },
    categoryLabel: {
        fontSize: fs(12),
        fontWeight: '500',
        color: '#A1A4B2',
    },
    categoryLabelSelected: {
        color: '#3F414E',
    },
    dailyCalmCard: {
        backgroundColor: '#FFD4B8',
        borderRadius: wp(12),
        paddingVertical: hp(5),
        paddingHorizontal: spacing(30),
        marginBottom: hp(25),
        position: 'relative',
        overflow: 'hidden',
        height: hp(95),
        justifyContent: 'center',
    },
    dailyCalmBgBeige: {
        position: 'absolute',
        left: hp(0),
        top: hp(0),
        width: wp(150),
        height: hp(125),
        opacity: 0.7,
    },
    dailyCalmBgYellow: {
        position: 'absolute',
        right: wp(0),
        top: hp(-40),
        width: wp(200),
        height: hp(140),
        opacity: 0.85,
    },
    dailyCalmBgCoral: {
        position: 'absolute',
        right: wp(130),
        bottom: hp(-10),
        width: wp(70),
        height: hp(50),
        opacity: 0.9,
    },
    dailyCalmContent: {
        zIndex: 1,
        justifyContent: 'center',
    },
    dailyCalmTitle: {
        fontSize: fs(18),
        fontWeight: '700',
        color: '#3F414E',
        marginBottom: hp(6),
    },
    dailyCalmSubtitle: {
        fontSize: fs(11),
        fontWeight: '400',
        color: '#3F414E',
        opacity: 0.7,
    },
    playButton: {
        position: 'absolute',
        // top: hp(42),
        right: spacing(30),
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: '#3F414E',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    meditationGrid: {
        flexDirection: 'row',
        marginBottom: hp(20),
        gap: spacing(15),
    },
    gridColumn: {
        flex: 1,
    },
    meditationCard: {
        borderRadius: wp(12),
        marginBottom: hp(20),
        justifyContent: 'flex-end',
        overflow: 'hidden',
        padding: spacing(0),
        backgroundColor: '#F5F5F5', // Added fallback background
    },
    meditationCardBgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        borderRadius: wp(12), // Re-enabled to ensure clipping on all devices
    },
    meditationCardTitle: {
        fontSize: fs(16),
        fontWeight: '700',
        color: '#FFFFFF',
        zIndex: 2,
        margin: spacing(15), // Added margin since parent padding is 0
    },
});

export default MeditateV2;
