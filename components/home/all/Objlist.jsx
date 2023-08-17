import React from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import styles from "./objlist.style";
import { COLORS } from "../../../constants";
import ObjListCard from "../../common/cards/all/ObjListCard";
import useFetch from "../../../hook/useFetch";

const Objlist = () => {
  const router = useRouter();
  const { data, isLoading, error } = useFetch();

  // Function to format a Date object into "DD/MM/YYYY" format
  const formatDate = (dateObj) => {
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are zero-based
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // Function to sort based on date and time
  const sortUpdatesByDateTime = (updates) => {
    return [...updates].sort((a, b) => {
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


  // Get today's date in the "DD/MM/YYYY" format
  const today = formatDate(new Date());

  // Filter data based on today's date
  const todaysUpdates = data?.filter(obj => obj.date === today);
  const sortedTodaysUpdates = sortUpdatesByDateTime(todaysUpdates);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Traffic Updates for {today}</Text>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size='large' color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong</Text>
        ) : (
          sortedTodaysUpdates?.map((obj) => (
            <ObjListCard
              item={obj}
              handleNavigate={() => router.push(`/obj-details/${obj.message}`)}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default Objlist;