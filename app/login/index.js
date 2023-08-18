import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, Alert, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';

import { COLORS, FONT, icons, images, SIZES } from "../../constants";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import InputField from '../../components/common/input/InputField';
import { ScreenHeaderBtn } from '../../components';
import styles from "./loginpage.style";

const LoginPage = () => {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = () => {
        // Check if both username and password are provided
        if (!username.trim() || !password.trim()) {
            Alert.alert("Error", "Please enter both username and password.");
            return;  // Return early to stop executing the function
        }

        setLoading(true);

        axios.post('https://traffoozebackend.vercel.app/login/', {
            username: username,
            password: password
        })
        .then(async (response) => {
            setLoading(false);

            // Check if the token exists in the response
            if (response.data && response.data.token) {
                try {
                    // Save the token locally using AsyncStorage
                    // await AsyncStorage.setItem('token', response.data.token);
                    global.token = response.data.token;
                    global.accountname = username;
                    Alert.alert('Success', 'You have successfully logged in!', [
                        { text: 'OK', onPress: () => router.back() }
                    ]);
                } catch (error) {
                    // Handle any error that occurred during saving the token
                    Alert.alert("Error", "Failed to save the token. Please try again.");
                }
            } else {
                Alert.alert("Error", "Failed to get the token. Please try again.");
            }
        })
        .catch((error) => {
            setLoading(false);
            Alert.alert("Error", "Failed to login. Please check your credentials and try again.");
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
                    <Image
                        source={images.logo}
                        style={styles.logoImage}
                    />
                    <Text style={styles.title}>Login</Text>

                    <View style={{marginHorizontal: 30}}>
                        <InputField
                            label={'Username ID'}
                            icon={
                                <MaterialIcons
                                name="alternate-email"
                                size={20}
                                color="#666"
                                style={{marginRight: 5}}
                            />
                            }
                            keyboardType="email-address"
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                        />

                        <InputField
                            label={'Password'}
                            icon={
                                <Ionicons
                                name="ios-lock-closed-outline"
                                size={20}
                                color="#666"
                                style={{marginRight: 5}}
                            />
                            }
                            inputType="password"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleLogin}
                        style={{
                            backgroundColor: COLORS.tertiary,
                            padding: 20,
                            borderRadius: 10,
                            marginBottom: 40,
                            marginTop: 20,
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
                                Login
                            </Text>
                        )}
                    </TouchableOpacity>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginBottom: 30,
                    }}>
                        <Text>New to the app?  </Text>
                        <TouchableOpacity onPress={() => router.push(`/register`)}>
                            <Text style={{color: COLORS.blue, fontWeight: '700', fontSize: SIZES.medium - 2}}> Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

        </TouchableWithoutFeedback>
    );
};

export default LoginPage;
