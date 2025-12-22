import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Image,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fs, hp, wp, spacing } from '../utils/responsive'; // Assuming these exist based on other files

const Congratulations = ({ navigation }) => {
    const emojiImages = [
        require('../../assets/images/emoji_1.png'),
        require('../../assets/images/emoji_2.png'),
        require('../../assets/images/emoji_3.png'),
        require('../../assets/images/emoji_4.png'),
    ];

    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const scaleAnims = useRef(emojiImages.map(() => new Animated.Value(1))).current;

    const handleEmojiPress = (index) => {
        setSelectedEmoji(index);
        scaleAnims.forEach((anim, i) => {
            Animated.spring(anim, {
                toValue: i === index ? 1.3 : 1, // Increase size
                useNativeDriver: true,
                friction: 5,
            }).start();
        });
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header with Close Button */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="close" size={fs(24)} color="#3F414E" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Graphic - Now using Image Asset */}
                <View style={styles.graphicContainer}>
                    <Image
                        source={require('../../assets/images/congratulations_logo.png')}
                        style={styles.congratulationsImage}
                        resizeMode="contain"
                    />
                </View>

                {/* Text */}
                <Text style={styles.title}>Congratulations!</Text>
                <Text style={styles.subtitle}>You have completed the session</Text>

                {/* Feedback Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>How do you feel after this session?</Text>
                    <View style={styles.emojisRow}>
                        {emojiImages.map((img, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleEmojiPress(index)}
                                activeOpacity={0.7}
                            >
                                <Animated.View style={[
                                    styles.emojiButton,
                                    { transform: [{ scale: scaleAnims[index] }] }
                                ]}>
                                    <Image source={img} style={styles.emojiImage} resizeMode="contain" />
                                </Animated.View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: spacing(20),
        paddingVertical: hp(20),
    },
    closeButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#FFFFFF', // Or transparent
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: spacing(20),
    },
    graphicContainer: {
        marginBottom: -hp(40),
    },
    congratulationsImage: {
        width: wp(300),
        height: wp(300),
        marginTop: hp(10),
    },
    title: {
        fontSize: fs(28),
        fontWeight: '700',
        color: '#3F414E',
        marginBottom: hp(10),
        textAlign: 'center',
    },
    subtitle: {
        fontSize: fs(16),
        color: '#A1A4B2',
        marginBottom: hp(40),
        textAlign: 'center',
    },
    card: {
        width: '100%',
        backgroundColor: '#F2F3F7', // Light grey/blue background
        borderRadius: wp(20),
        padding: spacing(24),
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: fs(18),
        fontWeight: '700',
        color: '#3F414E',
        marginBottom: hp(24),
        textAlign: 'center',
    },
    emojisRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: spacing(10),
    },
    emojiButton: {
        width: wp(50),
        height: wp(50),
        justifyContent: 'center',
        alignItems: 'center',
    },
    emojiImage: {
        width: '100%',
        height: '100%',
    },
});

export default Congratulations;
