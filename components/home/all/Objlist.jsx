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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Traffic Updates</Text>
      </View>

      <View style={styles.cardsContainer}>
        {isLoading ? (
          <ActivityIndicator size='large' color={COLORS.primary} />
        ) : error ? (
          <Text>Something went wrong</Text>
        ) : (
          data?.map((obj) => (
            <ObjListCard
              item={obj}
              key={`nearby-obj-${obj.obj_id}`}
              handleNavigate={() => router.push(`/obj-details/${obj.obj_id}`)}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default Objlist;