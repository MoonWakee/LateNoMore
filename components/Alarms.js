import { StyleSheet, Text, View, Dimensions, FlatList } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AppContext from "../navigation/AppContext";
import { getAlarmItems } from "../Crud";
import AlarmCard from "./AlarmCard";

export default function Alarms() {
    const { isModified, setIsModified } = useContext(AppContext);

    const [alarmData, setAlarmData] = useState([]);

    useEffect(() => {
        fetchItems();
        console.log(alarmData);
    }, []);

    const fetchItems = async () => {
        try {
            const items = await getAlarmItems();
            const newData = items.reverse().map((item) => ({
                id: item.id,
                place_id: item.place_id,
                hour: item.hour,
                minute: item.minute,
            }));
            console.log(newData);
            setAlarmData(newData);
        } catch (error) {
            console.log(error);
        }
    };

    if (isModified) {
        fetchItems().then(() => setIsModified(false));
    }

    const alarmItem = ({ item }) => {
        return (
            <AlarmCard
                id={item.id}
                place_id={item.place_id}
                hour={item.hour}
                minute={item.minute}
            />
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.arc} />
            <FlatList data={alarmData} renderItem={alarmItem} numColumns={1} />
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
        backgroundColor: "#a8bbd6",
        height: 85,
    },
    searchBarStyle: {
        flex: 1,
    },
    arc: {
        height: 60,
        backgroundColor: "#a8bbd6",
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
    },
    folderView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
