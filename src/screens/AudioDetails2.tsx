import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image,
    ImageBackground,
    PanResponder,
    LayoutChangeEvent,
    GestureResponderEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { wp, hp, fs, spacing, isTablet } from '../utils/responsive';
import { useTheme } from '../context/ThemeContext';
import BottomMenu from '../components/BottomMenu';
import { ScreenProps } from '../types';
import { Session, Sound as SoundType, AudioStatus } from '../global';

const AudioDetails2 = ({ navigation, route }: ScreenProps<'AudioDetails2'>) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    // Session data (passed from previous screen or default)
    const defaultSession = {
        name: 'Mindfulness',
        category: 'Relax',
        duration: '6-15 min',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque fermentum, urna sit amet cursus vestibulum, ligula sapien cursus elit, nec suscipit quam velit',
        artist: 'Sam Wilson', // Ensure this is present
        location: 'San Fransisco',
        streams: '2.6',
    };

    const sessionData: Session = { ...defaultSession, ...route?.params?.session };
    const [showMiniPlayer, setShowMiniPlayer] = useState<boolean>(false);
    const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [status, setStatus] = useState<{ position: number; duration: number }>({ position: 0, duration: 1 });
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [seekPosition, setSeekPosition] = useState<number>(0);

    const barWidth = useRef(0);
    const statusRef = useRef(status);

    useEffect(() => {
        statusRef.current = status;
    }, [status]);



    // We need a ref for sound because PanResponder closure might capture old null sound
    const soundRef = useRef<Audio.Sound | undefined>(sound);
    useEffect(() => {
        soundRef.current = sound;
    }, [sound]);

    // CORRECTED PANRESPONDER LOGIC:
    const startPositionRef = useRef(0);

    const panResponderCorrect = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                setIsSeeking(true);
                startPositionRef.current = statusRef.current.position;
                setSeekPosition(startPositionRef.current);
            },
            onPanResponderMove: (evt, gestureState) => {
                if (barWidth.current > 0) {
                    const duration = statusRef.current.duration;
                    const diff = (gestureState.dx / barWidth.current) * duration;
                    const newPos = Math.min(Math.max(0, startPositionRef.current + diff), duration);
                    setSeekPosition(newPos);
                }
            },
            onPanResponderRelease: async (evt, gestureState) => {
                if (barWidth.current > 0 && soundRef.current) {
                    const duration = statusRef.current.duration;
                    const diff = (gestureState.dx / barWidth.current) * duration;
                    const newPos = Math.min(Math.max(0, startPositionRef.current + diff), duration);
                    await soundRef.current.setPositionAsync(newPos);
                }
                setIsSeeking(false);
            },
        })
    ).current;

    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

    const formatTime = (millis: number): string => {
        if (!millis) return '0:00';
        const minutes = Math.floor(millis / 60000);
        const seconds = Math.floor((millis % 60000) / 1000);
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    };

    const handlePlay = async () => {
        setShowMiniPlayer(true);
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        } else {
            if (sessionData.audioUrl) {
                try {
                    const { sound: newSound } = await Audio.Sound.createAsync(
                        { uri: sessionData.audioUrl },
                        { shouldPlay: true },
                        playbackStatus => {
                            if (playbackStatus.isLoaded) {
                                setStatus({
                                    position: playbackStatus.positionMillis,
                                    duration: playbackStatus.durationMillis || 1, // Avoid divide by zero
                                });
                                setIsPlaying(playbackStatus.isPlaying);
                                if (playbackStatus.didJustFinish) {
                                    setIsPlaying(false);
                                    navigation.navigate('Congratulations');
                                }
                            }
                        }
                    );
                    setSound(newSound);

                    // setIsPlaying(true); // Handled by status update
                } catch (error) {
                    console.error('Error loading sound', error);
                }
            } else {
                console.warn('No audio URL provided for this session');
            }
        }
    };

    // Calculate progress percentage
    const currentDisplayPosition = isSeeking ? seekPosition : status.position;
    const progressPercent = (currentDisplayPosition / status.duration) * 100;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar
                    barStyle={theme.colors.statusBar}
                    backgroundColor={theme.colors.background}
                />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.colors.surface }]} // Added background for better visibility? Or just standard icon.
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="arrow-back" size={fs(24)} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        Now Playing
                    </Text>
                    <TouchableOpacity style={styles.headerRightButton}>
                        <Ionicons name="heart-outline" size={fs(24)} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: hp(160) }]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hero Card Container */}
                    <View style={styles.heroCardContainer}>
                        {/* ... (Hero card uses image background, maybe text color inside needs care if overlay changes, but usually white text on image is fine) ... */}
                        <ImageBackground
                            source={require('../../assets/images/audio_details_bg.png')}
                            style={styles.heroCard}
                            imageStyle={{ borderRadius: wp(20) }}
                        >
                            <View style={styles.heroOverlay}>
                                {/* Text is now part of the background image */}
                                <View />

                                <View style={styles.heroBottomContent}>
                                    <View>
                                        <Text style={styles.categoryText}>
                                            {sessionData.category}
                                        </Text>
                                        <Text style={styles.heroSessionName}>
                                            {sessionData.name}
                                        </Text>
                                        <View style={styles.durationRow}>
                                            <Ionicons
                                                name="time-outline"
                                                size={fs(14)}
                                                color="#FFFFFF"
                                            />
                                            <Text style={styles.durationText}>
                                                {sessionData.duration}
                                            </Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.playButton}
                                        activeOpacity={0.8}
                                        onPress={handlePlay}
                                    >
                                        <Ionicons
                                            name={isPlaying ? 'pause' : 'play'}
                                            size={fs(24)}
                                            color="#3F414E"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>

                    {/* Meta Data */}
                    <View style={styles.metaDataContainer}>
                        <Text style={[styles.sessionTitle, { color: theme.colors.text }]}>
                            {sessionData.name}
                        </Text>
                        <Text style={[styles.sessionArtist, { color: theme.colors.textSecondary }]}>
                            By {sessionData.artist}
                        </Text>

                        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                            {sessionData.description}
                        </Text>
                    </View>

                    {/* Try This Exercise */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.tryExerciseHeader}>Try this exercise</Text>
                            <TouchableOpacity activeOpacity={0.7}>
                                <Text style={styles.seeAllText}>see all</Text>
                            </TouchableOpacity>
                        </View>
                        {/* Add content for "Try this exercise" here if needed, or leave empty as per design */}
                    </View>

                    {/* Bottom padding for navigation */}
                    <View style={{ height: hp(120) }} />
                </ScrollView>
            </SafeAreaView>

            {/* Bottom Navigation */}
            {!showMiniPlayer && (
                <BottomMenu navigation={navigation} activeTab="Meditate" userName="User" />
            )}

            {/* Mini Player */}
            {showMiniPlayer && (
                <View
                    style={[
                        styles.miniPlayerContainer,
                        {
                            backgroundColor: theme.colors.card,
                            borderTopColor: theme.colors.border,
                            paddingBottom: spacing(20) + insets.bottom,
                        },
                    ]}
                >
                    <Text style={[styles.miniPlayerLabel, { color: theme.colors.textSecondary }]}>
                        Now Playing
                    </Text>
                    <View style={styles.miniPlayerContent}>
                        <Image
                            source={require('../../assets/images/audio_details_bg.png')}
                            style={styles.miniPlayerImage}
                            resizeMode="cover"
                        />
                        <View style={styles.miniPlayerMainColumn}>
                            <Text
                                style={[styles.miniPlayerTitle, { color: theme.colors.text }]}
                                numberOfLines={1}
                            >
                                {sessionData.name}
                            </Text>

                            <View style={styles.miniPlayerProgressRow}>
                                <View style={{ flex: 1, justifyContent: 'center' }}>
                                    {/* Progress Bar Wrapper with increased hit slop */}
                                    <View
                                        style={{ height: hp(30), justifyContent: 'center' }}
                                        onLayout={e => {
                                            barWidth.current = e.nativeEvent.layout.width;
                                        }}
                                        {...panResponderCorrect.panHandlers}
                                    >
                                        <View
                                            style={[
                                                styles.progressBarContainer,
                                                { backgroundColor: theme.colors.border },
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    styles.progressBarFill,
                                                    {
                                                        width: `${progressPercent}%`,
                                                        backgroundColor: theme.colors.primary,
                                                    },
                                                ]}
                                            />
                                            {/* Hidden knob */}
                                            <View
                                                style={[
                                                    styles.progressBarKnob,
                                                    {
                                                        left: `${Math.max(0, progressPercent - 2)}%`,
                                                        backgroundColor: theme.colors.text,
                                                    },
                                                ]}
                                            />
                                        </View>
                                    </View>

                                    {/* Time */}
                                    <View style={styles.timeContainer}>
                                        <Text
                                            style={[
                                                styles.timeText,
                                                { color: theme.colors.textSecondary },
                                            ]}
                                        >
                                            {formatTime(currentDisplayPosition)}
                                        </Text>
                                        <Text
                                            style={[
                                                styles.timeText,
                                                { color: theme.colors.textSecondary },
                                            ]}
                                        >
                                            {formatTime(status.duration)}
                                        </Text>
                                    </View>
                                </View>

                                {/* Pause Button */}
                                <TouchableOpacity
                                    style={styles.miniPlayerPauseButton}
                                    onPress={handlePlay}
                                >
                                    <Ionicons
                                        name={isPlaying ? 'pause' : 'play'}
                                        size={fs(30)}
                                        color={theme.colors.text}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Controls */}
                            <View style={styles.miniPlayerBottomControls}>
                                <View style={styles.controlsGroup}>
                                    <TouchableOpacity>
                                        <Ionicons
                                            name="repeat"
                                            size={fs(22)}
                                            color={theme.colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons
                                            name="shuffle"
                                            size={fs(22)}
                                            color={theme.colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.controlsGroup}>
                                    <TouchableOpacity>
                                        <Ionicons
                                            name="play-skip-back"
                                            size={fs(22)}
                                            color={theme.colors.text}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Ionicons
                                            name="play-skip-forward"
                                            size={fs(22)}
                                            color={theme.colors.text}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing(20),
        paddingVertical: hp(15),
        marginTop: hp(20),
    },
    backButton: {
        width: wp(40),
        height: wp(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fs(24),
        fontWeight: '700',
        color: '#3F414E',
    },
    headerRightButton: {
        width: wp(40),
        height: wp(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing(20),
        paddingBottom: hp(140),
    },
    heroCardContainer: {
        width: '100%',
        height: isTablet() ? hp(450) : hp(320),
        maxHeight: isTablet() ? 500 : undefined,
        borderRadius: wp(20),
        marginBottom: hp(24),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp(4) },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    heroCard: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
    },
    heroOverlay: {
        flex: 1,
        padding: spacing(24),
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: wp(20),
    },
    heroBottomContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    categoryText: {
        fontSize: fs(12),
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: hp(4),
        textTransform: 'uppercase',
        opacity: 0.9,
    },
    heroSessionName: {
        fontSize: fs(28),
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: hp(8),
    },
    durationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing(4),
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: spacing(8),
        paddingVertical: hp(4),
        borderRadius: wp(12),
        alignSelf: 'flex-start',
    },
    durationText: {
        fontSize: fs(12),
        fontWeight: '500',
        color: '#FFFFFF',
    },
    playButton: {
        width: wp(50),
        height: wp(50),
        borderRadius: wp(25),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    metaDataContainer: {
        paddingHorizontal: spacing(20),
        marginTop: hp(10),
        marginBottom: hp(24),
    },
    sessionTitle: {
        fontSize: fs(34),
        fontWeight: '700',
        marginBottom: hp(6),
    },
    sessionArtist: {
        fontSize: fs(14),
        fontWeight: '500',
        marginBottom: hp(24),
        textTransform: 'uppercase',
        opacity: 0.7,
    },
    description: {
        fontSize: fs(16),
        fontWeight: '300',
        lineHeight: fs(24),
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(30),
    },
    artistSection: {
        flex: 1,
    },
    artistInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing(12),
    },
    artistAvatar: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: '#C4C4C4',
    },
    artistName: {
        fontSize: fs(20),
        fontWeight: '600',
        color: '#000000',
    },
    artistLocation: {
        fontSize: fs(12),
        fontWeight: '400',
        color: '#A1A4B2',
    },
    streamStats: {
        alignItems: 'flex-end',
    },
    streamCount: {
        fontSize: fs(20),
        fontWeight: '700',
        color: '#3F414E',
    },
    seeAllText: {
        fontSize: fs(14),
        color: '#8E97FD',
        fontWeight: '500',
    },
    miniPlayerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp(20),
        borderTopRightRadius: wp(20),
        padding: spacing(20),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: hp(-5),
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 20,
        paddingBottom: hp(40),
    },
    miniPlayerLabel: {
        fontSize: fs(14),
        color: '#A1A4B2',
        marginBottom: hp(15),
        fontWeight: '400',
    },
    miniPlayerContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    miniPlayerImage: {
        width: isTablet() ? wp(150) : wp(100),
        height: isTablet() ? wp(150) : wp(100),
        borderRadius: wp(15),
        marginRight: spacing(15),
    },
    miniPlayerMainColumn: {
        flex: 1,
    },
    miniPlayerTitle: {
        fontSize: fs(18),
        fontWeight: '700',
        color: '#3F414E',
        marginBottom: hp(0),
    },
    miniPlayerProgressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(8),
    },
    progressBarContainer: {
        height: hp(6),
        backgroundColor: '#F2F2F2',
        borderRadius: hp(3),
        position: 'relative',
        justifyContent: 'center',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#5F8595', // Muted Teal/Slate Blue
        borderRadius: hp(3),
    },
    progressBarKnob: {
        width: 0, // Hidden
        height: 0,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: fs(10),
        color: '#D9D9D9',
        fontWeight: '500',
    },
    miniPlayerPauseButton: {
        width: wp(45),
        height: wp(45),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing(15),
        transform: [{ translateY: -hp(5) }],
    },
    miniPlayerBottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(0),
        paddingRight: spacing(55),
    },
    controlsGroup: {
        flexDirection: 'row',
        gap: spacing(15),
        alignItems: 'center',
    },
    section: {
        marginTop: hp(30),
        paddingHorizontal: spacing(20),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(15),
    },
    tryExerciseHeader: {
        fontSize: fs(24),
        fontWeight: '700',
        color: '#3F414E',
    },
});

export default AudioDetails2;
