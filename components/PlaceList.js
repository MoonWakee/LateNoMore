import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Place from "./Place";

export default function PlaceList({placeData}) {

  const placeItem = ({ item }) => {
    return <Place start={item.start} end={item.end} starred={item.starred} />;
  };

  return (
    <View style={styles.container}>
      <FlatList style={styles.container} data={placeData} numColumns={3} renderItem={placeItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10
  }
});
