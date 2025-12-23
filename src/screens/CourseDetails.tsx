import React, { useState } from 'react';
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
import { wp, hp, fs, spacing } from '../utils/responsive';
import { ScreenProps } from '../types';
import { Session } from '../global';

const CourseDetails: React.FC<ScreenProps<'CourseDetails'>> = ({ navigation, route }) => {
    const [selectedVoice, setSelectedVoice] = useState('MALE');
    const [selectedSession, setSelectedSession] = useState<number | string>(1); // Default to first session

    // Course data - can be passed via route params or fetched from API
    const courseData = {
        title: 'Happy Morning',
        type: 'COURSE',
        description: "Ease the mind into a restful night's sleep with these deep, amblent tones.",
        favorites: 24234,
        listening: 34234,
        sessions: [
            { id: 1, name: 'Focus Attention', duration: '10 MIN' },
            { id: 2, name: 'Body Scan', duration: '5 MIN' },
            { id: 3, name: 'Making Happiness', duration: '3 MIN' },
        ],
    };

    const handlePlaySession = (session: Session): void => {
        setSelectedSession(session.id);

        // Navigate to audio player screen
        // navigation.navigate('AudioPlayer', { session });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Header Image */}
                <View style={styles.headerImageContainer}>
                    <Image
                        source={require('../../assets/images/course_header.png')}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                    {/* Header Buttons Overlay */}
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

                {/* Course Info Section */}
                <View style={styles.contentContainer}>
                    <Text style={styles.courseTitle}>{courseData.title}</Text>
                    <Text style={styles.courseType}>{courseData.type}</Text>
                    <Text style={styles.courseDescription}>{courseData.description}</Text>

                    {/* Stats Row */}
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

                    {/* Narrator Selection */}
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

                    {/* Session List */}
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
                                        name="play"
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
});

export default CourseDetails;
