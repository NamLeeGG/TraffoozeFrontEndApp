import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONT } from "../../constants";

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    calloutContainer: {
        padding: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',  // semi-transparent white
        borderRadius: 8,  // rounded corners
        width: 250,  // fixed width
    },
    calloutText: {
        fontSize: 13,
    },
});

export default styles;
