import { View, Text, TouchableOpacity, Image } from "react-native";

import styles from "./objlistcard.style";

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

const ObjListCard = ({ item, handleNavigate }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={handleNavigate}>
      <TouchableOpacity style={styles.logoContainer}>
        <Image
          source={getIconForObjType(item['message'])}
          resizeMode='contain'
          style={styles.logImage}
        />
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text style={styles.jobName} numberOfLines={1}>
          {item.message}
        </Text>

        <Text style={styles.jobType}>
          {item.date} - {item.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ObjListCard;