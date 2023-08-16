import React from 'react';
import { SafeAreaView, View} from 'react-native';
import MapView from 'react-native-maps';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ScreenHeaderBtn } from '../../components';

import { COLORS, icons } from '../../constants';
import styles from "./mappage.style";

const MapPage = () => {
    const router = useRouter();

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
                <MapView style={styles.map} />
            </View>
        </SafeAreaView>
    );
}

export default MapPage;