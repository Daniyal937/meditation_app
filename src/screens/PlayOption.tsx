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
    ImageBackground,
    Dimensions,
    Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, fs, spacing } from '../utils/responsive';
import { ScreenProps } from '../types';
const PlayOption = ({ navigation, route }: ScreenProps<'PlayOption'>) => {
    const insets = useSafeAreaInsets();
    const [isFavorite, setIsFavorite] = useState(false);
    const contentData = route?.params?.content || {
        title: 'Night Island',
        duration: '45 MIN',
        type: 'SLEEP MUSIC',
        description:
            "Ease the mind into a restful night's sleep with \n these deep, ambient tones.",
        favoriteCount: '24,234',
        listeningCount: '34,234',
        image: require('../../assets/images/night_island_new.png'),
    };
    const relatedContent = [
        {
            id: 1,
            title: 'Moon Clouds',
            duration: '45 MIN',
            type: 'SLEEP MUSIC',
            image: require('../../assets/images/moon_clouds.png'),
        },
        {
            id: 2,
            title: 'Sweet Sleep',
            duration: '45 MIN',
            type: 'SLEEP MUSIC',
            image: require('../../assets/images/sweet_sleep_v2.png'),
        },
    ];
    const HeaderButton = ({ onPress, iconName }: { onPress: () => void; iconName: string }) => (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.headerButton,
                pressed && { backgroundColor: '#FFFFFF' },
            ]}
        >
            {({ pressed }) => (
                <Ionicons name={iconName as any} size={24} color={pressed ? '#000000' : '#FFFFFF'} />
            )}
        </Pressable>
    );
    const renderHeaderButtons = () => (
        <View style={styles.headerButtons}>
            <HeaderButton onPress={() => navigation.goBack()} iconName="arrow-back" />
            <View style={styles.headerRightButtons}>
                <HeaderButton
                    onPress={() => setIsFavorite(!isFavorite)}
                    iconName={isFavorite ? 'heart' : 'heart-outline'}
                />
                <HeaderButton onPress={() => { }} iconName="download-outline" />
            </View>
        </View>
    );
    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {}
                <TouchableOpacity
                    style={styles.nightIslandWrapper}
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate('SleepMusic', {})}
                >
                    <ImageBackground
                        source={contentData.image}
                        style={styles.fullScreenHeroImage}
                        resizeMode="cover"
                    />
                    <SafeAreaView style={styles.headerOverlay}>
                        {renderHeaderButtons()}
                    </SafeAreaView>
                </TouchableOpacity>
                {}
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{contentData.title}</Text>
                    <Text style={styles.subtitle}>
                        {contentData.duration} • {contentData.type}
                    </Text>
                    <Text style={styles.description}>{contentData.description}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="heart" size={18} color="#8E97FD" />
                            <Text style={styles.statText}>
                                {contentData.favoriteCount} Favorite
                            </Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="headset" size={18} color="#8E97FD" />
                            <Text style={styles.statText}>
                                {contentData.listeningCount} Listening
                            </Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                </View>
                {}
                <View style={styles.relatedContainer}>
                    <Text style={styles.relatedTitle}>Related</Text>
                    <View style={styles.relatedGrid}>
                        {relatedContent.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.relatedCard}
                                activeOpacity={0.7}
                                onPress={() => navigation.navigate('SleepMusic', {})}
                            >
                                <View style={styles.relatedImageContainer}>
                                    <Image
                                        source={item.image}
                                        style={styles.relatedImage}
                                        resizeMode="cover"
                                    />
                                </View>
                                <View style={styles.relatedCardContent}>
                                    <Text style={styles.relatedCardTitle}>{item.title}</Text>
                                    <Text style={styles.relatedCardSubtitle}>
                                        {item.duration} • {item.type}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={{ height: hp(150) }} />
            </ScrollView>
            {}
            <View
                style={[styles.playButtonContainer, { paddingBottom: spacing(20) + insets.bottom }]}
                pointerEvents="box-none"
            >
                <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => {
                        navigation.navigate('SleepMusic', {});
                    }}
                >
                    <Text style={styles.playButtonText}>PLAY</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
export default PlayOption;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#03174C',
    },
    nightIslandWrapper: {
        width: '100%',
        position: 'relative',
    },
    fullScreenHeroImage: {
        width: '100%',
        height: hp(280),
        borderBottomLeftRadius: wp(20),
        borderBottomRightRadius: wp(20),
        overflow: 'hidden',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing(20),
        paddingTop: hp(50),
        paddingBottom: hp(20),
    },
    headerButton: {
        width: wp(58),
        height: wp(58),
        borderRadius: wp(29),
        backgroundColor: '#03174C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRightButtons: {
        flexDirection: 'row',
        gap: spacing(10),
    },
    heroContainer: {
        paddingHorizontal: spacing(20),
        marginBottom: hp(25),
    },
    heroGradient: {
        height: hp(200),
        borderRadius: wp(12),
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        width: '80%',
        height: '80%',
    },
    detailsContainer: {
        paddingHorizontal: spacing(20),
    },
    title: {
        fontSize: fs(28),
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: hp(8),
    },
    subtitle: {
        fontSize: fs(12),
        color: '#B0B3C1',
        marginBottom: hp(16),
    },
    description: {
        fontSize: fs(14),
        color: '#FFFFFF',
        lineHeight: fs(22),
        marginBottom: hp(20),
        opacity: 0.9,
    },
    statsRow: {
        flexDirection: 'row',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing(8),
        width: '50%',
    },
    statText: {
        fontSize: fs(12),
        color: '#B0B3C1',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: hp(20),
        marginBottom: hp(10),
    },
    relatedContainer: {
        paddingHorizontal: spacing(20),
    },
    relatedTitle: {
        fontSize: fs(18),
        color: '#FFFFFF',
        marginBottom: hp(15),
        marginTop: 0,
    },
    relatedGrid: {
        flexDirection: 'row',
        gap: spacing(15),
    },
    relatedCard: {
        flex: 1,
        borderRadius: wp(12),
        overflow: 'hidden',
    },
    relatedImageContainer: {
        height: hp(120),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: wp(10),
        overflow: 'hidden',
    },
    relatedImage: {
        width: '100%',
        height: '100%',
    },
    relatedCardContent: {
        padding: spacing(12),
    },
    relatedCardTitle: {
        fontSize: fs(14),
        fontWeight: '700',
        color: '#FFFFFF',
    },
    relatedCardSubtitle: {
        fontSize: fs(10),
        color: '#FFFFFF',
        opacity: 0.7,
    },
    playButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacing(20),
        backgroundColor: '#03174C',
    },
    playButton: {
        backgroundColor: '#8E97FD',
        paddingVertical: hp(16),
        borderRadius: wp(30),
        alignItems: 'center',
    },
    playButtonText: {
        fontSize: fs(16),
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
