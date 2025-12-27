import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    TextInput,
    Alert,
    StatusBar,
    Platform,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../config/firebaseConfig';
import { getUserProfile, updateUserProfile } from '../services/authService';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile as setUserProfileAction } from '../redux/slices/userSlice';
import { ScreenProps } from '../types';
import { RootState } from '../redux/store';
const EditProfile = ({ navigation }: ScreenProps<'EditProfile'>) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const userProfileFromRedux = useSelector((state: RootState) => state.user.profile);
    const insets = useSafeAreaInsets();
    const [fullName, setFullName] = useState(userProfileFromRedux?.name || '');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(userProfileFromRedux?.phoneNumber || '');
    const [dateOfBirth, setDateOfBirth] = useState(userProfileFromRedux?.dateOfBirth || '');
    const [streetAddress, setStreetAddress] = useState(userProfileFromRedux?.streetAddress || '');
    const [country, setCountry] = useState(userProfileFromRedux?.country || '');
    const [profileImage, setProfileImage] = useState(userProfileFromRedux?.profileImage || null);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    setEmail(currentUser.email || '');
                    const userProfile = await getUserProfile(currentUser.uid);
                    if (userProfile) {
                        setFullName(userProfile.name || '');
                        setPhoneNumber(userProfile.phoneNumber || '');
                        setDateOfBirth(userProfile.dateOfBirth || '');
                        setStreetAddress(userProfile.streetAddress || '');
                        setCountry(userProfile.country || '');
                        setProfileImage(userProfile.profileImage || null);
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, []);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
            setSaved(false); 
        }
    };
    const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date): void => {
        const currentDate = selectedDate || new Date();
        setShowDatePicker(Platform.OS === 'ios');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear();
        setDateOfBirth(`${day}/${month}/${year}`);
        setSaved(false); 
    };
    const handleSave = async () => {
        if (!fullName.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }
        setLoading(true);
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                const updatedProfile = {
                    name: fullName,
                    phoneNumber,
                    dateOfBirth,
                    streetAddress,
                    country,
                    profileImage,
                    uid: currentUser.uid,
                    email: currentUser.email || '',
                };
                await updateUserProfile(currentUser.uid, updatedProfile);
                dispatch(setUserProfileAction(updatedProfile));
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
                    <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                        Personal Info
                    </Text>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setSaved(false)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={require('../../assets/images/edit_icon.png')}
                            style={{ width: 20, height: 20, tintColor: theme.colors.text }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingBottom: insets.bottom + 20 },
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    {}
                    <View
                        style={[
                            styles.profilePictureContainer,
                            { borderBottomColor: theme.colors.border },
                        ]}
                    >
                        <TouchableOpacity
                            style={[
                                styles.profilePicture,
                                { backgroundColor: theme.colors.primary },
                            ]}
                            onPress={pickImage}
                            disabled={saved}
                            activeOpacity={0.8}
                        >
                            {profileImage ? (
                                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                            ) : (
                                <Text style={styles.profileInitial}>
                                    {fullName.charAt(0).toUpperCase() || 'U'}
                                </Text>
                            )}
                            <View
                                style={[styles.editBadge, { backgroundColor: theme.colors.accent }]}
                            >
                                <Ionicons name="camera" size={16} color="#FFFFFF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    {}
                    <View style={styles.formContainer}>
                        {}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: '#000000' }]}>Full Name</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme.colors.text, borderBottomColor: '#000000' },
                                ]}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Enter your full name"
                                placeholderTextColor={theme.colors.textSecondary}
                                editable={!saved}
                            />
                        </View>
                        {}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: '#000000' }]}>Email</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme.colors.text, borderBottomColor: '#000000' },
                                ]}
                                value={email}
                                editable={false}
                                placeholder="Email address"
                                placeholderTextColor={theme.colors.textSecondary}
                                keyboardType="email-address"
                            />
                        </View>
                        {}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: '#000000' }]}>Phone Number</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme.colors.text, borderBottomColor: '#000000' },
                                ]}
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                placeholder="+1-000-000-0000"
                                placeholderTextColor={theme.colors.textSecondary}
                                keyboardType="phone-pad"
                                editable={!saved}
                            />
                        </View>
                        {}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: '#000000' }]}>Date of Birth</Text>
                            <TouchableOpacity
                                style={styles.inputWithIcon}
                                onPress={() => !saved && setShowDatePicker(true)}
                                activeOpacity={0.7}
                            >
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            color: theme.colors.text,
                                            borderBottomColor: '#000000',
                                            flex: 1,
                                        },
                                    ]}
                                    value={dateOfBirth}
                                    placeholder="dd/mm/yyyy"
                                    placeholderTextColor={theme.colors.textSecondary}
                                    editable={false}
                                    pointerEvents="none" 
                                />
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color={'#000000'}
                                    style={styles.calendarIcon}
                                />
                            </TouchableOpacity>
                        </View>
                        {showDatePicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                                maximumDate={new Date()}
                            />
                        )}
                        {}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: '#000000' }]}>Street Address</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme.colors.text, borderBottomColor: '#000000' },
                                ]}
                                value={streetAddress}
                                onChangeText={setStreetAddress}
                                placeholderTextColor={theme.colors.textSecondary}
                                editable={!saved}
                            />
                        </View>
                        {}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: '#000000' }]}>Country</Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    { color: theme.colors.text, borderBottomColor: '#000000' },
                                ]}
                                value={country}
                                onChangeText={setCountry}
                                placeholderTextColor={theme.colors.textSecondary}
                                editable={!saved}
                            />
                        </View>
                        {}
                        {!saved && (
                            <TouchableOpacity
                                style={[
                                    styles.saveButton,
                                    { backgroundColor: theme.colors.primary },
                                ]}
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
                    {}
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
        borderBottomWidth: 1,
    },
    profilePicture: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    profileInitial: {
        fontSize: 48,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    editBadge: {
        position: 'absolute',
        right: 5,
        bottom: 5,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
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
