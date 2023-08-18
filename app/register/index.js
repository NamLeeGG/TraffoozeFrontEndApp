import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard, ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { COLORS, icons, SIZES } from "../../constants";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputField from '../../components/common/input/InputField';
import { ScreenHeaderBtn } from '../../components';
import styles from "./registerpage.style"; // You might need to create a separate styling file for this

const RegisterPage = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };    

    const handleRegister = () => {
        // Check if all fields are provided
        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            Alert.alert("Error", "Please fill out all the fields.");
            return;
        };
        
        // Validate email format
        if (!isValidEmail(email)) {
            Alert.alert("Error", "Please provide a valid email address.");
            return;
        };

        // Check if passwords match
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords don't match. Please check and try again.");
            return;
        };

        setLoading(true);

        // You can proceed with the API request now
        axios.post('https://traffoozebackend.vercel.app/register/', {
            username: username,
            password: password,
            email: email
        })
        .then(response => {
            setLoading(false);
            Alert.alert("Success", "Registered successfully!");
            router.back();
        })
        .catch(error => {
            Alert.alert("Error", "Failed to register. Please try again.");
        });
    };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Stack.Screen
            options={{
                headerStyle: { backgroundColor: COLORS.lightestBlue },
                headerShadowVisible: false,
                headerLeft: () => (
                    <ScreenHeaderBtn
                        iconUrl={icons.left}
                        dimension='60%'
                        handlePress={() => router.back()}
                    />
                ),
                headerTitle: "",
            }}
        />
        <View style={styles.content}>
            <Text style={styles.title}>Register</Text>

            <View style={{marginHorizontal: 30}}>
                <InputField
                    label={'Username ID'}
                    icon={
                        <MaterialIcons
                        name="alternate-email"
                        size={20}
                        color="#666"
                        style={{ marginRight: 5 }}
                        />
                    }
                    keyboardType="email-address"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
                <InputField
                    label={'Email'}
                    icon={
                        <MaterialIcons
                            name="email"
                            size={20}
                            color="#666"
                            style={{ marginRight: 5 }}
                        />
                    }
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                />

                <InputField
                    label={'Password'}
                    icon={
                        <Ionicons
                        name="ios-lock-closed-outline"
                        size={20}
                        color="#666"
                        style={{ marginRight: 5 }}
                        />
                    }
                    inputType="password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />

                <InputField
                    label={'Confirm Password'}
                    icon={
                        <Ionicons
                        name="ios-lock-closed-outline"
                        size={20}
                        color="#666"
                        style={{ marginRight: 5 }}
                        />
                    }
                    inputType="password"
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                />
            </View>

            <TouchableOpacity
                onPress={handleRegister}
                style={{
                    backgroundColor: COLORS.darkBlue,
                    padding: 18,
                    borderRadius: 10,
                    marginBottom: 20,
                    marginTop: 15,
                    marginHorizontal: 30,
                }}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text
                        style={{
                            textAlign: 'center',
                            fontWeight: '700',
                            fontSize: 16,
                            color: '#fff',
                        }}>
                        Register
                    </Text>
                )}
            </TouchableOpacity>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginBottom: 30,
                }}>
                <Text> Already have an account?  </Text>
                <TouchableOpacity onPress={() => router.push(`/login`)}> 
                    <Text style={{ color: COLORS.tertiary, fontWeight: '700', fontSize: SIZES.medium - 1.5 }}> Login </Text>
                </TouchableOpacity>
            </View>
            </View>
      </SafeAreaView>

    </TouchableWithoutFeedback>
  );
};

export default RegisterPage;
