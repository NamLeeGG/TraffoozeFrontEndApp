import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

import InputField from '../../components/common/input/InputField';
import { COLORS, icons, SIZES, FONT } from "../../constants";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScreenHeaderBtn } from "../../components";

const AccountPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(''); // for the email
    const [password, setPassword] = useState(''); // for the password
    const [currentEmail, setCurrentEmail] = useState('');
    const [reload, setReload] = useState(false);


    useEffect(() => {
        const fetchEmail = async () => {
            try {
                const response = await axios.post('https://traffoozebackend.vercel.app/get-email-by-username/', {
                    username: global.accountname
                });
                if (response.data && response.data.email) {
                    setCurrentEmail(response.data.email);
                }
            } catch (error) {
                console.error("Error fetching email: ", error);
                Alert.alert('Error', 'Failed to fetch current email.');
            }
        };
    
        fetchEmail();
    }, [reload]);    

    const validateEmail = (email) => {
        if (!email.trim()) return false;  // Check if email is only spaces
    
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }
    
    const validatePassword = (password) => {
        if (!password.trim()) return false;  // Check if password is only spaces
    
        return password.length >= 8;
    }    

    const handleUpdate = () => {

        // Validate email if there's some input
        if (email.trim() && !validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        // Validate password if there's some input
        if (password.trim() && !validatePassword(password)) {
            Alert.alert('Error', 'Password must be at least 8 characters long.');
            return;
        }

        // Make sure at least one field is being updated
        if (!email.trim() && !password.trim()) {
            Alert.alert('Error', 'Please provide either a new email or password to update.');
            return;
        }

        setLoading(true);
    
        // Log for debugging purposes
        console.log(global.accountname, email, password);
    
        axios.post('https://traffoozebackend.vercel.app/change-password-and-email/', {
            username: global.accountname,
            email: email || "", // sends an empty string if email is not changed
            password: password || "" // sends an empty string if password is not changed
        })
        .then((response) => {
            setLoading(false);
    
            // Check the status code
            if (response.status === 200) {
                // Success feedback
                Alert.alert('Success', 'Details updated successfully!');
                
                // Clear the input fields
                setEmail('');    // This clears the email input field
                setPassword(''); // This clears the password input field

                setReload(!reload);
            } else {
                // General error feedback if no specific message is provided
                Alert.alert('Error', response.data.message || 'Failed to update details.');
            }
        })
        .catch((error) => {
            // Handling networking or API errors
            setLoading(false);
            console.log(error);
            Alert.alert('Error', 'An unexpected error occurred. Please try again.');
        });
    };
    

    const handleLogOut = () => {
        setLoading(true);

        global.token = null;
        global.accountname = null;

        setLoading(false);

        Alert.alert('Success', 'You have successfully logged out!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightestBlue }}>
                <StatusBar style="dark" />

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
                        headerTitle: "Account Page",
                    }}
                />

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View
                        style={styles.cardContainer}
                    >
                        <Text style={{ ...FONT.regular, marginBottom: SIZES.medium, fontSize: SIZES.medium }}>Account Name: </Text>
                        <Text style={styles.accountNameText}>{global.accountname}</Text>

                        <Text style={{ ...FONT.regular, marginBottom: SIZES.medium, fontSize: SIZES.medium }}>
                            Current Email: {currentEmail}
                        </Text>
                        <InputField
                            label={'Email Address'}
                            icon={
                                <MaterialIcons
                                    name="alternate-email"
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
                                <MaterialIcons
                                    name="lock"
                                    size={20}
                                    color="#666"
                                    style={{ marginRight: 5 }}
                                />
                            }
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />

                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity
                                onPress={handleUpdate}
                                style={styles.updateButton}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Update
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleLogOut}
                                style={styles.logoutButton}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        Log Out
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </SafeAreaView>

        </TouchableWithoutFeedback>
    );

};

const styles = StyleSheet.create({
    cardContainer: {
        flex: 0.6,
        width: '80%', // optional, if you want the card width to be less than the screen width
        margin: SIZES.medium,
        padding: SIZES.medium,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    accountNameText: {
        ...FONT.bold,
        fontSize: SIZES.xxLarge, // adjust as needed for size
        marginBottom: SIZES.xxLarge+20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%', // adjust as necessary
        marginTop: 40,
    },
    updateButton: {
        backgroundColor: COLORS.blue, // choose a color for the update button
        padding: 20,
        borderRadius: 10,
        flex: 1,
        marginRight: 15,  // spacing between the two buttons
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 20,
        borderRadius: 10,
        flex: 1,
        marginLeft: 15,  // spacing between the two buttons
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 16,
        color: '#fff',
    },
});

export default AccountPage;
