import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

import { COLORS, icons, images, SIZES, FONT } from "../../constants";
import { ScreenHeaderBtn } from "../../components";

const ERPDataCard = ({ item }) => (
    <View style={styles.card}>
        <Text style={styles.cardText}>Vehicle Type: {item.VehicleType}</Text>
        <Text style={styles.cardText}>Day: {item.DayType}</Text>
        <Text style={styles.cardText}>Time: {item.StartTime} - {item.EndTime}</Text>
        <Text style={styles.cardText}>Charge Amount: ${item.ChargeAmount}</Text>
    </View>
);

const erpPage = () => {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://traffooze-flask.onrender.com/erp');
            setData(response.data.slice(0, 50));
            console.log(response.data.slice(0, 50));
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
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
                    headerTitle: "ERP Rates",
                }}
            />
  
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        flex: 1,
                        padding: SIZES.medium,
                    }}
                >
                    {data.map((item) => (
                        <ERPDataCard key={item._id} item={item} />
                    ))}
                </View>
            </ScrollView>
  
        </SafeAreaView>
    );

};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    cardText: {
        fontSize: FONT.regular,
        marginVertical: 5
    }
});

export default erpPage;