import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import AppContext from "../navigation/AppContext";

export default function PlacePage({ route }) {
    const { id, start, end, data } = route.params;
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: start + "-->" + end,
        });
    }, [navigation, start, end]);

    const {isOpen} = useContext(AppContext);

    return (
        <View style={styles.container}>
            <Text>{start}</Text>
            <Text>{end}</Text>
            <Text>{start}</Text>
            {isOpen && <View style={styles.overlay} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 9999
  }
});
