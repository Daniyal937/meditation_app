import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ScreenProps } from '../types';
const Settings = ({ navigation }: ScreenProps<'Settings'>) => {
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const settingsOptions = [
        {
            id: 'account',
            title: 'Account Settings',
            icon: 'person-outline',
            onPress: () => navigation.navigate('EditProfile'),
        },
        {
            id: 'notifications',
            title: 'Notifications',
            icon: 'notifications-outline',
            onPress: () => navigation.navigate('NotificationSettings'),
        },
        {
            id: 'privacy',
            title: 'Privacy & Security',
            icon: 'lock-closed-outline',
            onPress: () => navigation.navigate('Preferences'),
        },
        {
            id: 'help',
            title: 'Help & Support',
            icon: 'help-circle-outline',
            onPress: () => navigation.navigate('AboutScreen'),
        },
    ];
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={theme.colors.statusBar}
                backgroundColor={theme.colors.background}
            />
            {}
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</Text>
                <View style={styles.headerPlaceholder} />
            </View>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                        APPEARANCE
                    </Text>
                    <View
                        style={[
                            styles.settingItem,
                            {
                                backgroundColor: theme.colors.card,
                                borderColor: theme.colors.border,
                            },
                        ]}
                    >
                        <View style={styles.settingLeft}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: theme.colors.primary + '20' },
                                ]}
                            >
                                <Ionicons name="moon" size={22} color={theme.colors.primary} />
                            </View>
                            <View style={styles.settingTextContainer}>
                                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                                    Dark Mode
                                </Text>
                                <Text
                                    style={[
                                        styles.settingSubtitle,
                                        { color: theme.colors.textSecondary },
                                    ]}
                                >
                                    {isDarkMode ? 'Enabled' : 'Disabled'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#E8ECF4', true: theme.colors.primary }}
                            thumbColor={isDarkMode ? '#FFFFFF' : '#F2F3F7'}
                            ios_backgroundColor="#E8ECF4"
                        />
                    </View>
                </View>
                {}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                        GENERAL
                    </Text>
                    {settingsOptions.map((option, index) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.settingItem,
                                {
                                    backgroundColor: theme.colors.card,
                                    borderColor: theme.colors.border,
                                    marginBottom: index === settingsOptions.length - 1 ? 0 : 12,
                                },
                            ]}
                            onPress={option.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.settingLeft}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        { backgroundColor: theme.colors.primary + '20' },
                                    ]}
                                >
                                    <Ionicons
                                        name={option.icon as any}
                                        size={22}
                                        color={theme.colors.primary}
                                    />
                                </View>
                                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                                    {option.title}
                                </Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={theme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                {}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>
                        ABOUT
                    </Text>
                    <View
                        style={[
                            styles.settingItem,
                            {
                                backgroundColor: theme.colors.card,
                                borderColor: theme.colors.border,
                            },
                        ]}
                    >
                        <View style={styles.settingLeft}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: theme.colors.primary + '20' },
                                ]}
                            >
                                <Ionicons
                                    name="information-circle-outline"
                                    size={22}
                                    color={theme.colors.primary}
                                />
                            </View>
                            <View style={styles.settingTextContainer}>
                                <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                                    Version
                                </Text>
                                <Text
                                    style={[
                                        styles.settingSubtitle,
                                        { color: theme.colors.textSecondary },
                                    ]}
                                >
                                    1.0.0
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                {}
                <TouchableOpacity
                    style={[styles.logoutButton, { backgroundColor: theme.colors.error + '15' }]}
                    activeOpacity={0.7}
                    onPress={async () => {
                        const { signOutUser } = require('../services/authService');
                        await signOutUser();
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }}
                >
                    <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
                    <Text style={[styles.logoutText, { color: theme.colors.error }]}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
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
        borderBottomWidth: 1,
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
    headerPlaceholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingTextContainer: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 13,
        fontWeight: '400',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 10,
        gap: 8,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
export default Settings;
