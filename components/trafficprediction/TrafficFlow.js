import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import Autocomplete from "react-native-dropdown-autocomplete";
import DateTimePicker from '@react-native-community/datetimepicker';
import { BarChart } from 'react-native-charts-wrapper';

const TrafficFlow = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [roads, setRoads] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    
    useEffect(() => {
        setIsLoading(true);
        fetchMetadata();
    }, []);

    function fetchMetadata() {
        axios.get('https://traffooze-flask.onrender.com/metadata')
            .then(response => {
                setRoads(response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleRoadSelection = (value) => {
        // Handle the selected road value
        console.log("Selected road:", value);
    }

    const handleGenerateForecast = () => {
        console.log("Generating Forecast...");
    }

    return (
        <View style={styles.container}>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <View>
                    <Text>Select a road:</Text>
                    <Autocomplete
                        data={roads}
                        valueExtractor={item => item.description}
                        onSelect={value => handleRoadSelection(value)}
                    />
                    <Button title="Select Date" onPress={() => setDatePickerVisible(true)} />
                    {datePickerVisible && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="datetime"
                            onChange={(event, date) => {
                                setDatePickerVisible(false);
                                if (date) setSelectedDate(date);
                            }}
                        />
                    )}
                    <Button title="Generate Forecast" onPress={handleGenerateForecast} />
                    
                    <BarChart
                        style={{ flex: 1, height: 300 }}
                        data={{
                            dataSets: [{
                                values: [/* your chart data here */],
                                label: 'Dataset label'
                            }]
                        }}
                        chartDescription={{text: ''}}
                        xAxis={{valueFormatter: 'number'}}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    }
});

export default TrafficFlow;
