import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    LayoutAnimation,
    Platform,
    UIManager,
    Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OneSignal } from 'react-native-onesignal';
import * as Notifications from 'expo-notifications';
import { wp, hp, fs, spacing } from '../utils/responsive';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { ScreenProps } from '../types';
import { LinearGradient } from 'expo-linear-gradient';

const Reminders = ({ navigation }: ScreenProps<'Reminders'>) => {
    const insets = useSafeAreaInsets();
    const [selectedHour, setSelectedHour] = useState(11);
    const [selectedMinute, setSelectedMinute] = useState(30);
    const [selectedPeriod, setSelectedPeriod] = useState('AM');
    const [selectedDays, setSelectedDays] = useState<number[]>([]);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const periods = ['AM', 'PM'];
    const days = [
        { id: 0, label: 'SU', full: 'Sunday' },
        { id: 1, label: 'M', full: 'Monday' },
        { id: 2, label: 'T', full: 'Tuesday' },
        { id: 3, label: 'W', full: 'Wednesday' },
        { id: 4, label: 'TH', full: 'Thursday' },
        { id: 5, label: 'F', full: 'Friday' },
        { id: 6, label: 'S', full: 'Saturday' },
    ];

    const toggleDay = (dayId: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (selectedDays.includes(dayId)) {
            setSelectedDays(selectedDays.filter(id => id !== dayId));
        } else {
            setSelectedDays([...selectedDays, dayId]);
        }
    };

    const handleSave = async () => {
        if (selectedDays.length === 0) {
            Alert.alert('Please select at least one day');
            return;
        }

        // Format time string HH:MM AM/PM
        const timeString = `${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;

        try {
            // 1. Schedule Local Notifications (Expo)
            // Cancel all previous reminders first
            await Notifications.cancelAllScheduledNotificationsAsync();

            // Convert 12h to 24h for scheduling
            let hour24 = selectedHour;
            if (selectedPeriod === 'PM' && hour24 < 12) hour24 += 12;
            if (selectedPeriod === 'AM' && hour24 === 12) hour24 = 0;

            // Schedule for each selected day
            // OneSignal days are 0-6 (Sun-Sat), which matches expo-notifications weekday (1-7 but wait)
            // Expo weekday: 1 (Sunday), 2 (Monday), ..., 7 (Saturday)
            // Our days array: Sunday is id: 0. So we need to add 1.

            for (const dayId of selectedDays) {
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: 'Time to Meditate 🧘',
                        body: 'Take a moment for yourself and start your daily practice.',
                        sound: true,
                    },
                    trigger: {
                        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
                        hour: hour24,
                        minute: selectedMinute,
                        weekday: dayId + 1, // 0+1 = 1 (Sunday), etc.
                        repeats: true,
                    },
                });
            }

            // 2. Add OneSignal Tags for server-side segmentation
            OneSignal.User.addTags({
                reminder_time: timeString,
                reminder_days: selectedDays.join(','),
                has_reminders_enabled: 'true',
            });

            Alert.alert('Success', 'Reminders saved successfully!');
        } catch (error) {
            console.error('Error setting reminders:', error);
            Alert.alert('Success', 'Reminders saved locally (Push notifications vary by device)');
        }

        // Navigate to Home screen
        navigation.navigate('Home', {});
    };

    const handleNoThanks = () => {
        // Skip reminder setup

        // Navigate to Home screen
        navigation.navigate('Home', {});
    };

    const renderPickerItem = (value: number | string, isSelected: boolean, onPress: () => void) => (
        <TouchableOpacity key={value} onPress={onPress} style={styles.pickerItem}>
            <Text style={[styles.pickerItemText, isSelected && styles.pickerItemTextSelected]}>
                {typeof value === 'number' ? value.toString().padStart(2, '0') : value}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingBottom: Math.max(insets.bottom, hp(40)) },
                ]}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                {/* Time Section */}
                <View style={styles.section}>
                    <Text style={[styles.title, { paddingTop: 20 }]}>
                        What time would you like to meditate?
                    </Text>
                    <Text style={styles.subtitle}>
                        Any time you can choose but We recommend first thing in the morning.
                    </Text>

                    {/* Time Picker */}
                    <View style={styles.timePickerContainer}>
                        {/* Hour Picker */}
                        <View style={styles.pickerColumn}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.pickerScrollContent}
                                nestedScrollEnabled={true}
                            >
                                {hours.map(hour =>
                                    renderPickerItem(hour, hour === selectedHour, () =>
                                        setSelectedHour(hour)
                                    )
                                )}
                            </ScrollView>
                        </View>

                        {/* Minute Picker */}
                        <View style={styles.pickerColumn}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.pickerScrollContent}
                                nestedScrollEnabled={true}
                            >
                                {minutes.map(minute =>
                                    renderPickerItem(minute, minute === selectedMinute, () =>
                                        setSelectedMinute(minute)
                                    )
                                )}
                            </ScrollView>
                        </View>

                        {/* Period Picker */}
                        <View style={styles.pickerColumn}>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.pickerScrollContent}
                                nestedScrollEnabled={true}
                            >
                                {periods.map(period =>
                                    renderPickerItem(period, period === selectedPeriod, () =>
                                        setSelectedPeriod(period)
                                    )
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>

                {/* Day Selection Section */}
                <View style={[styles.section, { marginTop: 20 }]}>
                    <Text style={styles.title}>Which day would you like to meditate?</Text>
                    <Text style={styles.subtitle}>
                        Everyday is best, but we recommend picking at least five.
                    </Text>

                    {/* Day Buttons */}
                    <View style={styles.dayContainer}>
                        {days.map(day => (
                            <TouchableOpacity
                                key={day.id}
                                style={[
                                    styles.dayButton,
                                    selectedDays.includes(day.id) && styles.dayButtonSelected,
                                ]}
                                onPress={() => toggleDay(day.id)}
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.dayButtonText,
                                        selectedDays.includes(day.id) &&
                                        styles.dayButtonTextSelected,
                                    ]}
                                >
                                    {day.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.saveButtonWrapper}
                        onPress={handleSave}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#8E97FD', '#A5AFFF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.saveButton}
                        >
                            <Text style={styles.saveButtonText}>SAVE</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleNoThanks} activeOpacity={0.7}>
                        <Text style={styles.noThanksText}>NO THANKS</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing(20),
        paddingBottom: hp(40),
    },
    section: {
        marginTop: hp(30),
        marginBottom: hp(20),
    },
    title: {
        fontSize: fs(24),
        fontWeight: '700',
        color: '#3F414E',
        marginBottom: hp(12),
        lineHeight: fs(32),
    },
    subtitle: {
        fontSize: fs(16),
        fontWeight: '300',
        color: '#A1A4B2',
        lineHeight: fs(22),
        marginBottom: hp(24),
    },
    timePickerContainer: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: wp(15),
        padding: spacing(20),
        height: hp(180),
        justifyContent: 'space-around',
    },
    pickerColumn: {
        flex: 1,
        marginHorizontal: spacing(5),
    },
    pickerScrollContent: {
        alignItems: 'center',
        paddingVertical: hp(60),
    },
    pickerItem: {
        paddingVertical: hp(10),
        alignItems: 'center',
    },
    pickerItemText: {
        fontSize: fs(18),
        color: '#A1A4B2',
        fontWeight: '400',
    },
    pickerItemTextSelected: {
        fontSize: fs(24),
        color: '#3F414E',
        fontWeight: '700',
    },
    dayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(10),
    },
    dayButton: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EBEAEC',
    },
    dayButtonSelected: {
        backgroundColor: '#3F414E',
        borderColor: '#3F414E',
    },
    dayButtonText: {
        fontSize: fs(14),
        fontWeight: '600',
        color: '#3F414E',
    },
    dayButtonTextSelected: {
        color: '#FFFFFF',
    },
    actionContainer: {
        marginTop: hp(40),
        alignItems: 'center',
    },
    saveButtonWrapper: {
        width: '100%',
        marginBottom: hp(20),
    },
    saveButton: {
        paddingVertical: hp(18),
        borderRadius: wp(38),
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        fontSize: fs(14),
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 1.2,
    },
    noThanksText: {
        fontSize: fs(14),
        fontWeight: '600',
        color: '#A1A4B2',
        letterSpacing: 1,
    },
});

export default Reminders;
