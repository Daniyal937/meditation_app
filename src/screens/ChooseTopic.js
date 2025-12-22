import React, { useState } from 'react';
import {

    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    ImageBackground,
    Image,
} from 'react-native';
import { wp, hp, fs, spacing } from '../utils/responsive';

const ChooseTopic = ({ navigation }) => {
    const [selectedTopics, setSelectedTopics] = useState([]);

    // Topic data matching Figma design
    const topics = [
        { id: 1, name: 'Reduce Stress', color: '#8E97FD', height: hp(210), image: require('../../assets/images/topic_reduce_stress.png') },
        { id: 2, name: 'Improve Performance', color: '#FA6E5A', height: hp(170), image: require('../../assets/images/topic_improve_performance.png') },
        { id: 3, name: 'Increase Happiness', color: '#FEB18F', height: hp(160), image: require('../../assets/images/topic_increase_happiness.png') },
        { id: 4, name: 'Reduce Anxiety', color: '#FFCF86', height: hp(210), image: require('../../assets/images/topic_reduce_anxiety.png') },
        { id: 5, name: 'Personal Growth', color: '#6CB28E', height: hp(210), image: require('../../assets/images/topic_personal_growth.png') },
        { id: 6, name: 'Better Sleep', color: '#4E5567', height: hp(180), image: require('../../assets/images/topic_better_sleep.png'), backgroundImage: require('../../assets/images/better_sleep_card_bg.png') },
        { id: 7, name: 'Improve Focus', color: '#6D9EEB', height: hp(170), image: require('../../assets/images/topic_improve_focus.png') },
        { id: 8, name: 'Build Confidence', color: '#E8A5C5', height: hp(210), image: require('../../assets/images/topic_build_confidence.png') },
    ];

    const handleTopicPress = (topicId, topicName) => {
        // Navigate to Reminders screen with selected topic
        navigation.navigate('Reminders', {
            selectedTopic: topicName,
            topicId: topicId
        });
    };

    const renderTopicCard = (topic) => {
        // Special rendering for Better Sleep card with background image
        if (topic.id === 6 && topic.backgroundImage) {
            return (
                <TouchableOpacity
                    key={topic.id}
                    style={[
                        styles.topicCard,
                        {
                            height: topic.height,
                            backgroundColor: 'transparent',
                            padding: 0, // Remove padding to allow background to fill entire card
                        }
                    ]}
                    onPress={() => handleTopicPress(topic.id, topic.name)}
                    activeOpacity={0.8}
                >
                    <ImageBackground
                        source={topic.backgroundImage}
                        style={styles.cardBackgroundImage}
                        resizeMode="stretch"
                    >
                        {topic.image && (
                            <Image
                                source={topic.image}
                                style={styles.cardInternalImageBetterSleep}
                                resizeMode="contain"
                            />
                        )}
                    </ImageBackground>
                </TouchableOpacity>
            );
        }

        // Default rendering for other cards
        return (
            <TouchableOpacity
                key={topic.id}
                style={[
                    styles.topicCard,
                    {
                        backgroundColor: topic.color,
                        height: topic.height,
                    }
                ]}
                onPress={() => handleTopicPress(topic.id, topic.name)}
                activeOpacity={0.8}
            >
                {topic.image && (
                    <Image
                        source={topic.image}
                        style={
                            topic.id === 2 ? styles.cardInternalImageCentered :
                                (topic.id === 3 || topic.id === 8) ? styles.cardInternalImageFullWidth :
                                    topic.id === 4 ? styles.cardInternalImageCenteredSmallMargin :
                                        styles.cardInternalImage
                        }
                        resizeMode="contain"
                    />
                )}
                <Text style={styles.topicText}>{topic.name}</Text>
            </TouchableOpacity>
        );
    };

    const leftColumnTopics = topics.filter((_, index) => index % 2 === 0);
    const rightColumnTopics = topics.filter((_, index) => index % 2 !== 0);

    return (
        <ImageBackground
            source={require('../../assets/images/choose-topic-background.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <Text style={styles.title}>What Brings you{'\n'}to Silent Moon?</Text>
                        <Text style={styles.subtitle}>choose a topic to focus on</Text>
                    </View>

                    {/* Topic Grid */}
                    <View style={styles.masonryContainer}>
                        {/* Left Column */}
                        <View style={styles.column}>
                            {leftColumnTopics.map(renderTopicCard)}
                        </View>
                        {/* Right Column */}
                        <View style={styles.column}>
                            {rightColumnTopics.map(renderTopicCard)}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        paddingBottom: hp(10),
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing(20),
        paddingBottom: hp(40),
    },
    header: {
        marginTop: hp(20),
        marginBottom: hp(30),
    },
    title: {
        fontSize: fs(28),
        fontWeight: '700',
        color: '#3F414E',
        marginBottom: hp(12),
        lineHeight: fs(36),
    },
    subtitle: {
        fontSize: fs(16),
        fontWeight: '300',
        color: '#A1A4B2',
    },
    masonryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        width: '48%',
    },
    topicCard: {
        width: '100%',
        borderRadius: wp(12),
        marginBottom: hp(20),
        padding: spacing(16),
        justifyContent: 'flex-end',
        elevation: 3,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: hp(2) },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    cardBackgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    cardInternalImage: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: hp(30), // Leave space for text
    },
    cardInternalImageCentered: {
        position: 'absolute',
        top: hp(10),
        alignSelf: 'center',
        width: '80%',
        height: '70%',
    },
    cardInternalImageCenteredSmallMargin: {
        position: 'absolute',
        top: hp(5),
        alignSelf: 'center',
        width: '80%',
        height: '70%',
    },
    cardInternalImageFullWidth: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: hp(30),
        width: '100%',
    },
    cardInternalImageBetterSleep: {
        position: 'absolute',
        top: hp(10),
        alignSelf: 'center',
        width: '100%',
        height: '60%',
    },
    topicText: {
        fontSize: fs(16),
        fontWeight: '600',
        color: '#FFFFFF',
        lineHeight: fs(22),
    },
});

export default ChooseTopic;
