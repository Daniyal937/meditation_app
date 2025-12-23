import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    SafeAreaView,
} from 'react-native';
import { auth, db } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface LogEntry {
    message: string;
    type: string;
}

const FirebaseTest = () => {
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('test123456');
    const [logs, setLogs] = useState<LogEntry[]>([]);

    const addLog = (message: string, type: string = 'info'): void => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { message: `[${timestamp}] ${message}`, type }]);
    };

    useEffect(() => {
        addLog('🔵 Firebase Test Component Loaded');
        addLog(`Auth instance: ${auth ? 'OK' : 'MISSING'}`);
        addLog(`Firestore instance: ${db ? 'OK' : 'MISSING'}`);
    }, []);

    const testSignup = async () => {
        try {
            addLog('🔵 Testing signup...');
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            addLog(`✅ Signup successful! UID: ${userCredential.user.uid}`, 'success');

            // Try to write to Firestore
            addLog('🔵 Writing to Firestore...');
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                email: email,
                testField: 'Hello from test',
                createdAt: new Date().toISOString(),
            });
            addLog('✅ Firestore write successful!', 'success');
            Alert.alert('Success', 'Signup and Firestore write successful!');
        } catch (error) {
            const err = error as any;
            addLog(`❌ Error: ${err.code} - ${err.message}`, 'error');
            Alert.alert('Error', err.message);
        }
    };

    const testLogin = async () => {
        try {
            addLog('🔵 Testing login...');
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            addLog(`✅ Login successful! UID: ${userCredential.user.uid}`, 'success');

            // Try to read from Firestore
            addLog('🔵 Reading from Firestore...');
            const docRef = doc(db, 'users', userCredential.user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                addLog(
                    `✅ Firestore read successful! Data: ${JSON.stringify(docSnap.data())}`,
                    'success'
                );
                Alert.alert('Success', 'Login and Firestore read successful!');
            } else {
                addLog('⚠️ User document does not exist in Firestore', 'warning');
                Alert.alert('Warning', 'User authenticated but no Firestore document found');
            }
        } catch (error) {
            const err = error as any;
            addLog(`❌ Error: ${err.code} - ${err.message}`, 'error');
            Alert.alert('Error', err.message);
        }
    };

    const clearLogs = () => {
        setLogs([]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Firebase Connection Test</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="test@example.com"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="test123456"
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={testSignup}>
                    <Text style={styles.buttonText}>Test Signup</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={testLogin}>
                    <Text style={styles.buttonText}>Test Login</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearLogs}>
                    <Text style={styles.buttonText}>Clear Logs</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.logContainer}>
                <Text style={styles.logTitle}>Logs:</Text>
                {logs.map((log, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.logText,
                            log.type === 'error' && styles.errorLog,
                            log.type === 'success' && styles.successLog,
                            log.type === 'warning' && styles.warningLog,
                        ]}
                    >
                        {log.message}
                    </Text>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        fontWeight: '600',
    },
    input: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        backgroundColor: '#8E97FD',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: '#4CAF50',
    },
    clearButton: {
        backgroundColor: '#666',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
    logContainer: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 8,
    },
    logTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    logText: {
        color: '#fff',
        fontFamily: 'monospace',
        fontSize: 12,
        marginBottom: 5,
    },
    errorLog: {
        color: '#ff6b6b',
    },
    successLog: {
        color: '#51cf66',
    },
    warningLog: {
        color: '#ffd43b',
    },
});

export default FirebaseTest;
