import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';

import { COLORS, icons, images, SIZES, FONT } from "../../constants";
import { ScreenHeaderBtn } from "../../components";

const erpPage = () => {
    const router = useRouter();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zones, setZones] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [timeRanges, setTimeRanges] = useState([]);
    const [selectedZone, setSelectedZone] = useState({});
    const [selectedVehicleType, setSelectedVehicleType] = useState({});
    const [selectedTimeRange, setSelectedTimeRange] = useState({});
    const [chargeAmount, setChargeAmount] = useState(null);
    const [dayTypes, setDayTypes] = useState([]);
    const [selectedDayType, setSelectedDayType] = useState({});


    const fetchData = async (selectedZone, selectedVehicleType) => {
        try {
            const response = await axios.get('https://traffooze-flask.onrender.com/erp');
            setData(response.data);
            
            const distinctZones = [...new Set(response.data.map(item => item.ZoneID))];
            setZones(distinctZones.map(zone => ({ label: zone, value: zone })));
            
            const distinctVehicleTypes = [...new Set(response.data.map(item => item.VehicleType))];
            setVehicleTypes(distinctVehicleTypes.map(type => ({ label: type, value: type })));

            const distinctDayTypes = [...new Set(response.data.map(item => item.DayType))];
            setDayTypes(distinctDayTypes.map(day => ({ label: day, value: day })));
            
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };     
    
    const updateTimeRanges = () => {
        if (data) {
            const filteredData = data.filter(item => 
                item.ZoneID === selectedZone.value && 
                item.VehicleType === selectedVehicleType.value &&
                item.DayType === selectedDayType.value
            );
            const timeRangeStrings = filteredData.map(item => `${item.StartTime} - ${item.EndTime}`);
            const distinctTimeRanges = [...new Set(timeRangeStrings)];
    
            // Sorting time ranges in ascending order
            const sortedTimeRanges = distinctTimeRanges.sort((a, b) => {
                const [startA, endA] = a.split(' - ');
                const [startB, endB] = b.split(' - ');
    
                if (startA < startB) return -1;
                if (startA > startB) return 1;
                if (endA < endB) return -1;
                if (endA > endB) return 1;
                return 0;
            });
    
            if (sortedTimeRanges.length === 0) {
                // If there are no time ranges, set a default message
                setTimeRanges([{ label: "No Time Range Found", value: "" }]);
            } else {
                setTimeRanges(sortedTimeRanges.map(range => ({ label: range, value: range })));
            }
        }
    };    

    useEffect(() => {
        fetchData();
    }, []);

    // New useEffect to update time ranges when selectedZone or selectedVehicleType changes
    useEffect(() => {
        updateTimeRanges();
    }, [selectedZone, selectedVehicleType, selectedDayType]);    
    

    const generateChargeAmount = () => {
        const foundItem = data.find(item => 
            item.ZoneID === selectedZone.value && 
            item.VehicleType === selectedVehicleType.value &&
            item.DayType === selectedDayType.value &&
            `${item.StartTime} - ${item.EndTime}` === selectedTimeRange.value
        );        
        if (foundItem) {
            setChargeAmount(foundItem.ChargeAmount);
        } else {
            setChargeAmount('Not found');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
                <View style={{ flex: 1, padding: SIZES.medium }}>
                    {loading ? (
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    ) : (
                        <>
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={zones}
                                labelField="label"
                                valueField="value"
                                placeholder="Select a Zone"
                                value={selectedZone.value}
                                onChange={item => setSelectedZone(item)}
                            />
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={vehicleTypes}
                                labelField="label"
                                valueField="value"
                                placeholder="Select a Vehicle Type"
                                value={selectedVehicleType.value}
                                onChange={item => setSelectedVehicleType(item)}
                            />
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={dayTypes}
                                labelField="label"
                                valueField="value"
                                placeholder="Select a Day Type"
                                value={selectedDayType.value}
                                onChange={item => setSelectedDayType(item)}
                            />
                            <Dropdown
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                data={timeRanges}
                                labelField="label"
                                valueField="value"
                                placeholder="Select a Time Range"
                                value={selectedTimeRange.value}
                                onChange={item => setSelectedTimeRange(item)}
                            />

                            <TouchableOpacity 
                                style={styles.generateButton} 
                                onPress={generateChargeAmount}
                                disabled={selectedTimeRange.value === ""}  // disable if default message is selected
                            >
                                <Text style={styles.generateButtonText}>Generate Forecast</Text>
                            </TouchableOpacity>

                            {chargeAmount !== null && chargeAmount !== undefined ? 
                                <View style={styles.chargeAmountCard}>
                                    <Text style={styles.chargeAmountLabel}>Charge Amount</Text>
                                    <Text style={styles.chargeAmountValue}>${chargeAmount}</Text>
                                </View> 
                            : null}

                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: COLORS.darkBlue,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: COLORS.lightWhite,
        marginBottom: 16,
    },
    generateButton: {
        height: 50,
        backgroundColor: COLORS.blue,  // Feel free to change the color
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,  // Spacing from the top
        paddingHorizontal: 20
    },
    generateButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    chargeAmountCard: {
        marginTop: 40,
        padding: 20,
        borderRadius: 15,
        backgroundColor: COLORS.tertiary,  // light gray background
        shadowColor: '#000',   // shadow
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,  // for Android
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    chargeAmountLabel: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.black,
    },
    chargeAmountValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.darkBlue,  // or any color you prefer
    },
});

export default erpPage;
