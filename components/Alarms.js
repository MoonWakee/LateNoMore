import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useContext, useState } from "react";
import AppContext from "../navigation/AppContext";
import { SearchBar } from "@rneui/base";

export default function Alarms() {
    const searchBarOS = Platform.OS === "ios" ? "ios" : "Android";
    const [search, setSearch] = useState("")
    const updateSearch = (search) => {
        setSearch(search);
    };

    return (
        <View style={styles.container}>                
            <View style={styles.arc} />
            <Text>Alarms</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    rowView: {
        flexDirection: "row",
        backgroundColor: '#a8bbd6',
        height: 85,
    },
    searchBarStyle: {
        flex: 1,
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
    arc: {
        height: 60,
        backgroundColor: "#a8bbd6",
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
    },
});
