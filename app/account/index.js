import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { COLORS, icons, SIZES, FONT } from "../../constants";
import { ScreenHeaderBtn } from "../../components";

const AccountPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogOut = () => {
        setLoading(true);

        global.token = null;
        global.accountName = null;

        setLoading(false);

        Alert.alert('Success', 'You have successfully logged out!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
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
                    headerTitle: "Account",
                }}
            />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View
                    style={styles.cardContainer}
                >
                    <Text style={{ ...FONT.regular, marginBottom: SIZES.medium, fontSize: SIZES.medium }}>Account Name: </Text>
                    <Text style={styles.accountNameText}>{global.accountname}</Text>
                    <TouchableOpacity
                            onPress={handleLogOut}
                            style={{
                                backgroundColor: 'red',
                                padding: 20,
                                borderRadius: 10,
                                marginBottom: 30,
                                marginTop: 40,
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
                                    Log Out
                                </Text>
                            )}
                        </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    cardContainer: {
        flex: 0.5,
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
        marginBottom: SIZES.xxLarge+50,
    },
});

export default AccountPage;
