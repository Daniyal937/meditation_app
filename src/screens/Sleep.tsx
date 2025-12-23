import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
    ImageBackground,
    useWindowDimensions,
    SafeAreaView,
    Platform,
    Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../config/firebaseConfig';
import { getUserProfile } from '../services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile as setUserProfileAction } from '../redux/slices/userSlice';
import BottomMenu from '../components/BottomMenu';
import { wp, hp, fs, spacing, isTablet } from '../utils/responsive';

const categories = [
    { id: 'all', name: 'All', image: require('../../assets/images/sleep_cat_all.png') },
    { id: 'my', name: 'My', image: require('../../assets/images/sleep_cat_my.png') },
    { id: 'anxious', name: 'Anxious', image: require('../../assets/images/sleep_cat_anxious.png') },
    { id: 'sleep', name: 'Sleep', image: require('../../assets/images/sleep_cat_sleep.png') },
    { id: 'kids', name: 'Kids', image: require('../../assets/images/sleep_cat_kids.png') },
];

const sleepContent = [
    {
        id: 1,
        title: 'Night Island',
        duration: '45 MIN',
        type: 'SLEEP MUSIC',
        image: require('../../assets/images/night_island_new.png'),
        color: '#586894',
    },
    {
        id: 2,
        title: 'Sweet Sleep',
        duration: '45 MIN',
        type: 'SLEEP MUSIC',
        image: require('../../assets/images/sweet_sleep_new.png'),
        color: '#8E97FD',
    },
    {
        id: 3,
        title: 'Moon Clouds',
        duration: '45 MIN',
        type: 'SLEEP MUSIC',
        image: require('../../assets/images/sleep_card_3.png'),
        color: '#586894',
    },
    {
        id: 4,
        title: 'Sweet Dreams',
        duration: '45 MIN',
        type: 'SLEEP MUSIC',
        image: require('../../assets/images/sleep_card_4.png'),
        color: '#8E97FD',
    },
];

// Animation component for category buttons
const CategoryButton = ({ category, isActive, onPress, style }) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.categoryTab,
            style,
            {
                transform: [{ scale: pressed ? 0.9 : 1 }],
                opacity: pressed ? 0.8 : 1,
            },
        ]}
    >
        <Image source={category.image} style={styles.categoryImage} resizeMode="contain" />
    </Pressable>
);

