import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { OneSignal } from 'react-native-onesignal';

const NotificationSettings = ({ navigation }) => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const [newCourse, setNewCourse] = useState(true);
    const [downloadAudios, setDownloadAudios] = useState(false);
    const [systemNotifications, setSystemNotifications] = useState(true);
    const [participateSurvey, setParticipateSurvey] = useState(false);
    const [newTips, setNewTips] = useState(false);
    const updateNotificationPreference = (id, value, setter) => {
        setter(value);
        try {
            if (id === 'systemNotifications') {
                // Control actual push subscription
                if (value) {
                    OneSignal.User.pushSubscription.optIn();
                } else {
                    OneSignal.User.pushSubscription.optOut();
                }
            } else {
                // Use tags for other categories
                OneSignal.User.addTag(id, value ? 'true' : 'false');
            }
        } catch (error) {
            console.error(`Error updating OneSignal for ${id}:`, error);
        }
    };

    const notificationOptions = [
        {
            id: 'newCourse',
            title: "There's a New Meditation Course",
            value: newCourse,
            onValueChange: val => updateNotificationPreference('newCourse', val, setNewCourse),
        },
        {
            id: 'downloadAudios',
            title: 'Downloads Meditation Audios',
            value: downloadAudios,
            onValueChange: val =>
                updateNotificationPreference('downloadAudios', val, setDownloadAudios),
        },
        {
            id: 'systemNotifications',
            title: 'Enable App system Notifications',
            value: systemNotifications,
            onValueChange: val =>
                updateNotificationPreference('systemNotifications', val, setSystemNotifications),
        },
        {
            id: 'participateSurvey',
            title: 'Participate in Survey',
            value: participateSurvey,
            onValueChange: val =>
                updateNotificationPreference('participateSurvey', val, setParticipateSurvey),
        },
        {
            id: 'newTips',
            title: 'New Tips & Services Available',
            value: newTips,
            onValueChange: val => updateNotificationPreference('newTips', val, setNewTips),
        },
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
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        Notifications
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
                    {/* Section Header */}
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>
                        Notify me when...
                    </Text>

                    {/* Notification Options */}
                    {notificationOptions.map((option, index) => (
                        <View
                            key={option.id}
                            style={[
                                styles.optionRow,
                                { backgroundColor: theme.colors.card },
                                index === notificationOptions.length - 1 && styles.lastOption,
                            ]}
                        >
                            <Text style={[styles.optionText, { color: theme.colors.text }]}>
                                {option.title}
                            </Text>
                            <Switch
                                value={option.value}
                                onValueChange={option.onValueChange}
                                trackColor={{ false: '#E5E7EB', true: theme.colors.primary }}
                                thumbColor={option.value ? '#FFFFFF' : '#F3F4F6'}
                                ios_backgroundColor="#E5E7EB"
                            />
                        </View>
                    ))}
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
        flex: 1,
        textAlign: 'center',
        marginRight: 40,
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 16,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingHorizontal: 16,
        marginBottom: 1,
        minHeight: 56,
    },
    lastOption: {
        marginBottom: 0,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '400',
        flex: 1,
        paddingRight: 16,
    },
});

export default NotificationSettings;
