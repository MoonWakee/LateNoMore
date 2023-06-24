import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import React, { useState, useContext } from "react";
import PlaceCard from "./PlaceCard";
import { SwipeListView } from "react-native-swipe-list-view";
import AppContext from "../../navigation/AppContext.js";
import { deletePlaceItem, getAlarmNotificationIds } from "../../Crud";
import { cancelNotification } from "../Notification";

export default function PlaceList({ placeData }) {
    let [curOpened, setCurOpened] = useState(-1);
    const { isModified, setIsModified } = useContext(AppContext);

    const placeItem = ({ item }) => {
        return (
            <PlaceCard
                id={item.id}
                start={item.start}
                end={item.end}
                data={item.data}
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
                            onPress={() => rowMap[data.item.id].closeRow()}
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
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={async () => {
                                let old_notifications =
                                    await getAlarmNotificationIds(
                                        (alarm_id = curOpened) 
                                    ); console.log('here', old_notifications)
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
                                deletePlaceItem(curOpened);
                                setIsModified(true)

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
                                Delete
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <SwipeListView
                data={placeData}
                numColumns={1}
                renderItem={placeItem}
                rightOpenValue={-175}
                disableRightSwipe
                renderHiddenItem={HiddenItem}
                onSwipeValueChange={handleSwipeValueChange}
                useNativeDriver={false}
                keyExtractor={(item) => item.id}
            />
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
        // aspectRatio: 2,
        width: 270,
        alignSelf: "flex-end",
        height: (Dimensions.get("window").width - 40) * 0.34,
    },
});
