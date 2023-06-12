import React, { useContext, useMemo, useState } from "react";
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
import PlaceList from "./PlaceList";
import { useNavigation } from "@react-navigation/native";
import AppContext from "../navigation/AppContext";

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
    const { isOpen } = useContext(AppContext);

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
        setPlaceData([...placeData, newItem]);
    };

    //return starts here

    return (
        <>
            {isOpen && <View style={styles.overlay} />}

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
                    <View style={[styles.rowView]}>
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
                <View style={styles.bottomView} />
                <TouchableOpacity onPress={addPlaceData}>
                    <View>
                        <Text style={styles.button}>SUP</Text>
                    </View>
                </TouchableOpacity>
                {/* <View style={styles.bottomView}>
                <TouchableOpacity onPress={goToCreate}>
                    <View>
                        <Text style={styles.button}>SUP</Text>
                    </View>
                </TouchableOpacity>
                
            </View> */}
            </SafeAreaView>
        </>
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
        justifyContent: "center",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
    },
    bottomView: {
        flex: 0.1,
    }
});
