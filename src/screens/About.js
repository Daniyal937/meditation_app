import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const About = ({ navigation }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const menuOptions = [
        { id: 'privacy', title: 'Privacy Policy', onPress: () => {} }, // TODO: Implement Privacy Policy
        { id: 'job', title: 'Job Vacancy', onPress: () => {} }, // TODO: Implement Job Vacancy
        { id: 'developer', title: 'Developer', onPress: () => {} }, // TODO: Implement Developer info
        { id: 'partner', title: 'Partner', onPress: () => {} }, // TODO: Implement Partner info
        { id: 'accessibility', title: 'Accessibility', onPress: () => {} }, // TODO: Implement Accessibility
        { id: 'feedback', title: 'Feedback', onPress: () => {} }, // TODO: Implement Feedback
        { id: 'rate', title: 'Rate us', onPress: () => {} }, // TODO: Implement Rate us
        { id: 'website', title: 'Visit Our Website', onPress: () => {} }, // TODO: Implement Website link
        { id: 'social', title: 'Follow us on Social Media', onPress: () => {} }, // TODO: Implement Social Media links
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <StatusBar
                    barStyle={theme.colors.statusBar}
                    backgroundColor={theme.colors.background}
                />

                {/* Header */}
                <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={26} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        About Silent Moon
                    </Text>
                    <View style={styles.placeholder} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingBottom: insets.bottom + 20 },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* App Logo */}
                    <View style={styles.logoContainer}>
                        <View style={styles.logoWrapper}>
                            <Image
                                source={require('../../assets/images/about_logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>
                    </View>

                    {/* Version Text */}
                    <Text
                        style={[
                            styles.versionText,
                            { color: theme.colors.text, borderBottomColor: theme.colors.border },
                        ]}
                    >
                        Silent Moon v5.7.8
                    </Text>

                    {/* Menu Options */}
                    <View style={styles.menuContainer}>
                        {menuOptions.map((option, index) => (
                            <TouchableOpacity
                                key={option.id}
                                style={[
                                    styles.menuOption,
                                    { backgroundColor: theme.colors.card },
                                    index === menuOptions.length - 1 && styles.lastOption,
                                ]}
                                onPress={option.onPress}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.menuText, { color: theme.colors.text }]}>
                                    {option.title}
                                </Text>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={theme.colors.textSecondary}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Bottom padding */}
                    <View style={{ height: 40 }} />
                </ScrollView>
            </View>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 26,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginRight: 24,
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logoWrapper: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 100,
    },
    versionText: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 32,
        borderBottomWidth: 0,
        paddingTop: 10,
    },
    menuContainer: {
        marginBottom: 20,
    },
    menuOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 1,
        minHeight: 56,
    },
    lastOption: {
        marginBottom: 0,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '400',
        flex: 1,
    },
});

export default About;
