import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { COLORS, icons, images, SIZES, FONT } from "../../constants";
import { ScreenHeaderBtn, TrafficFlow} from "../../components";


const TrafficFlowPage = () => {
    const router = useRouter();

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
                    headerTitle: "Traffic Flow",
                }}
            />
  
            <ScrollView showsVerticalScrollIndicator={false}>
                <View
                    style={{
                        flex: 1,
                        padding: SIZES.medium,
                    }}
                >
                    <TrafficFlow />
                </View>
            </ScrollView>
  
        </SafeAreaView>
    );

};

export default TrafficFlowPage;