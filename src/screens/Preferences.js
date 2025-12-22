import React, { useState } from 'react';
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

const Preferences = ({ navigation }) => {
    const { theme } = useTheme();
    const [downloadWifiOnly, setDownloadWifiOnly] = useState(false);
    const [autoDownloadAudio, setAutoDownloadAudio] = useState(false);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle={theme.colors.statusBar} backgroundColor={theme.colors.background} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Preferences</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* General Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>General</Text>

                    {/* Download Over Wi-Fi Only */}
                    <View style={[styles.optionRow, { backgroundColor: theme.colors.card }]}>
                        <Text style={[styles.optionText, { color: theme.colors.text }]}>
                            Download Over Wi-Fi Only
                        </Text>
                        <Switch
                            value={downloadWifiOnly}
                            onValueChange={setDownloadWifiOnly}
                            trackColor={{ false: '#E5E7EB', true: theme.colors.primary }}
                            thumbColor={downloadWifiOnly ? '#FFFFFF' : '#F3F4F6'}
                            ios_backgroundColor="#E5E7EB"
                        />
                    </View>

                    {/* Clear Cache */}
                    <TouchableOpacity
                        style={[styles.optionRow, { backgroundColor: theme.colors.card }]}
                        activeOpacity={0.7}
                        onPress={() => { }} // TODO: Implement Clear Cache
                    >
                        <Text style={[styles.optionText, { color: theme.colors.text }]}>
                            Clear Cache
                        </Text>
                        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Audio Section */}
                <View style={styles.section}>
                    <Text style={[styles.sectionHeader, { color: theme.colors.text }]}>Audio</Text>

                    {/* Audio Quality */}
                    <TouchableOpacity
                        style={[styles.optionRow, { backgroundColor: theme.colors.card }]}
                        activeOpacity={0.7}
                        onPress={() => { }} // TODO: Implement Audio Quality
                    >
                        <Text style={[styles.optionText, { color: theme.colors.text }]}>
                            Audio Quality
                        </Text>
                        <View style={styles.optionRight}>
                            <Text style={[styles.optionValue, { color: theme.colors.textSecondary }]}>
                                Standard
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                        </View>
                    </TouchableOpacity>

                    {/* Automatically Download Audio */}
                    <View style={[styles.optionRow, { backgroundColor: theme.colors.card }]}>
                        <Text style={[styles.optionText, { color: theme.colors.text }]}>
                            Automatically Download Audio
                        </Text>
                        <Switch
                            value={autoDownloadAudio}
                            onValueChange={setAutoDownloadAudio}
                            trackColor={{ false: '#E5E7EB', true: theme.colors.primary }}
                            thumbColor={autoDownloadAudio ? '#FFFFFF' : '#F3F4F6'}
                            ios_backgroundColor="#E5E7EB"
                        />
                    </View>
                </View>
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
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
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
    optionText: {
        fontSize: 16,
        fontWeight: '400',
        flex: 1,
    },
    optionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    optionValue: {
        fontSize: 14,
        fontWeight: '400',
    },
});

export default Preferences;
