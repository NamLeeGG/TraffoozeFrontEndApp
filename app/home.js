import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { COLORS, icons, images, SIZES, FONT } from "../constants";
import {
  Objlist,
  RecentObjs,
  ScreenHeaderBtn,
  Welcome,
} from "../components";

const Home = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const drawerWidth = screenWidth * 0.65;
    const animatedPosition = useRef(new Animated.Value(-drawerWidth)).current;

    const toggleDrawer = () => {
        Animated.timing(animatedPosition, {
            toValue: isDrawerOpen ? -drawerWidth : 0,
            duration: 250,
            useNativeDriver: false
        }).start();

        setIsDrawerOpen(!isDrawerOpen);
    };

    const DrawerMenuHeader = () => {
        return (
            <View style={styles.menuHeaderContainer}>
                <Text style={styles.menuHeaderText}>Navigation Bar</Text>
            </View>
        );
    };

    // Handle navigation
    const handleNavigation = (route) => {
      router.push(route);
    };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightBlue }}>
          <StatusBar style="dark" />

          { /* Overlay to detect taps outside the drawer */ }
          {isDrawerOpen && (
            <TouchableOpacity 
                style={styles.overlay}
                onPress={toggleDrawer} 
                activeOpacity={1}
            />
          )}

          <Stack.Screen
              options={{
              headerStyle: { backgroundColor: COLORS.lightBlue },
              headerShadowVisible: false,
              headerLeft: () => (
                  <ScreenHeaderBtn 
                      iconUrl={icons.menu} 
                      dimension='60%' 
                      handlePress={toggleDrawer}
                  />
              ),
              headerRight: () => (
                <ScreenHeaderBtn 
                    iconUrl={images.profile} 
                    dimension='70%' 
                    handlePress={() => {
                      const handlePressAsync = async () => {
                        if (global.token != null) {
                            try {
                                delete global.token;
                                Alert.alert("Success", "Log Out!");
                            } catch (error) {
                                Alert.alert("Error", "Failed to remove the token. Please try again.");
                            }
                        } else {
                            router.push(`/login`);
                        }
                      }
                      handlePressAsync();
                    }}
                />
              ),
              headerTitle: "",
              }}
          />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 1,
              padding: SIZES.medium,
            }}
          >
            <Welcome
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleClick={() => {
                if (searchTerm) {
                  router.push(`/search/${searchTerm}`)
                }
              }}
            />

            <RecentObjs />
            <Objlist />
          </View>
        </ScrollView>

        <Animated.View style={[styles.drawer, { left: animatedPosition }]}>
            <DrawerMenuHeader />
            
            <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigation(`/map`)}>
                <Text style={styles.drawerText}>Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigation(`/flow`)}>
                <Text style={styles.drawerText}>Traffic Flow Forecast</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => handleNavigation(`/count`)}>
                <Text style={styles.drawerText}>Traffic Count Forecast</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.drawerItem} onPress={() => {/* Handle navigation here */}}>
                <Text style={styles.drawerText}>ERP Rates</Text>
            </TouchableOpacity>
            {/* ... */}
        </Animated.View>

      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', // semi-transparent for testing
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

export default Home;
