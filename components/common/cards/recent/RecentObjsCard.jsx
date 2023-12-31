import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./recentobjscard.style";

import TrafficJamIcon from "../../../../assets/icons/trafficjam.png";
import RoadAccidentIcon from "../../../../assets/icons/roadaccident.png";
import RoadClosureIcon from "../../../../assets/icons/roadclosure.png";

const getIconForObjType = (message) => {
  const messageLC = message.toLowerCase();
  if (messageLC.includes("heavy traffic")) {
    return TrafficJamIcon;
  } else if (messageLC.includes("accident")) {
    return RoadAccidentIcon;
  } else if (messageLC.includes("road closure") || messageLC.includes("roadblock")) {
    return RoadClosureIcon;
  } else {
    return { uri: 'https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg' };
  }
};

const RecentObjsCard = ({ item, selectedObj, handleCardPress }) => {
  return (
    <TouchableOpacity
      style={styles.container(selectedObj, item)}
      onPress={() => handleCardPress(item)}
    >
      <TouchableOpacity style={styles.logoContainer(selectedObj, item)}>
        <Image
          source={getIconForObjType(item['message'])}
          resizeMode='contain'
          style={styles.logoImage}
        />
      </TouchableOpacity>

      <Text style={styles.companyName} numberOfLines={1}>
        {item.date} - {item.time}
      </Text>

      <View style={styles.infoContainer}>
        <Text style={styles.jobName(selectedObj, item)} numberOfLines={1}>
          {item.message}
        </Text>
        <View style={styles.infoWrapper}>
          <Text style={styles.publisher(selectedObj, item)} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecentObjsCard;