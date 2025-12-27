import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { wp, hp, fs, spacing } from '../utils/responsive';
import BottomMenu from '../components/BottomMenu';
import { ScreenProps } from '../types';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const GAP = spacing(15);
const ITEM_WIDTH = (width - spacing(40) - GAP) / COLUMN_COUNT;

const SONGS = [
    {
        id: 1,
        title: 'Night Island',
        category: 'Sleep Music',
        image: require('../../assets/images/night_island_new.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 2,
        title: 'Sweet Sleep',
        category: 'Sleep Music',
        image: require('../../assets/images/sweet_sleep_new.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 3,
        title: 'Good Night',
        category: 'Sleep Music',
        image: require('../../assets/images/sleep_music_01.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 4,
        title: 'Moon Clouds',
        category: 'Sleep Music',
        image: require('../../assets/images/moon_clouds.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 5,
        title: 'Sweet Dreams',
        category: 'Sleep Music',
        image: require('../../assets/images/sleep_music_02.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 6,
        title: 'Calm Night',
        category: 'Sleep Music',
        image: require('../../assets/images/sleep_music_03.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 7,
        title: 'Deep Sleep',
        category: 'Sleep Music',
        image: require('../../assets/images/sleep_music_04.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 8,
        title: 'Relax Mind',
        category: 'Sleep Music',
        image: require('../../assets/images/sleep_music_05.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 9,
        title: 'Peaceful',
        category: 'Sleep Music',
        image: require('../../assets/images/sleep_music_06.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 10,
        title: 'Soft Sound',
        category: 'Sleep Music',
        image: require('../../assets/images/sleep_music_07.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 11,
        title: 'Dreamy',
        category: 'Sleep Music',
        image: require('../../assets/images/sleep_music_08.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
        duration: '45 MIN',
        artist: 'Sleepy Cat',
    },
    {
        id: 12,
        title: 'Focus Flow',
        category: 'Focus',
        image: require('../../assets/images/focus_bg.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
        duration: '45 MIN',
        artist: 'Focus Team',
    },
    {
        id: 13,
        title: 'Happy Vibes',
        category: 'Happiness',
        image: require('../../assets/images/happiness_bg.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
        duration: '45 MIN',
        artist: 'Happy Team',
    },
    {
        id: 14,
        title: 'Ocean Calm',
        category: 'Relax',
        image: require('../../assets/images/ocean_moon_card_bg.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
        duration: '45 MIN',
        artist: 'Relax Team',
    },
    {
        id: 15,
        title: 'Night Sky',
        category: 'Relax',
        image: require('../../assets/images/topic_better_sleep.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
        duration: '45 MIN',
        artist: 'Relax Team',
    },
    {
        id: 16,
        title: 'Morning Sun',
        category: 'Relax',
        image: require('../../assets/images/topic_increase_happiness.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
        duration: '10 MIN',
        artist: 'Morning Team',
    },
    {
        id: 17,
        title: 'Zen Garden',
        category: 'Meditate',
        image: require('../../assets/images/topic_reduce_stress.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Reusing URLs
        duration: '20 MIN',
        artist: 'Zen Master',
    },
    {
        id: 18,
        title: 'Forest Rain',
        category: 'Nature',
        image: require('../../assets/images/topic_personal_growth.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: '30 MIN',
        artist: 'Nature Sounds',
    },
    {
        id: 19,
        title: 'City Rain',
        category: 'Ambiance',
        image: require('../../assets/images/topic_improve_performance.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: '15 MIN',
        artist: 'Noise Team',
    },
    {
        id: 20,
        title: 'White Noise',
        category: 'Sleep',
        image: require('../../assets/images/topic_reduce_anxiety.png'),
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        duration: '60 MIN',
        artist: 'Sleep Aid',
    },
];

const Music = ({ navigation }: ScreenProps<'Music'>) => {
    const { theme } = useTheme();

    const renderItem = ({ item }: { item: typeof SONGS[0] }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('MusicPlayer', { song: item })}
        >
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
                {item.title}
            </Text>
            <Text style={[styles.category, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                {item.category} • {item.duration}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Music</Text>
                </View>
                <FlatList
                    data={SONGS}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    numColumns={COLUMN_COUNT}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
            <BottomMenu navigation={navigation} activeTab="Music" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacing(20),
        paddingVertical: hp(20),
        marginTop: hp(10),
    },
    headerTitle: {
        fontSize: fs(28),
        fontWeight: 'bold',
        fontFamily: 'HelveticaNeue',
    },
    listContent: {
        paddingHorizontal: spacing(20),
        paddingBottom: hp(100), // Space for bottom menu
    },
    columnWrapper: {
        justifyContent: 'space-between',
        marginBottom: hp(20),
    },
    card: {
        width: ITEM_WIDTH,
        marginBottom: hp(5),
    },
    image: {
        width: ITEM_WIDTH,
        height: ITEM_WIDTH, // Square image
        borderRadius: wp(15),
        marginBottom: hp(10),
    },
    title: {
        fontSize: fs(18),
        fontWeight: 'bold',
        marginBottom: hp(4),
    },
    category: {
        fontSize: fs(12),
        fontWeight: '500',
        textTransform: 'uppercase',
    },
});

export default Music;
