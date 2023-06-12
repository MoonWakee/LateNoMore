import { FlatList, StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";
import PlaceCard from "./PlaceCard";

export default function PlaceList({ placeData }) {
    const placeItem = ({ item }) => {
        return (
            <PlaceCard
                start={item.start}
                end={item.end}
                starred={item.starred}
            />
        );
    };

    return (
        <View style={styles.container}>
            <FlatList data={placeData} numColumns={1} renderItem={placeItem} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});
