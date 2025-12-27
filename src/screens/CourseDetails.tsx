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
    Alert,
    PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio } from 'expo-av';
import { wp, hp, fs, spacing, isTablet } from '../utils/responsive';
import { ScreenProps } from '../types';
import { useTheme } from '../context/ThemeContext';

const CourseDetails = ({ navigation, route }: ScreenProps<'CourseDetails'>) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [selectedVoice, setSelectedVoice] = useState('MALE');
    const [selectedSession, setSelectedSession] = useState<number | string>(1);

    // Audio State
    const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [status, setStatus] = useState<{ position: number; duration: number }>({ position: 0, duration: 1 });
    const [showMiniPlayer, setShowMiniPlayer] = useState<boolean>(false);
    const [currentSessionName, setCurrentSessionName] = useState<string>('');
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [seekPosition, setSeekPosition] = useState<number>(0);

    const barWidth = useRef(0);
    const statusRef = useRef(status);
    const soundRef = useRef<Audio.Sound | undefined>(sound);
    const startPositionRef = useRef(0);

    const courseData = {
        title: 'Happy Morning',
        type: 'COURSE',
        description: "Ease the mind into a restful night's sleep with these deep, amblent tones.",
        favorites: 24234,
        listening: 34234,
        sessions: [
            {
                id: 1,
                name: 'Focus Attention',
                duration: '10 MIN',
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
            },
            {
                id: 2,
                name: 'Body Scan',
                duration: '5 MIN',
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3'
            },
            {
                id: 3,
                name: 'Making Happiness',
                duration: '3 MIN',
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3'
            },
        ],
    };

    // Refs synchronization
    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    useEffect(() => {
        soundRef.current = sound;
    }, [sound]);

    // Cleanup sound on unmount or change
    useEffect(() => {
        return sound
            ? () => {
                sound.unloadAsync();
            }
            : undefined;
    }, [sound]);

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

    const formatTime = (millis: number): string => {
        if (!millis) return '0:00';
        const minutes = Math.floor(millis / 60000);
        const seconds = Math.floor((millis % 60000) / 1000);
        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    };


    const handlePlaySession = async (session: typeof courseData.sessions[0]) => {
        setSelectedSession(session.id);
        setCurrentSessionName(session.name);
        setShowMiniPlayer(true);

        try {
            // Unload previous sound if exists
            if (sound) {
                await sound.unloadAsync();
            }

            if (session.audioUrl) {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: session.audioUrl },
                    { shouldPlay: true },
                    playbackStatus => {
                        if (playbackStatus.isLoaded) {
                            setStatus({
                                position: playbackStatus.positionMillis,
                                duration: playbackStatus.durationMillis || 1,
                            });
                            setIsPlaying(playbackStatus.isPlaying);
                            if (playbackStatus.didJustFinish) {
                                setIsPlaying(false);
                            }
                        }
                    }
                );
                setSound(newSound);
                setIsPlaying(true);
            } else {
                Alert.alert('No Audio', 'No audio URL found for this session.');
            }
        } catch (error) {
            console.error('Error playing session:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            Alert.alert('Error', `Could not play audio: ${errorMessage}`);
        }
    };

    const handlePlayPause = async () => {
        if (sound) {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        }
    };

    const currentDisplayPosition = isSeeking ? seekPosition : status.position;
    const progressPercent = (currentDisplayPosition / status.duration) * 100;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={{ flex: 1 }}>
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: showMiniPlayer ? hp(180) : hp(20) }}
                >
                    {/* Header Image */}
                    <View style={styles.headerImageContainer}>
                        <Image
                            source={require('../../assets/images/course_header.png')}
                            style={styles.headerImage}
                            resizeMode="cover"
                        />
                        {/* Overlay Header */}
                        <View style={styles.headerOverlay}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="chevron-back" size={fs(24)} color="#3F414E" />
                            </TouchableOpacity>
                            <View style={styles.headerRightButtons}>
                                <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                                    <Ionicons name="heart-outline" size={fs(24)} color="#3F414E" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconButton} activeOpacity={0.8}>
                                    <Ionicons name="download-outline" size={fs(24)} color="#3F414E" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Content */}
                    <View style={styles.contentContainer}>
                        <Text style={styles.courseTitle}>{courseData.title}</Text>
                        <Text style={styles.courseType}>{courseData.type}</Text>
                        <Text style={styles.courseDescription}>{courseData.description}</Text>

                        {/* Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Ionicons name="heart" size={fs(16)} color="#FF84A7" />
                                <Text style={styles.statText}>
                                    {courseData.favorites.toLocaleString()} Favorite
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Ionicons name="headset" size={fs(16)} color="#7FD2F7" />
                                <Text style={styles.statText}>
                                    {courseData.listening.toLocaleString()} Listening
                                </Text>
                            </View>
                        </View>

                        {/* Narrator */}
                        <View style={styles.narratorSection}>
                            <Text style={styles.sectionTitle}>Pick a Narrator</Text>
                            <View style={styles.narratorButtons}>
                                <TouchableOpacity
                                    style={styles.narratorButton}
                                    onPress={() => setSelectedVoice('MALE')}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.narratorButtonText,
                                            selectedVoice === 'MALE' &&
                                            styles.narratorButtonTextSelected,
                                        ]}
                                    >
                                        MALE VOICE
                                    </Text>
                                    {selectedVoice === 'MALE' && (
                                        <View style={styles.narratorUnderline} />
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.narratorButton}
                                    onPress={() => setSelectedVoice('FEMALE')}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.narratorButtonText,
                                            selectedVoice === 'FEMALE' &&
                                            styles.narratorButtonTextSelected,
                                        ]}
                                    >
                                        FEMALE VOICE
                                    </Text>
                                    {selectedVoice === 'FEMALE' && (
                                        <View style={styles.narratorUnderline} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sessions List */}
                        <View style={styles.sessionSection}>
                            {courseData.sessions.map(session => (
                                <TouchableOpacity
                                    key={session.id}
                                    style={styles.sessionItem}
                                    onPress={() => handlePlaySession(session)}
                                    activeOpacity={0.7}
                                >
                                    <View
                                        style={[
                                            styles.playButton,
                                            selectedSession === session.id
                                                ? styles.playButtonSelected
                                                : styles.playButtonUnselected,
                                        ]}
                                    >
                                        <Ionicons
                                            name={selectedSession === session.id && isPlaying ? "pause" : "play"}
                                            size={fs(20)}
                                            color={
                                                selectedSession === session.id ? '#FFFFFF' : '#A1A4B2'
                                            }
                                        />
                                    </View>
                                    <View style={styles.sessionInfo}>
                                        <Text style={styles.sessionName}>{session.name}</Text>
                                        <Text style={styles.sessionDuration}>{session.duration}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Mini Player */}
                {showMiniPlayer && (
                    <View
                        style={[
                            styles.miniPlayerContainer,
                            {
                                borderTopColor: theme.colors.border,
                                paddingBottom: spacing(20) + insets.bottom,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: -2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 4,
                                elevation: 5,
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
                                    {currentSessionName}
                                </Text>
                                <View style={styles.miniPlayerProgressRow}>
                                    <View style={{ flex: 1, justifyContent: 'center' }}>
                                        {/* Progress Bar with PanResponder */}
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
                                                {/* Knob */}
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
                                        {/* Time Text */}
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
                                    {/* Play/Pause Button */}
                                    <TouchableOpacity
                                        style={styles.miniPlayerPauseButton}
                                        onPress={handlePlayPause}
                                    >
                                        <Ionicons
                                            name={isPlaying ? 'pause' : 'play'}
                                            size={fs(30)}
                                            color={theme.colors.text}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/* Bottom Controls */}
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    headerImageContainer: {
        width: '100%',
        height: hp(250),
        backgroundColor: '#F5F5F5',
        borderBottomLeftRadius: wp(20),
        borderBottomRightRadius: wp(20),
        overflow: 'hidden',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing(20),
        paddingTop: hp(40),
    },
    backButton: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp(2) },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerRightButtons: {
        flexDirection: 'row',
        gap: spacing(12),
    },
    iconButton: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp(2) },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contentContainer: {
        padding: spacing(20),
    },
    courseTitle: {
        fontSize: fs(34),
        fontWeight: '700',
        color: '#3F414E',
        marginBottom: hp(8),
        fontFamily: 'HelveticaNeue',
    },
    courseType: {
        fontSize: fs(14),
        fontWeight: '500',
        color: '#A1A4B2',
        letterSpacing: 1,
        marginBottom: hp(12),
    },
    courseDescription: {
        fontSize: fs(16),
        fontWeight: '300',
        color: '#A1A4B2',
        lineHeight: fs(22),
        marginBottom: hp(20),
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: hp(30),
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: spacing(20),
        flex: 1,
    },
    statText: {
        fontSize: fs(12),
        fontWeight: '400',
        color: '#A1A4B2',
        marginLeft: spacing(6),
    },
    narratorSection: {
        marginBottom: hp(30),
    },
    sectionTitle: {
        fontSize: fs(20),
        fontWeight: '600',
        color: '#3F414E',
        marginBottom: hp(15),
    },
    narratorButtons: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    narratorButton: {
        flex: 1,
        paddingVertical: hp(12),
        paddingBottom: hp(8),
        alignItems: 'center',
    },
    narratorUnderline: {
        position: 'absolute',
        bottom: -1,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#8E97FD',
    },
    narratorButtonText: {
        fontSize: fs(14),
        fontWeight: '400',
        color: '#A1A4B2',
        letterSpacing: 0.5,
    },
    narratorButtonTextSelected: {
        color: '#8E97FD',
    },
    sessionSection: {
        gap: hp(15),
    },
    sessionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(12),
    },
    playButton: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing(15),
    },
    playButtonSelected: {
        backgroundColor: '#8E97FD',
    },
    playButtonUnselected: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    sessionInfo: {
        flex: 1,
    },
    sessionName: {
        fontSize: fs(16),
        fontWeight: '600',
        color: '#3F414E',
        marginBottom: hp(4),
    },
    sessionDuration: {
        fontSize: fs(12),
        fontWeight: '400',
        color: '#A1A4B2',
    },

    // Mini Player Styles
    miniPlayerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: wp(20),
        borderTopRightRadius: wp(20),
        padding: spacing(20),
        borderTopWidth: 1,
    },
    miniPlayerLabel: {
        fontSize: fs(14),
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
        marginBottom: hp(0),
    },
    miniPlayerProgressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(8),
    },
    progressBarContainer: {
        height: hp(6),
        borderRadius: hp(3),
        position: 'relative',
        justifyContent: 'center',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: hp(3),
    },
    progressBarKnob: {
        width: 0,
        height: 0,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timeText: {
        fontSize: fs(10),
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
});

export default CourseDetails;
