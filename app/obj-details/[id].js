import { Stack, useRouter, useSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import {
  TrafficUpdateDetail,
  ScreenHeaderBtn,
} from "../../components";

import { COLORS, icons, SIZES } from "../../constants";
import useFetch from "../../hook/useFetch";

const ObjDetails = () => {
    const params = useSearchParams();
    const router = useRouter();

    const { data, isLoading, error, refetch } = useFetch();
    const objDetail = data.find(item => item.obj_id == params.id);

    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch()
        setRefreshing(false)
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightBlue }}>
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
                headerTitle: "",
                }}
            />

            <>
                <ScrollView showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {isLoading ? (
                        <ActivityIndicator size='large' color={COLORS.primary} />
                    ) : error ? (
                        <Text>Something went wrong</Text>
                    ) : data.length === 0 ? (
                        <Text>No data available</Text>
                    ) : (
                        <View style={{ padding: SIZES.medium, paddingBottom: 100 }}>
                            <TrafficUpdateDetail
                                obj_type={objDetail.obj_type}
                                date={objDetail.date}
                                time={objDetail.time}
                                message={objDetail.message}
                                location={objDetail.location}
                                address={objDetail.address}
                            />
                        </View>
                    )}
                </ScrollView>
            </>
        </SafeAreaView>
    );
};

export default ObjDetails;