const Sleep = ({ navigation, route }) => {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { width } = useWindowDimensions();
    const numColumns = isTablet() ? 3 : 2;
    const cardWidth = (width - spacing(40) - (numColumns - 1) * spacing(15)) / numColumns;
    const dispatch = useDispatch();
    const userProfileFromRedux = useSelector(state => state.user.profile);
    const [userName, setUserName] = useState(userProfileFromRedux?.name || 'User');
    const [activeCategory, setActiveCategory] = useState('All');

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
                        const profile = await getUserProfile(currentUser.uid);
                        if (profile?.name) {
                            setUserName(profile.name);
                            dispatch(setUserProfileAction(profile));
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
                }
            } catch {
                setUserName('User');
            }
        };

        fetchUserData();
    }, [route, userProfileFromRedux]);

    useFocusEffect(useCallback(() => { }, []));

    return (
        <View style={{ flex: 1, backgroundColor: '#03174C' }}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: hp(100) + insets.bottom }}
                bounces={false}
            >
                {/* HEADER */}
                <ImageBackground
                    source={require('../../assets/images/sleep_header_bg.png')}
                    style={[styles.headerGradient, { paddingTop: insets.top + hp(20) }]}
                    resizeMode="cover"
                >
                    {/* Header Icon Image */}
                    <Image
                        source={require('../../assets/images/sleep_header_icon.png')}
                        style={styles.headerImage}
                        resizeMode="contain"
                    />

                    <Text style={styles.headerTitle}>Sleep Stories</Text>
                    <Text style={styles.headerSubtitle}>
                        {
                            'Soothing bedtime stories to help you fall into a deep and natural sleep'
                        }
                    </Text>
                </ImageBackground>

                {/* CATEGORIES */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map((category, index) => (
                        <CategoryButton
                            key={category.id}
                            category={category}
                            isActive={activeCategory === category.name}
                            onPress={() => setActiveCategory(category.name)}
                            style={index === categories.length - 1 ? { marginRight: 0 } : {}}
                        />
                    ))}
                </ScrollView>

                {/* 🌊 FEATURED CARD — IMAGE MATCHES CARD */}
                <View style={styles.featuredCard}>
                    <ImageBackground
                        source={require('../../assets/images/ocean_moon_bg_final.png')}
                        style={styles.featuredImage}
                        resizeMode="cover"
                    >
                        <View style={styles.featuredContent}>

                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={() =>
                                    navigation.navigate('PlayOption', {
                                        content: {
                                            title: 'The Ocean Moon',
                                            duration: '45 MIN',
                                            type: 'SLEEP MUSIC',
                                            description:
                                                "Ease the mind into a restful night's sleep with\n these deep, ambient tones.",
                                            favoriteCount: '24,234',
                                            listeningCount: '34,234',
                                            image: require('../../assets/images/ocean_moon_hero.png'), // Should use hero image for play option
                                        },
                                    })
                                }
                            >
                                <Text style={styles.startButtonText}>START</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </View>

                {/* GRID */}
                <View style={styles.gridContainer}>
                    {sleepContent.map(item => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.gridCard, { width: cardWidth }]}
                            onPress={() => navigation.navigate('SleepMusic')}
                        >
                            <View
                                style={[
                                    styles.gridImageContainer,
                                    { backgroundColor: item.color },
                                ]}
                            >
                                <Image
                                    source={item.image}
                                    style={styles.gridImage}
                                    resizeMode="cover"
                                />
                            </View>
                            <View style={styles.gridCardContent}>
                                <Text style={styles.gridCardTitle}>{item.title}</Text>
                                <Text style={styles.gridCardSubtitle}>
                                    {item.duration} • {item.type}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </ScrollView>
            {/* </SafeAreaView> - Removed to allow full screen header */ }

    <BottomMenu
        navigation={navigation}
        activeTab="Sleep"
        userName={userName}
        backgroundColor="#03174C"
    />
        </View >
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },

    headerGradient: {
        height: hp(220),
        paddingTop: hp(0),
        paddingHorizontal: spacing(20),
        paddingBottom: hp(0),
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: wp(375), // Ensure it matches the base design width scaled
        alignSelf: 'center', // Center it if the screen is wider
    },

    headerImage: {
        width: '100%',
        height: hp(140),
        marginBottom: hp(0),
        marginTop: hp(0),
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: hp(20),
    },

    headerTitle: {
        fontSize: fs(28),
        fontWeight: '700',
        color: '#E6E7F2',
        marginTop: hp(-80),
        marginBottom: hp(12),
        textAlign: 'center',
        letterSpacing: 0.3,
        fontFamily: 'HelveticaNeue',
    },
    headerSubtitle: {
        fontSize: fs(14),
        color: '#EBEAEC',
        opacity: 0.85,
        textAlign: 'center',
        lineHeight: fs(22),
        paddingHorizontal: spacing(30),
        fontWeight: '400',
        fontFamily: 'HelveticaNeue',
    },

    categoriesContainer: {
        marginVertical: hp(10),
        marginTop: -hp(54),
    },
    categoriesContent: {
        paddingHorizontal: spacing(20),
        justifyContent: 'space-between',
        flexGrow: 1,
    },

    categoryTab: {
        marginRight: spacing(15),
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryImage: {
        width: wp(65),
        height: hp(70),
    },

    /* ⭐ FEATURED CARD */
    featuredCard: {
        height: hp(220),
        marginHorizontal: spacing(20),
        marginBottom: hp(25),
        borderRadius: wp(12),
        overflow: 'hidden',
    },
    featuredImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    featuredContent: {
        padding: spacing(20),
        alignItems: 'center',
    },
    featuredTitle: {
        fontSize: fs(28),
        fontWeight: '700',
        color: '#FFD700',
        marginBottom: hp(8),
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    featuredSubtitle: {
        fontSize: fs(14),
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: hp(20),
        maxWidth: '80%',
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: hp(12),
        paddingHorizontal: spacing(30),
        borderRadius: wp(25),
        alignSelf: 'center',
    },
    startButtonText: {
        fontSize: fs(13),
        fontWeight: '600',
        color: '#3F414E',
    },

    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing(20),
        gap: spacing(15),
    },
    gridCard: {
        // Width set dynamically
        marginBottom: hp(15),
    },
    gridImageContainer: {
        aspectRatio: 1, // Square images look better and are more responsive
        width: '100%',
        borderRadius: wp(15),
        overflow: 'hidden',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    gridCardContent: {
        paddingVertical: hp(10),
    },
    gridCardTitle: {
        fontSize: fs(18),
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: hp(4),
    },
    gridCardSubtitle: {
        fontSize: fs(11),
        color: '#EBEBF5',
        opacity: 0.6,
        letterSpacing: 0.5,
        fontWeight: '600',
    },
});

export default Sleep;
