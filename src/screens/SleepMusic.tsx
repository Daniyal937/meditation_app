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
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../config/firebaseConfig';
import { getUserProfile } from '../services/authService';
import { setUserProfile as setUserProfileAction } from '../redux/slices/userSlice';
import { wp, hp, fs, spacing, getScreenDimensions } from '../utils/responsive';
import BottomMenu from '../components/BottomMenu';

import { ScreenProps, RootStackParamList } from '../types';
import { RootState } from '../redux/store';

const { width } = getScreenDimensions();
const cardWidth = (width - spacing(60)) / 2; // 2 columns with padding

const SleepMusic = ({ navigation, route }: ScreenProps<'SleepMusic'>) => {
    const dispatch = useDispatch();
    const userProfileFromRedux = useSelector((state: RootState) => state.user.profile);
    const [userName, setUserName] = useState(userProfileFromRedux?.name || 'User');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    if (userProfileFromRedux) {
                        setUserName(userProfileFromRedux.name);
                        return;
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
    const sleepMusicContent = [
        {
            id: 1,
            title: 'Night Island',
            duration: '45 MIN',
            type: 'SLEEP MUSIC',
            image: require('../../assets/images/sleep_music_01.png'),
            color: '#4A90E2',
        },
        {
            id: 2,
            title: 'Sweet Sleep',
            duration: '45 MIN',
            type: 'SLEEP MUSIC',
            image: require('../../assets/images/sleep_music_02.png'),
            color: '#8E97FD',
        },
        {
            id: 3,
            title: 'Good Night',
            duration: '45 MIN',
            type: 'SLEEP MUSIC',
            image: require('../../assets/images/sleep_music_03.png'),
            color: '#6CB28E',
        },
        {
            id: 4,
            title: 'Moon Clouds',
            duration: '45 MIN',
            type: 'SLEEP MUSIC',
            image: require('../../assets/images/sleep_music_04.png'),
            color: '#A5AFFF',
        },
        {
            id: 5,
            title: 'Sweet Sleep',
            duration: '45 MIN',
            type: 'SLEEP MUSIC',
            image: require('../../assets/images/sleep_music_05.png'),
            color: '#8E97FD',
        },
        {
            id: 6,
            title: 'Night Island',
            duration: '45 MIN',
            type: 'SLEEP MUSIC',
            image: require('../../assets/images/sleep_music_06.png'),
            color: '#4A90E2',
        },
        {
            id: 7,
            title: 'Good Night',
            duration: '45 MIN',
            type: 'SLEEP MUSIC',
            image: require('../../assets/images/sleep_music_07.png'),
            color: '#6CB28E',
        },
        {
            id: 8,
            title: 'Moon Clouds',
            duration: '45 MIN',
            type: 'SLEEP MUSIC',
            image: require('../../assets/images/sleep_music_08.png'),
            color: '#A5AFFF',
        },
    ];

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" backgroundColor="#03174C" />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={wp(24)} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Sleep Music</Text>
                    <View style={styles.headerPlaceholder} />
                </View>

                {/* Content Grid */}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={{
                        paddingHorizontal: spacing(20),
                        paddingBottom: hp(100),
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.gridContainer}>
                        {sleepMusicContent.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.gridCard}
                                activeOpacity={0.8}
                                onPress={() =>
                                    navigation.navigate('PlayOption', {
                                        content: {
                                            title: item.title,
                                            duration: item.duration,
                                            type: item.type,
                                            description: `Ease the mind into a restful night's sleep with these deep, ambient tones.`,
                                            favoriteCount: '24,234',
                                            listeningCount: '34,234',
                                            image: item.image,
                                        },
                                    })
                                }
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

                    {/* Bottom padding for navigation */}
                    <View style={{ height: hp(100) }} />
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Navigation */}
            <BottomMenu
                navigation={navigation}
                activeTab="Sleep"
                userName={userName}
                backgroundColor="#03174C"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#03174C',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing(20),
        paddingVertical: hp(15),
    },
    backButton: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fs(18),
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerPlaceholder: {
        width: wp(40),
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing(20),
        paddingTop: hp(10),
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing(15),
    },
    gridCard: {
        width: cardWidth,
        marginBottom: hp(15),
        borderRadius: wp(12),
        overflow: 'hidden',
    },
    gridImageContainer: {
        width: '100%',
        height: hp(120),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(14),
        overflow: 'hidden',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    gridCardContent: {
        padding: spacing(12),
    },
    gridCardTitle: {
        fontSize: fs(14),
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: hp(4),
    },
    gridCardSubtitle: {
        fontSize: fs(10),
        fontWeight: '400',
        color: '#FFFFFF',
        opacity: 0.7,
    },
});

export default SleepMusic;
