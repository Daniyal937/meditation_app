import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    TextInput,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../config/firebaseConfig';
import { getUserProfile, updateUserProfile } from '../services/authService';

const EditProfile = ({ navigation }) => {
    const { theme } = useTheme();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [country, setCountry] = useState('');
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    setEmail(currentUser.email);

                    const userProfile = await getUserProfile(currentUser.uid);
                    if (userProfile) {
                        setFullName(userProfile.name || '');
                        setPhoneNumber(userProfile.phoneNumber || '');
                        setDateOfBirth(userProfile.dateOfBirth || '');
                        setStreetAddress(userProfile.streetAddress || '');
                        setCountry(userProfile.country || '');
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }

        setLoading(true);
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                await updateUserProfile(currentUser.uid, {
                    name: fullName,
                    phoneNumber,
                    dateOfBirth,
                    streetAddress,
                    country,
                });

                setSaved(true);
                Alert.alert('Success', 'Profile updated successfully');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Personal Info</Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setSaved(false)}
                    activeOpacity={0.7}
                >
                    <Ionicons name="pencil-outline" size={20} color={theme.colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Picture */}
                <View style={styles.profilePictureContainer}>
                    <View style={[styles.profilePicture, { backgroundColor: theme.colors.primary }]}>
                        <Text style={styles.profileInitial}>
                            {fullName.charAt(0).toUpperCase() || 'U'}
                        </Text>
                    </View>
                </View>

                {/* Form Fields */}
                <View style={styles.formContainer}>
                    {/* Full Name */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Full Name</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderBottomColor: theme.colors.border }]}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your full name"
                            placeholderTextColor={theme.colors.textSecondary}
                            editable={!saved}
                        />
                    </View>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Email</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderBottomColor: theme.colors.border }]}
                            value={email}
                            editable={false}
                            placeholder="Email address"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Phone Number */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Phone Number</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderBottomColor: theme.colors.border }]}
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            placeholder="+1-000-000-0000"
                            placeholderTextColor={theme.colors.textSecondary}
                            keyboardType="phone-pad"
                            editable={!saved}
                        />
                    </View>

                    {/* Date of Birth */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Date of Birth</Text>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={[styles.input, { color: theme.colors.text, borderBottomColor: theme.colors.border, flex: 1 }]}
                                value={dateOfBirth}
                                onChangeText={setDateOfBirth}
                                placeholder="dd/mm/yyyy"
                                placeholderTextColor={theme.colors.textSecondary}
                                editable={!saved}
                            />
                            <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} style={styles.calendarIcon} />
                        </View>
                    </View>

                    {/* Street Address */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Street Address</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderBottomColor: theme.colors.border }]}
                            value={streetAddress}
                            onChangeText={setStreetAddress}
                            placeholderTextColor={theme.colors.textSecondary}
                            editable={!saved}
                        />
                    </View>

                    {/* Country */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Country</Text>
                        <TextInput
                            style={[styles.input, { color: theme.colors.text, borderBottomColor: theme.colors.border }]}
                            value={country}
                            onChangeText={setCountry}
                            placeholderTextColor={theme.colors.textSecondary}
                            editable={!saved}
                        />
                    </View>

                    {/* Save Button */}
                    {!saved && (
                        <TouchableOpacity
                            style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                            onPress={handleSave}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.saveButtonText}>
                                {loading ? 'SAVING...' : 'SAVE'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Bottom padding */}
                <View style={{ height: 40 }} />
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
    editButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    profilePictureContainer: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitial: {
        fontSize: 48,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    formContainer: {
        paddingTop: 10,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        fontSize: 16,
        fontWeight: '400',
        paddingVertical: 12,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    calendarIcon: {
        position: 'absolute',
        right: 0,
        bottom: 12,
    },
    saveButton: {
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
});

export default EditProfile;
