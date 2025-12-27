import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ScreenProps } from '../types';
const AudioDetails = ({ navigation, route }: ScreenProps<'AudioDetails'>) => {
    const defaultSession = {
        name: 'Introduction to Mindfulness',
        duration: '5 - 10 min',
    };
    const sessionData = typeof route?.params?.sessionId === 'string'
        ? defaultSession
        : (route?.params?.sessionId || defaultSession);
    const [selectedDuration, setSelectedDuration] = useState(10);
    const durations = [5, 10, 15];
    const handleStart = () => {
        navigation.navigate('AudioDetails2', { session: sessionData, duration: selectedDuration.toString() });
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#3F414E" />
                </TouchableOpacity>
                {}
                <Text style={styles.title}>{sessionData.name}</Text>
                {}
                <Text style={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua
                </Text>
                {}
                <View style={styles.durationSection}>
                    <Text style={styles.sectionTitle}>Pick a Duration</Text>
                    <View style={styles.durationButtons}>
                        {durations.map(duration => (
                            <TouchableOpacity
                                key={duration}
                                style={[
                                    styles.durationButton,
                                    selectedDuration === duration && styles.durationButtonSelected,
                                ]}
                                onPress={() => setSelectedDuration(duration)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.durationButtonText,
                                        selectedDuration === duration &&
                                        styles.durationButtonTextSelected,
                                    ]}
                                >
                                    {duration} min
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                {}
                <View style={styles.downloadSection}>
                    <Text style={styles.sectionTitle}>Download</Text>
                    <View style={styles.downloadCard}>
                        <View style={styles.downloadLeft}>
                            <View style={styles.playIconCircle}>
                                <Ionicons name="play" size={16} color="#FFFFFF" />
                            </View>
                            <Text style={styles.downloadDuration}>{selectedDuration} min</Text>
                        </View>
                        <TouchableOpacity activeOpacity={0.7}>
                            <Ionicons name="share-outline" size={24} color="#3F414E" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            {}
            <View style={styles.startButtonContainer}>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={handleStart}
                    activeOpacity={0.8}
                >
                    <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
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
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 100, 
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#3F414E',
        marginBottom: 16,
    },
    description: {
        fontSize: 14,
        fontWeight: '300',
        color: '#A1A4B2',
        lineHeight: 22,
        marginBottom: 30,
    },
    durationSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3F414E',
        marginBottom: 15,
    },
    durationButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    durationButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    durationButtonSelected: {
        backgroundColor: '#8E97FD',
        borderColor: '#8E97FD',
    },
    durationButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3F414E',
    },
    durationButtonTextSelected: {
        color: '#FFFFFF',
    },
    downloadSection: {
        marginBottom: 30,
    },
    downloadCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    downloadLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    playIconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3F414E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadDuration: {
        fontSize: 16,
        fontWeight: '500',
        color: '#3F414E',
    },
    startButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    startButton: {
        backgroundColor: '#8E97FD',
        borderRadius: 25,
        paddingVertical: 16,
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
export default AudioDetails;
