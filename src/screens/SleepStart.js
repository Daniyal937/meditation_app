import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    ImageBackground,
    useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp, fs, spacing } from '../utils/responsive';

const SleepStart = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const insets = useSafeAreaInsets();
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Background Image */}
            <ImageBackground
                source={require('../../assets/images/sleep_start_bg_v4.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {/* Content Container */}
                <View style={[styles.contentContainer, { paddingTop: insets.top + hp(60), paddingBottom: insets.bottom + hp(20) }]}>
                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Welcome to Sleep</Text>
                        <Text style={styles.description}>
                            Explore the new king of sleep. It uses sound
                            and visualization to create perfect conditions
                            for refreshing sleep.
                        </Text>
                    </View>

                    {/* Sleeping Birds Illustration */}
                    <Image
                        source={require('../../assets/images/sleeping_birds_logo.png')}
                        style={[styles.illustration, { width: width * 0.88, height: height * 0.385 }]}
                        resizeMode="contain"
                    />

                    {/* Get Started Button */}
                    <TouchableOpacity
                        style={styles.getStartedButton}
                        activeOpacity={0.8}
                        onPress={async () => {
                            await AsyncStorage.setItem('hasSeenSleepStart', 'true');
                            navigation.navigate('Sleep');
                        }}
                    >
                        <Text style={styles.getStartedText}>GET STARTED</Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#03174C', // Deep blue to match bg
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing(30),
        paddingTop: hp(120),
        paddingBottom: hp(50),
    },
    titleSection: {
        alignItems: 'center',
        marginTop: hp(20),
    },
    title: {
        fontSize: fs(30),
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: hp(16),
        letterSpacing: 0.5,
    },
    description: {
        fontSize: fs(16),
        fontWeight: '300',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: fs(24),
        opacity: 0.9,
    },
    illustration: {
        alignSelf: 'flex-end',
        marginRight: -spacing(30), // Offset the contentContainer's paddingHorizontal
    },
    getStartedButton: {
        backgroundColor: '#8E97FD',
        paddingVertical: hp(18),
        paddingHorizontal: spacing(60),
        borderRadius: wp(30),
        width: '85%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: hp(4) },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: hp(20),
    },
    getStartedText: {
        fontSize: fs(14),
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
});

export default SleepStart;
