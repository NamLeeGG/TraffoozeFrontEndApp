import React from 'react';
import { View, Text, Image } from 'react-native';
import styles from "./trafficupdatedetail.style";

import TrafficJamIcon from "../../../assets/icons/trafficjam.png";
import RoadAccidentIcon from "../../../assets/icons/roadaccident.png";
import RoadClosureIcon from "../../../assets/icons/roadclosure.png";

const getIconForObjType = (type) => {
  switch (type) {
    case 'traffic jam':
      return TrafficJamIcon;
    case 'road closure':
      return RoadClosureIcon;
    case 'road accident':
      return RoadAccidentIcon;
    default:
      return { uri: 'https://t4.ftcdn.net/jpg/05/05/61/73/360_F_505617309_NN1CW7diNmGXJfMicpY9eXHKV4sqzO5H.jpg' };
  }
};

const TrafficUpdateDetail = ({ obj_type, date, time, message, location, address }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Image
          source={getIconForObjType(obj_type)}
          style={styles.logoImage}
        />
      </View>

      <View style={styles.jobTitleBox}>
        <Text style={styles.jobTitle}>{message}</Text>
      </View>

      <View style={styles.companyInfoBox}>
        {/* Row 1 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColumn}>
            <Text style={styles.companyName}>Time:</Text>
            <Text style={styles.locationName}>{date} - {time}</Text>
          </View>
        </View>
        {/* Row 2 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColumn}>
            <Text style={styles.companyName}>Address:</Text>
            <Text style={styles.locationName}>{address}</Text>
          </View>
        </View>
        {/* Row 3 */}
        <View style={styles.tableRow}>
          <View style={styles.tableColumn}>
            <Text style={styles.companyName}>Location:</Text>
            <Text style={styles.locationName}>{location}</Text>
          </View>
          {/* You can add another column here if needed */}
        </View>
      </View>
    </View>
  );
};


export default TrafficUpdateDetail;
