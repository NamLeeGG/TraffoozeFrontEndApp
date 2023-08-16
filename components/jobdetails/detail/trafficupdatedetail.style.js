import { StyleSheet } from "react-native";

import { COLORS, FONT, SIZES } from "../../../constants";

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  logoBox: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: SIZES.large,
  },
  logoImage: {
    width: "80%",
    height: "80%",
  },
  jobTitleBox: {
    marginTop: SIZES.large,
  },
  jobTitle: {
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    fontFamily: FONT.bold,
    textAlign: "center",
  },
  companyInfoBox: {
    marginTop: SIZES.large,
    marginLeft: SIZES.xxLarge,
    flexDirection: 'row',
    flexWrap: 'wrap',  // This allows the content to wrap to the next line
  },
  tableRow: {
    flexDirection: 'row',
    width: '100%',  // occupy full width
    justifyContent: 'space-between',
    marginBottom: SIZES.small,
  },
  tableColumn: {
      flexDirection: 'column',
      width: '48%',  // take up almost half of the space, 2% for potential padding or margin 
  },
  companyName: {
    fontSize: SIZES.large,
    color: COLORS.primary,
    fontFamily: FONT.medium,
  },
  locationBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  locationImage: {
    width: 14,
    height: 14,
    tintColor: COLORS.gray,
  },
  locationName: {
    fontSize: SIZES.medium,
    color: COLORS.black,
    fontFamily: FONT.regular,
    marginLeft: 2,
  },
});

export default styles;
