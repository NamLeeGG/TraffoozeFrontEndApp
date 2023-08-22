import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView, Alert } from 'react-native';
import axios from 'axios';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Dropdown } from 'react-native-element-dropdown';
import { ScreenHeaderBtn } from "../../components";
import { COLORS, icons, SIZES, FONT } from "../../constants";

const FavLocationPage = () => {
    const router = useRouter();

    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [homeAddress, setHomeAddress] = useState("");
    const [workAddress, setWorkAddress] = useState("");
    const [currenthomeAddress, setCurrentHomeAddress] = useState("");
    const [currentworkAddress, setCurrentWorkAddress] = useState("");

    const fetchData = async () => {
        try {
            const response = await axios.get('https://traffooze-flask.onrender.com/get_locations');
            const formattedData = response.data.map(item => ({
                label: item.address,
                value: item.address
            }));
            setLocations(formattedData);
    
            const addressResponse = await axios.post('https://traffoozebackend.vercel.app/get-address/', {
                username: global.accountname
            });
            setCurrentHomeAddress(addressResponse.data.homeAddress || "None");
            setCurrentWorkAddress(addressResponse.data.workAddress || "None");
    
        } catch (error) {
            console.error('Error fetching locations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateAddress = async () => {
        try {
            const response = await axios.post('https://traffoozebackend.vercel.app/update-address/', {
                username: global.accountname,
                homeAddress: homeAddress || "",
                workAddress: workAddress || ""
            });

            // Checking for the HTTP status code
            if (response.status === 200) {
                Alert.alert('Success', 'Addresses updated successfully!');
                fetchData(); // Fetch data again after the update
            } else {
                // If you reach here, it means the API returned a status code other than 200
                // You might want to handle other specific status codes or provide a general error message
                console.error('Unexpected status code returned:', response.status);
                Alert.alert('Error', 'Failed to update addresses. Please try again.');
            }

        } catch (error) {
            console.error('Error updating addresses:', error);
            Alert.alert('Error', 'Failed to update addresses. Please try again.');
        }
    };

    return (
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
                    headerTitle: "Favorite Location Page",
                }}
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.addressCard}>
                        <Text style={styles.addressLabel}>Current Home Address:</Text>
                        <Text style={styles.addressTextAdvanced}>{currenthomeAddress}</Text>

                        <Text style={styles.addressLabel}>Current Work Address:</Text>
                        <Text style={styles.addressTextAdvanced}>{currentworkAddress}</Text>
                    </View>

                    <View style={styles.card}>
                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={locations}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Home Address"
                            onChange={item => setHomeAddress(item.label)}
                        />

                        <Dropdown
                            style={styles.dropdown}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            data={locations}
                            labelField="label"
                            valueField="value"
                            placeholder="Select Work Address"
                            onChange={item => setWorkAddress(item.label)}
                        />

                        <TouchableOpacity style={styles.updateButton} onPress={handleUpdateAddress}>
                            <Text style={styles.buttonText}>Update Addresses</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SIZES.medium,
        backgroundColor: COLORS.lightestBlue,
        marginTop: 50,
    },
    card: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 15,
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    dropdown: {
        borderColor: COLORS.darkBlue,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: COLORS.lightWhite,
        marginBottom: 16,
    },
    saveButton: {
        marginTop: 10,
        height: 50,
        backgroundColor: COLORS.blue,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    updateButton: {
        height: 50,
        backgroundColor: COLORS.blue,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    addressCard: {
        marginBottom: 20,
        padding: 20,
        borderRadius: 20,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.4,
        shadowRadius: 7,
        elevation: 10,
        marginHorizontal: 20,
        borderColor: COLORS.primary,
        borderWidth: 0.5,
        backgroundColor: '#F7F9FC', // light gradient color for better visual effect
    },
    addressLabel: {
        fontSize: SIZES.large,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 5,
    },
    addressTextAdvanced: {
        fontSize: SIZES.medium,
        fontWeight: '700',
        color: COLORS.darkBlue,
        marginBottom: 20,
        borderBottomColor: COLORS.lightBlue,
        borderBottomWidth: 1,
        paddingBottom: 10,
    },
});

export default FavLocationPage;
