import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    PanResponder,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { wp, hp, fs, spacing } from '../utils/responsive';
import { useTheme } from '../context/ThemeContext';
import { ScreenProps } from '../types';

const MusicPlayer = ({ navigation, route }: ScreenProps<'MusicPlayer'>) => {
    const { theme } = useTheme();
    const { song } = route.params;

    // Audio State
    const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [status, setStatus] = useState<{ position: number; duration: number }>({ position: 0, duration: 1 });
    const [isSeeking, setIsSeeking] = useState<boolean>(false);
    const [seekPosition, setSeekPosition] = useState<number>(0);

    const barWidth = useRef(0);
    const statusRef = useRef(status);
    const soundRef = useRef<Audio.Sound | undefined>(sound);
    const startPositionRef = useRef(0);

    useEffect(() => {
        statusRef.current = status;
    }, [status]);

    useEffect(() => {
        soundRef.current = sound;
    }, [sound]);

    useEffect(() => {
        loadAudio();
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, []);

    const loadAudio = async () => {
        try {
            if (song.audioUrl) {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: song.audioUrl },
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
                Alert.alert('Error', 'No audio URL provided for this song.');
            }
        } catch (error) {
            console.error('Error loading sound', error);
            Alert.alert('Error', 'Unable to load audio file.');
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

    const panResponder = useRef(
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

    const currentDisplayPosition = isSeeking ? seekPosition : status.position;
    const progressPercent = (currentDisplayPosition / status.duration) * 100;

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle={theme.colors.statusBar} />

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: '#F2F2F2' }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="close" size={fs(24)} color="#3F414E" />
                    </TouchableOpacity>
                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#B6B8BF' }]}>
                            <Ionicons name="heart-outline" size={fs(24)} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.iconButton, { backgroundColor: '#B6B8BF' }]}>
                            <Ionicons name="download-outline" size={fs(24)} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    <Text style={styles.title}>{song.title}</Text>
                    <Text style={styles.artist}>{song.artist}</Text>

                    {/* Album Art */}
                    <View style={styles.albumArtContainer}>
                        <ImageBackground
                            source={song.image}
                            style={styles.albumArt}
                            imageStyle={{ borderRadius: wp(180) }} // Circle
                        />
                    </View>
                </View>

                {/* Player Controls */}
                <View style={styles.playerControls}>
                    <View style={styles.progressContainer}>
                        <View
                            style={{ height: hp(30), justifyContent: 'center' }}
                            onLayout={e => {
                                barWidth.current = e.nativeEvent.layout.width;
                            }}
                            {...panResponder.panHandlers}
                        >
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                                <View
                                    style={[
                                        styles.knob,
                                        { left: `${Math.max(0, progressPercent - 2)}%` }
                                    ]}
                                />
                            </View>
                        </View>
                        <View style={styles.timeRow}>
                            <Text style={styles.timeText}>{formatTime(currentDisplayPosition)}</Text>
                            <Text style={styles.timeText}>{formatTime(status.duration)}</Text>
                        </View>
                    </View>

                    <View style={styles.controlsRow}>
                        <TouchableOpacity>
                            <Ionicons name="shuffle" size={fs(24)} color="#A1A4B2" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="play-back" size={fs(40)} color="#A1A4B2" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.playPauseButton}
                            onPress={handlePlayPause}
                        >
                            <Ionicons
                                name={isPlaying ? "pause" : "play"}
                                size={fs(30)}
                                color="#FFFFFF"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="play-forward" size={fs(40)} color="#A1A4B2" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Ionicons name="repeat" size={fs(24)} color="#A1A4B2" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing(20),
        marginTop: hp(20),
        alignItems: 'center',
    },
    backButton: {
        width: wp(55),
        height: wp(55),
        borderRadius: wp(27.5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerButtons: {
        flexDirection: 'row',
        gap: spacing(15),
    },
    iconButton: {
        width: wp(55),
        height: wp(55),
        borderRadius: wp(27.5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        marginTop: hp(30),
    },
    title: {
        fontSize: fs(34),
        fontWeight: 'bold',
        color: '#3F414E',
        marginBottom: hp(10),
    },
    artist: {
        fontSize: fs(14),
        color: '#A1A4B2',
        fontWeight: '500',
        textTransform: 'uppercase',
        marginBottom: hp(50),
    },
    albumArtContainer: {
        width: wp(300),
        height: wp(300),
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    albumArt: {
        width: '100%',
        height: '100%',
    },
    playerControls: {
        position: 'absolute',
        bottom: hp(50),
        left: 0,
        right: 0,
        paddingHorizontal: spacing(20),
    },
    progressContainer: {
        marginBottom: hp(50),
    },
    progressBarBg: {
        height: hp(6),
        backgroundColor: '#E1E1E5',
        borderRadius: hp(3),
        position: 'relative',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3F414E',
        borderRadius: hp(3),
    },
    knob: {
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
        backgroundColor: '#3F414E',
        position: 'absolute',
        top: -hp(3),
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(10),
    },
    timeText: {
        fontSize: fs(16),
        color: '#3F414E',
        fontWeight: '500',
    },
    controlsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing(10),
    },
    playPauseButton: {
        width: wp(80),
        height: wp(80),
        borderRadius: wp(40),
        backgroundColor: '#3F414E',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#3F414E',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
});

export default MusicPlayer;
