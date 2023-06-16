import React, { useContext, useMemo, useState, useEffect } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { SearchBar } from "@rneui/base";
import PlaceList from "./PlaceComponents/PlaceList";
import { useNavigation } from "@react-navigation/native";
import AppContext from "../navigation/AppContext";
import { getItems } from "../Crud";

export default function Home() {
    const searchBarOS = Platform.OS === "ios" ? "ios" : "Android";
    const [search1, setSearch1] = useState("");
    const [search2, setSearch2] = useState("");
    const updateSearch1 = (search1) => {
        setSearch1(search1);
    };
    const updateSearch2 = (search2) => {
        setSearch2(search2);
    };

    const { isModified, setIsModified } = useContext(AppContext);

    const [placeData, setPlaceData] = useState([]);

    const filteredPlaceData = useMemo(() => {
        if (search1 || search2) {
            return placeData.filter((place) => {
                return (
                    place.start.toLowerCase().includes(search1.toLowerCase()) &&
                    place.end.toLowerCase().includes(search2.toLowerCase())
                );
            });
        } else {
            return placeData;
        }
    }, [placeData, search1, search2]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const items = await getItems();
            //Reversing the item in items so that the newly created is shown on top
            const newData = items.reverse().map((item) => ({
                id: item.id,
                start: item.start,
                end: item.end,
                data: item.data,
            }));

            setPlaceData(newData);
        } catch (error) {
            console.log(error);
        }
    };

    if (isModified) {
        fetchItems().then(() => setIsModified(false));
    }

    //return starts here

    return (
        <>
            <SafeAreaView style={{ flex: 1 }}>
                <View
                    style={{
                        flexDirection: "row",
                    }}
                >
                    <View style={styles.rowView}>
                        <SearchBar
                            containerStyle={{
                                backgroundColor: "#a8bbd6",
                            }}
                            inputContainerStyle={{ backgroundColor: "white" }}
                            // cancelButtonProps={{
                            //     color: 'red',
                            //     borderWidth: 1
                            //   }}
                            style={styles.searchBarStyle}
                            platform={searchBarOS}
                            placeholder="Where you at?"
                            onChangeText={updateSearch1}
                            value={search1}
                            searchIcon={{
                                type: "font-awesome",
                                name: "location-arrow",
                                color: "gray",
                                // width: 30,
                            }}
                        />
                    </View>
                    <View style={[styles.rowView]}>
                        <SearchBar
                            containerStyle={{ backgroundColor: "#a8bbd6" }}
                            inputContainerStyle={{ backgroundColor: "white" }}
                            style={styles.searchBarStyle}
                            platform={searchBarOS}
                            placeholder="Where to?"
                            onChangeText={updateSearch2}
                            value={search2}
                            searchIcon={{
                                type: "font-awesome",
                                name: "flag",
                                color: "gray",
                                // width: 30,
                            }}
                        />
                    </View>
                </View>
                <View style={styles.arc} />
                <PlaceList
                    style={styles.folderView}
                    placeData={filteredPlaceData}
                />
            </SafeAreaView>
            {/* <View style={styles.revarc} /> */}

            <View style={styles.bottomView} />
        </>
    );
}

const styles = StyleSheet.create({
    rowView: {
        width: Dimensions.get("window").width / 2,
        flexDirection: "row",
        height: 85,
    },
    searchBarStyle: {
        flex: 1,
    },
    folderView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    // overlay: {
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     bottom: 0,
    //     backgroundColor: "rgba(0, 0, 0, 0.5)",
    //     zIndex: 9999,
    // },
    bottomView: {
        height: 90,
        backgroundColor: "white",
        // backgroundColor: "#a8bbd6",
    },
    arc: {
        height: 30,
        backgroundColor: "#a8bbd6",
        borderBottomLeftRadius: 70,
        borderBottomRightRadius: 70,
    },
    revarc: {
        height: 30,
        backgroundColor: "#a8bbd6",
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70,
    },
});
