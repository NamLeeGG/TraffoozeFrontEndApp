import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

import { ScreenHeaderBtn } from '../../components';

import { COLORS, icons } from '../../constants';
import styles from "./mappage.style";

import TrafficJamIcon from "../../assets/icons/trafficjam.png";
import RoadAccidentIcon from "../../assets/icons/roadaccident.png";
import RoadClosureIcon from "../../assets/icons/roadclosure.png";

const center = { latitude: 1.3521, longitude: 103.8198 };

const getIconForObjType = (message) => {
    const messageLC = message.toLowerCase();
    if (messageLC.includes("heavy traffic")) {
        return TrafficJamIcon;
    } else if (messageLC.includes("accident")) {
        return RoadAccidentIcon;
    } else if (messageLC.includes("road closure") || messageLC.includes("roadblock")) {
        return RoadClosureIcon;
    }
};

const MapPage = () => {
    const [activeMarker, setActiveMarker] = useState(null);
    const [trafficUpdates, setTrafficUpdates] = useState([]);

    const router = useRouter();
    // useRef for the currently active marker
    const activeMarkerRef = React.useRef(null);

    const BASE_ICON_SIZE = { width: 30, height: 30 }; 

    useEffect(() => {
        fetchTrafficUpdates();
    }, []);

    function fetchTrafficUpdates() {
        axios.get('https://traffooze-flask.onrender.com/traffic_icons')
            .then(response => {
                const uniqueUpdates = response.data.reduce((acc, current) => {
                    const x = acc.find(item => item.message === current.message);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
                setTrafficUpdates(uniqueUpdates);
            })
            .catch(error => {
                console.error(error);
            });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightBlue }}>
            <StatusBar style="dark" />

            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.lightBlue },
                    headerShadowVisible: false,
                    headerBackVisible: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn
                            iconUrl={icons.left}
                            dimension='60%'
                            handlePress={() => router.back()}
                        />
                    ),
                    headerTitle: "Map Page",
                }}
            />

            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        ...center,
                        latitudeDelta: 0.1822,
                        longitudeDelta: 0.0821,
                    }}
                    onPress={() => setActiveMarker(null)} // This resets the activeMarker when the map is pressed
                >
                    {trafficUpdates.map((update, index) => {
                        const position = {
                            latitude: parseFloat(update.location.split(',')[0]),
                            longitude: parseFloat(update.location.split(',')[1]),
                        };
                        const markerImage = getIconForObjType(update.message);

                        return (
                            <Marker
                                ref={ref => { this[`marker_${index}`] = ref; }}
                                key={index}
                                coordinate={position}
                            >
                                <TouchableOpacity 
                                    onPress={() => {
                                        const currentMarker = this[`marker_${index}`];
                                        if (activeMarkerRef.current) {
                                            const currentIndex = trafficUpdates.indexOf(activeMarkerRef.current);
                                            this[`marker_${currentIndex}`].hideCallout();
                                        }

                                        if (activeMarkerRef.current === update) {
                                            activeMarkerRef.current = null; 
                                            currentMarker.hideCallout();
                                        } else {
                                            activeMarkerRef.current = update;
                                            currentMarker.showCallout();
                                        }
                                        // Only update state at the end
                                        setActiveMarker(activeMarkerRef.current);
                                    }}
                                >
                                    <Image source={markerImage} style={BASE_ICON_SIZE} />
                                </TouchableOpacity>
                                
                                <Callout style={styles.calloutContainer}>
                                    <Text style={styles.calloutText}>
                                        {update.message}
                                    </Text>
                                </Callout>
                            </Marker>
                        );
                    })}
                </MapView>
            </View>
        </SafeAreaView>
    );
}

export default MapPage;
