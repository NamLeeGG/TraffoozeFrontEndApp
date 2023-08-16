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
    router.push(`/obj-details/${item.obj_id}`);
    setSelectedObj(item.obj_id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Traffic Updates</Text>
        <TouchableOpacity>
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
            data={data}
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