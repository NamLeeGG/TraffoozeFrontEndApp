import { StyleSheet } from "react-native";
import { COLORS, FONT, SHADOWS, SIZES } from "../../../../constants";

const styles = StyleSheet.create({
  container: (selectedObj, item) => ({
    width: 250,
    padding: SIZES.xLarge,
    backgroundColor: selectedObj === item.obj_id ? COLORS.primary : "#FFF",
    borderRadius: SIZES.medium,
    justifyContent: "space-between",
    ...SHADOWS.medium,
    shadowColor: COLORS.white,
  }),
  logoContainer: (selectedObj, item) => ({
    width: 50,
    height: 50,
    backgroundColor: selectedObj === item.obj_id ? "#FFF" : COLORS.white,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  }),
  logoImage: {
    width: "70%",
    height: "70%",
  },
  companyName: {
    fontSize: SIZES.medium,
    fontFamily: FONT.regular,
    color: "#B3AEC6",
    marginTop: SIZES.small / 1.5,
  },
  infoContainer: {
    marginTop: SIZES.large,
  },
  jobName: (selectedObj, item) => ({
    fontSize: SIZES.large,
    fontFamily: FONT.medium,
    color: selectedObj === item.obj_id ? COLORS.white : COLORS.primary,
  }),
  infoWrapper: {
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  publisher: (selectedObj, item) => ({
    fontSize: SIZES.medium - 2,
    fontFamily: FONT.bold,
    color: selectedObj === item.obj_id ? COLORS.white : COLORS.primary,
  }),
  location: {
    fontSize: SIZES.medium - 2,
    fontFamily: FONT.regular,
    color: "#B3AEC6",
  },
});

export default styles;
