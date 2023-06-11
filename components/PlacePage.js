import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function PlacePage({ route }) {
    const { start, end, starred } = route.params;
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerTitle: start + "-->" + end,
        });
    }, [navigation, start, end]);

    return (
        <View style={styles.container}>
            <Text>{start}</Text>
            <Text>{end}</Text>
            <Text>{start}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});
