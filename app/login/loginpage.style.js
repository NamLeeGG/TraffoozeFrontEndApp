import { StyleSheet } from 'react-native';
import { COLORS, SIZES, FONT } from "../../constants";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightestBlue,
    },
    logoImage: {
        width: "55%",
        height: "55%",
        alignSelf: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        marginTop: -200,
    },
    title: {
        fontSize: SIZES.xxLarge,
        color: COLORS.primary,
        fontFamily: FONT.bold,
        textAlign: "left",
        marginTop: -140,
        marginBottom: 13,
        marginLeft: 30,
    },
    input: {
        padding: 12,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    button: {
        padding: 15,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 12 // spacing between buttons
    },
    buttonText: {
        color: '#FFF',
        fontWeight: '600', // boldness
        fontSize: 18
    },
    registerButton: {
        borderColor: COLORS.primary,
        borderWidth: 1
    }
});

export default styles;