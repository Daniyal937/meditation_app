import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, fs, spacing } from '../utils/responsive';
import { useTheme } from '../context/ThemeContext';
import type { ScreenProps } from '../types';
const About = ({ navigation }: ScreenProps<'AboutScreen'>) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const aboutItems = [
        {
            title: 'Version',
            value: '1.0.0',
        },
        {
            title: 'Developer',
            value: 'Silent Moon Team',
        },
        {
            title: 'Contact',
            value: 'support@silentmoon.com',
        },
    ];
    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={{ flex: 1, paddingTop: insets.top }}>
                <StatusBar
                    barStyle={theme.colors.statusBar}
                    backgroundColor={theme.colors.background}
                />
                {}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>About</Text>
                    <View style={styles.backButton} />
                </View>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
                    showsVerticalScrollIndicator={false}
                >
                    {}
                    <View style={styles.infoContainer}>
                        {aboutItems.map((item, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.infoItem,
                                    { borderBottomColor: theme.colors.border },
                                ]}
                            >
                                <Text style={[styles.infoTitle, { color: theme.colors.textSecondary }]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                                    {item.value}
                                </Text>
                            </View>
                        ))}
                    </View>
                    {}
                    <View style={styles.descriptionContainer}>
                        <Text style={[styles.descriptionText, { color: theme.colors.textSecondary }]}>
                            Silent Moon is your companion for meditation and mindfulness. Find peace,
                            reduce stress, and improve your well-being with our guided sessions.
                        </Text>
                    </View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    infoContainer: {
        marginTop: 20,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '400',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    descriptionContainer: {
        marginTop: 30,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 22,
        textAlign: 'center',
    },
});
export default About;
