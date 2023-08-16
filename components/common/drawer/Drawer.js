// DrawerComponent.js
import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONT, SIZES } from "../../../constants";

const DrawerMenuHeader = () => {
    return (
        <View style={styles.menuHeaderContainer}>
            <Text style={styles.menuHeaderText}>Navigation Bar</Text>
        </View>
    );
}

const DrawerComponent = ({ animatedPosition, onClose }) => {
    const router = useRouter();

    const handleNavigation = (route) => {
        onClose();  // Close the drawer
        router.push(route);
    };

    return (
        <Animated.View style={[styles.drawer, { left: animatedPosition }]}>
            <DrawerMenuHeader />
            <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigation(`/`)}>
                <Text style={styles.drawerText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigation(`/map`)}>
                <Text style={styles.drawerText}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => {/* Handle navigation here */}}>
                <Text style={styles.drawerText}>Traffic Predictions</Text>
            </TouchableOpacity>
            {/* ... */}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.1)', // semi-transparent for testing
      zIndex: 1, // ensure it's on top of other content, but below the drawer
    },
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '65%',
        backgroundColor: COLORS.darkBlue,
        padding: 20,
        paddingTop: 60,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        zIndex: 2,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    drawerText: {
        fontSize: SIZES.medium,
        color: COLORS.darkBlue,
        fontWeight: '600',
        marginLeft: 10,  // gives some space if you have an icon with the text
        fontFamily: FONT.regular,
    },
    menuHeaderContainer: {
      paddingVertical: 10,  
      paddingHorizontal: 20, 
      borderBottomWidth: 1,  
      borderBottomColor: '#ddd',  // Color of the line
      marginBottom: 30,  // Space between header and the first item
      marginTop: -20,
    },
    menuHeaderText: {
        fontSize: SIZES.xLarge,
        color: 'white',  // Adjust as needed
        fontWeight: 'bold',
        fontFamily: FONT.bold,
    },
});

export default DrawerComponent;
