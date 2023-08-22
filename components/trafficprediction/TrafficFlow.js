import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

import { COLORS, icons, images, SIZES, FONT } from "../../constants";

const TrafficFlow = () => {
    const [roads, setRoads] = useState([]);
    const [selectedRoad, setSelectedRoad] = useState({});  // Changed to an empty object
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [forecastSpeed, setForecastSpeed] = useState([]);
    const [forecastTimestamps, setForecastTimestamps] = useState([]);
    const [forecastSummary, setForecastSummary] = useState(null);
    const [mode, setMode] = useState('date');  // possible values: 'date', 'time'
    const [showDate, setShowDate] = useState(false);
    const [showTime, setShowTime] = useState(false);

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);

    const fetchMetadata = async () => {
        try {
            const response = await axios.get('https://traffooze-flask.onrender.com/metadata');
            setRoads(response.data.map(road => ({
                value: road.road_id,
                label: road.description
            })));
        } catch (error) {
            setError(error);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMetadata();
    }, []);

    const onDateChange = (event, selectedValue) => {
        if (event.type === 'set') { // when a date/time is selected
            if (mode === 'date') {
                setDate(new Date(selectedValue));
                setShowDate(false);
                setMode('time');
                setShowTime(true);
            } else {
                const currentTime = selectedValue;
                let tempDate = date; // This will take the date from the state
    
                // Check if the selected date is the current date
                const now = new Date();
                if (tempDate.toDateString() === now.toDateString()) {
                    // check if the selected time is earlier than the current time
                    if (currentTime < now) {
                        // set the time to the current time
                        setDate(now);
                    } else {
                        const finalDateTime = new Date(
                            tempDate.getFullYear(),
                            tempDate.getMonth(),
                            tempDate.getDate(),
                            currentTime.getHours(),
                            currentTime.getMinutes()
                        );
                        setDate(finalDateTime);
                    }
                }
                // Check if the selected date is the maximum date (5 days from now)
                else if (tempDate.toDateString() === maxDate.toDateString()) {
                    // check if the selected time is later than the current time
                    if (currentTime.getHours() > now.getHours() ||
                        (currentTime.getHours() === now.getHours() && currentTime.getMinutes() > now.getMinutes())) {
                        // set the time to the current time
                        setDate(now);
                    } else {
                        const finalDateTime = new Date(
                            tempDate.getFullYear(),
                            tempDate.getMonth(),
                            tempDate.getDate(),
                            currentTime.getHours(),
                            currentTime.getMinutes()
                        );
                        setDate(finalDateTime);
                    }
                } else {
                    const finalDateTime = new Date(
                        tempDate.getFullYear(),
                        tempDate.getMonth(),
                        tempDate.getDate(),
                        currentTime.getHours(),
                        currentTime.getMinutes()
                    );
                    setDate(finalDateTime);
                }
                setShowTime(false);
            }
        } else {
            if (mode === 'date') setShowDate(false);
            else setShowTime(false);
        }
    };

    function formatDateToLocalISOString(date) {
        const pad = num => String(num).padStart(2, '0');
    
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1); // Months are 0-based
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        const seconds = pad(date.getSeconds());
    
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };    

    const handleGenerateForecast = () => {
        setIsLoading(true);

        if (selectedRoad.value && date) {  
            const roadId = selectedRoad.value;
            const formattedDate = formatDateToLocalISOString(date);

            const requestData = {
                road_id: roadId,
                timestamp: formattedDate,
            };
    
            axios.post('https://traffooze-flask.onrender.com/get_traffic_flow', requestData)
                .then(response => {
                    // Handle the response here if needed

                    const forecastSpeed = response.data.speed;
                    const forecastJamfactor = response.data.jamFactor;
                    const forecastTimestamps = response.data.timestamp;

                    const forecastSeries = [
                        {
                            name: 'Speed (Km/h)',
                            data: forecastSpeed,
                        },
                        {
                            name: 'Jam Factor',
                            data: forecastJamfactor,
                        }
                    ];

                    setForecastSpeed(forecastSeries);
                    setForecastTimestamps(forecastTimestamps);
                    setForecastSummary({
                        speed: response.data.speed[0],
                        jamFactor: response.data.jamFactor[0]
                    });                                 

                    setIsLoading(false);
                })
                .catch(error => {
                    // Handle errors
                    Alert.alert("Error", "Error generating forecast: " + error.message);
                });
        } else {
            // Handle the case where either the road or datetime is not selected
            Alert.alert("Warning", "Please select a road and datetime.");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    };

    if (error) {
        return <Text>{`Error: ${String(error.message)}`}</Text>;
    };    

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Road Selection</Text>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={roads}
                labelField="label"
                valueField="value"
                placeholder="Select a road"
                value={selectedRoad.value}  // Changed to access the value field
                onChange={item => setSelectedRoad(item)}  // Set the entire item object
            />

            <Text style={styles.label}>Date and Time</Text>
            <TouchableOpacity onPress={() => { setMode('date'); setShowDate(true); }} style={styles.dateInput}>
                <Text>{date.toLocaleString()}</Text>
            </TouchableOpacity>

            {showDate && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display='default'
                    onChange={onDateChange}
                    minimumDate={new Date()} // from current moment
                    maximumDate={maxDate} // no more than 5 days from now
                />
            )}

            {showTime && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    display='default'
                    onChange={onDateChange}
                />
            )}

            <TouchableOpacity style={styles.forecastButton} onPress={handleGenerateForecast}>
                <Text style={styles.forecastButtonText}>Generate Forecast</Text>
            </TouchableOpacity>

            {
                forecastSummary && (
                    <View style={styles.forecastCard}>
                        <Text style={styles.forecastCardTitle}>Traffic Flow Summary</Text>
                        
                        <View style={styles.forecastCardContent}>
                            <View style={styles.forecastDetail}>
                                <Image source={icons.speed} style={styles.forecastIcon}/>
                                <Text style={styles.forecastDetailText}>Speed: {forecastSummary.speed} m/s</Text>
                            </View>
                            <View style={styles.forecastDetail}>
                                <Image source={icons.trafficjam} style={styles.forecastIcon}/>
                                <Text style={styles.forecastDetailText}>Jam Factor: {forecastSummary.jamFactor}</Text>
                            </View>
                        </View>
                    </View>
                )
            }

        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',  // To center the ActivityIndicator horizontally
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.darkGray,
        marginBottom: 8, // You can adjust this value based on your needs
    },
    container: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    dropdown: {
        height: 50,
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: COLORS.lightWhite,
        marginBottom: 16,  // Add some margin at the bottom for spacing
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    dateInput: {
        height: 50,
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: COLORS.lightWhite,
        justifyContent: 'center',  // Vertically center the text inside
    },
    forecastButton: {
        height: 50,
        backgroundColor: COLORS.blue,  // Feel free to change the color
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,  // Spacing from the top
        paddingHorizontal: 20
    },
    forecastButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    forecastCard: {
        marginTop: 20,
        padding: 20,
        borderRadius: 15,
        backgroundColor: '#f7f9fc',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        justifyContent: 'center', 
        alignItems: 'center',   
    },
    forecastCardContent: {
        alignItems: 'center',
    },
    forecastCardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    forecastDetail: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    forecastIcon: {
        marginRight: 15,
        width: 24,
        height: 24,
    },
    forecastDetailText: {
        fontSize: 16,
        color: '#333',
    },
});

export default TrafficFlow;
