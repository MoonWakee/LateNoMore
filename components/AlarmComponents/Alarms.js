import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
    TouchableOpacity,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AppContext from "../../navigation/AppContext";
import {
    getAlarmItems,
    deleteAlarmItem,
    getAlarmNotificationIds,
    getAlarmItemsOn,
} from "../../Crud";
import AlarmCard from "./AlarmCard";
import { SwipeListView } from "react-native-swipe-list-view";
import { cancelNotification } from "../Notification";
import ko from "../../locales/ko";
import en from "../../locales/en";

export default function Alarms() {
    const { isModified, setIsModified, setAlarmItems } = useContext(AppContext);
    const translations = global.appLanguage === "ko" ? ko : en;

    let [curOpened, setCurOpened] = useState(-1);
    const [alarmData, setAlarmData] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const items = await getAlarmItems();
            const newData = items
                .slice() // Create a copy of the original array
                .sort((a, b) => {
                    // Compare by hour first
                    if (a.hour !== b.hour) {
                        return a.hour - b.hour; // Sort by hour in ascending order
                    }

                    // If the hour is the same, compare by minute
                    return a.minute - b.minute; // Sort by minute in ascending order
                })
                .map((item) => ({
                    alarm_id: item.alarm_id,
                    place_id: item.place_id,
                    hour: item.hour,
                    minute: item.minute,
                    isOn: item.isOn,
                    subtract: item.subtract,
                    minus_time: item.minus_time,
                }));
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
                alarm_id={item.alarm_id}
                place_id={item.place_id}
                hour={item.hour}
                minute={item.minute}
                isOn={item.isOn}
                subtract={item.subtract}
                minus_time={item.minus_time}
            />
        );
    };

    const handleSwipeValueChange = (swipeData, swipeRow) => {
        const { key, value } = swipeData;
        if (value < -30) {
            setCurOpened(key);
        }
    };

    const HiddenItem = (data, rowMap) => {
        return (
            <View style={{ flex: 1 }}>
                <View
                    style={[
                        styles.hiddenContainer,
                        { backgroundColor: "#007AFF" },
                    ]}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-end",
                            justifyContent: "flex-end",
                        }}
                    >
                        <View style={{ flex: 1 }}></View>
                        <TouchableOpacity
                            onPress={() =>
                                rowMap[data.item.alarm_id].closeRow()
                            }
                            style={{
                                flex: 1,
                                backgroundColor: "#007AFF",
                                alignItems: "center",
                                justifyContent: "center",
                                height:
                                    (Dimensions.get("window").width - 40) *
                                    0.34,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                            >
                                {translations.swipe_cancel}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async () => {
                                let old_notifications =
                                    await getAlarmNotificationIds(
                                        (alarm_id = curOpened)
                                    );
                                if (old_notifications.length != 3) {
                                    const new_data =
                                        old_notifications.substring(
                                            1,
                                            old_notifications.length - 1
                                        );
                                    const new_arr = new_data.split(",");

                                    new_arr.forEach(async (e) => {
                                        await cancelNotification(e);
                                    });
                                }
                                deleteAlarmItem(curOpened);
                                setIsModified(true);

                                let alarm_length = await getAlarmItemsOn();
                                setAlarmItems(alarm_length);
                            }}
                            style={{
                                flex: 1,
                                height:
                                    (Dimensions.get("window").width - 40) *
                                    0.34,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#F55451",
                                borderTopRightRadius: 15,
                                borderBottomRightRadius: 15,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: "white",
                                    fontWeight: "bold",
                                }}
                            >
                                {translations.swipe_delete}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.arc} />
            {!isModified && (
                <View style={styles.container}>
                    <SwipeListView
                        data={alarmData}
                        renderItem={alarmItem}
                        numColumns={1}
                        rightOpenValue={-175}
                        disableRightSwipe
                        renderHiddenItem={HiddenItem}
                        onSwipeValueChange={handleSwipeValueChange}
                        useNativeDriver={false}
                        keyExtractor={(item) => item.alarm_id}
                    />
                </View>
            )}
            <View style={styles.bottomView} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    hiddenContainer: {
        borderRadius: 15,
        marginTop: 15,
        marginHorizontal: 20,
        backgroundColor: "red",
        // aspectRatio: 2,
        width: 270,
        alignSelf: "flex-end",
        height: (Dimensions.get("window").width - 40) * 0.34,
    },
    rowView: {
        flexDirection: "row",
        backgroundColor: "#a8bbd6",
        height: 85,
    },
    arc: {
        height: 60,
        backgroundColor: "#a8bbd6",
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
    },
    bottomView: {
        height: 90,
        backgroundColor: "white",
        // backgroundColor: "#a8bbd6",
    },
});
