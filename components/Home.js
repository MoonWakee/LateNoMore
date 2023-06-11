import React, { useMemo, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    Dimensions,
    Modal,
} from "react-native";
import { SearchBar } from "@rneui/base";
import PlaceList from "./PlaceList";
import { useNavigation } from "@react-navigation/native";

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

    const navigation = useNavigation();
    const goToCreate = () => {
        navigation.navigate("CreatePage");
    };

    const [placeData, setPlaceData] = useState([
        { start: "home", end: "station", starred: true },
        { start: "home", end: "school", starred: true },
        { start: "school", end: "station", starred: true },
        { start: "penthouse", end: "airport", starred: false },
        { start: "home", end: "work", starred: false },
    ]);

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

    const addPlaceData = () => {
        const newItem = { start: "new start", end: "new end", starred: false };
        console.log("added");
        setPlaceData([...placeData, newItem]);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.rowView}>
                    <SearchBar
                        style={styles.searchBarStyle}
                        platform={searchBarOS}
                        placeholder="Where you at?"
                        onChangeText={updateSearch1}
                        value={search1}
                    />
                </View>
                <View style={styles.rowView}>
                    <SearchBar
                        style={styles.searchBarStyle}
                        platform={searchBarOS}
                        placeholder="Where to?"
                        onChangeText={updateSearch2}
                        value={search2}
                    />
                </View>
            </View>
            <PlaceList
                style={styles.folderView}
                placeData={filteredPlaceData}
            />
            {/* <View style={styles.bottomView}>
                <TouchableOpacity onPress={goToCreate}>
                    <View>
                        <Text style={styles.button}>SUP</Text>
                    </View>
                </TouchableOpacity>
                
            </View> */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    rowView: {
        width: Dimensions.get("window").width / 2,
        flexDirection: "row",
    },
    searchBarStyle: {
        flex: 1,
    },
    folderView: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "white",
        justifyContent: "center",
    },
    bottomView: {
        flex: 0.2,
        alignItems: "center",
        backgroundColor: "white",
        justifyContent: "center",
    },
    button: {
        backgroundColor: "skyblue",
        fontSize: 80,
        fontWeight: "bold",
    },
});
