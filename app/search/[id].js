import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native'
import { Stack, useRouter, useSearchParams } from 'expo-router'
import { Text, SafeAreaView } from 'react-native'
import axios from 'axios'
import useFetch from '../../hook/useFetch'

import { ScreenHeaderBtn, ObjListCard } from '../../components'
import { COLORS, icons, SIZES } from '../../constants'
import styles from '../../styles/search'

const ObjSearch = () => {
    const params = useSearchParams();
    const router = useRouter()
    const { data, isLoading, error } = useFetch();

    const [searchResult, setSearchResult] = useState([]);
    const [searchLoader, setSearchLoader] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [page, setPage] = useState(1);

    // Function to sort the data array based on date and time
    const sortDataByDateTime = (data) => {
        return [...data].sort((a, b) => {
            // Split date and time for both a and b
            const [dayA, monthA, yearA] = a.date.split('/');
            const [hourA, minuteA] = a.time.split(':');
            
            const [dayB, monthB, yearB] = b.date.split('/');
            const [hourB, minuteB] = b.time.split(':');

            // Compare year, then month, then day, then hour, then minute
            if(yearA !== yearB) return yearB - yearA;
            if(monthA !== monthB) return monthB - monthA;
            if(dayA !== dayB) return dayB - dayA;
            if(hourA !== hourB) return hourB - hourA;
            return minuteB - minuteA;
        });
    };

    const handleSearch = async () => {
        setSearchLoader(true);
        setSearchResult([]);
        
        try {
            // First, sort the data by date and time
            const sortedData = sortDataByDateTime(data);
    
            let objsearchlist = [];  // Initialize as empty
    
            if (params.id.toLowerCase() === "all") {
                // Slice sorted data to get only the first 50 items
                objsearchlist = sortedData.slice(0, 50);
            } else {
                objsearchlist = sortedData.filter(item => {
                    const message = item.message.toLowerCase();
                
                    switch (params.id) {
                        case "Traffic Jam":
                            return message.includes("heavy traffic");
                        case "Road Accident":
                            return message.includes("accident");
                        case "Road Closure":
                            return message.includes("road closure") || message.includes("roadblock");
                        default:
                            return message.includes(params.id.toLowerCase());
                    }
                });
            }
    
            setSearchResult(objsearchlist);
        } catch (error) {
            setSearchError(error);
            console.log(error);
        } finally {
            setSearchLoader(false);
        }
    };

    const handlePagination = (direction) => {
        if (direction === 'left' && page > 1) {
            setPage(page - 1)
            handleSearch()
        } else if (direction === 'right') {
            setPage(page + 1)
            handleSearch()
        }
    }

    useEffect(() => {
        if (data) { // Check if data is available before proceeding
            handleSearch();
        }
    }, [data]); // Fetch data when 'data' changes

    useEffect(() => {
        // Fetch data when component mounts
        if (data) { // Check if data is available before proceeding
            handleSearch();
        }
    }, []);   

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightestBlue }}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.lightestBlue },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <ScreenHeaderBtn
                            iconUrl={icons.left}
                            dimension='60%'
                            handlePress={() => router.back()}
                        />
                    ),
                    headerTitle: "",
                }}
            />

            <FlatList
                data={searchResult}
                renderItem={({ item }) => (
                    <ObjListCard
                        item={item}
                        handleNavigate={() => router.push(`/obj-details/${item.message}`)}
                    />
                )}
                keyExtractor={(item) => item.message}
                contentContainerStyle={{ padding: SIZES.medium, rowGap: SIZES.medium }}
                ListHeaderComponent={() => (
                    <>
                        <View style={styles.container}>
                            <Text style={styles.searchTitle}>{params.id}</Text>
                            <Text style={styles.noOfSearchedJobs}>List of the traffic updates based on your search:</Text>
                        </View>
                        <View style={styles.loaderContainer}>
                            {searchLoader ? (
                                <ActivityIndicator size='large' color={COLORS.primary} />
                            ) : searchError && (
                                <Text>Oops something went wrong</Text>
                            )}
                        </View>
                    </>
                )}
                ListFooterComponent={() => (
                    <View style={styles.footerContainer}>
                        <TouchableOpacity
                            style={styles.paginationButton}
                            onPress={() => handlePagination('left')}
                        >
                            <Image
                                source={icons.chevronLeft}
                                style={styles.paginationImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <View style={styles.paginationTextBox}>
                            <Text style={styles.paginationText}>{page}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.paginationButton}
                            onPress={() => handlePagination('right')}
                        >
                            <Image
                                source={icons.chevronRight}
                                style={styles.paginationImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default ObjSearch;