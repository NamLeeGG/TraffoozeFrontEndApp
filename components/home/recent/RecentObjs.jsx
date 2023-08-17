import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";

import styles from "./recentobjs.style";
import { COLORS, SIZES } from "../../../constants";
import RecentObjsCard from "../../common/cards/recent/RecentObjsCard";
import useFetch from "../../../hook/useFetch";

const RecentObjs = () => {
  const router = useRouter();
  const { data, isLoading, error } = useFetch();

  const [selectedObj, setSelectedObj] = useState();

  const handleCardPress = (item) => {
    router.push(`/obj-details/${item.message}`);
    setSelectedObj(item.obj_id);
  };

  // Function to sort the data array based on date and time
  const sortDataByDateTime = (data) => {
    return [...data].sort((a, b) => {
        // Split date and time for both a and b
        const [dayA, monthA, yearA] = a.date.split('/');
        const [hourA, minuteA] = a.time.split(':');
        
        const [dayB, monthB, yearB] = b.date.split('/');
        const [hourB, minuteB] = b.time.split(':');

        // Compare year, then month, then day, then hour, then minute
        if(yearA !== yearB) return yearB - yearA;
        if(monthA !== monthB) return monthB - monthA;
        if(dayA !== dayB) return dayB - dayA;
        if(hourA !== hourB) return hourB - hourA;
        return minuteB - minuteA;
    });
  };

  // Get the 5 newest items
  const newestFiveItems = sortDataByDateTime(data).slice(0, 5);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Most Recent Traffic Updates</Text>
        <TouchableOpacity onPress={() => router.push("/search/all")}>
          <Text style={styles.headerBtn}>Show all</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size='large' color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong</Text>
        ) : (
          <FlatList
            data={newestFiveItems}
            renderItem={({ item }) => (
              <RecentObjsCard
                item={item}
                selectedObj={selectedObj}
                handleCardPress={handleCardPress}
              />
            )}
            keyExtractor={(item) => item.obj_id}
            contentContainerStyle={{ columnGap: SIZES.medium }}
            horizontal
          />
        )}
      </View>
    </View>
  );
};

export default RecentObjs;