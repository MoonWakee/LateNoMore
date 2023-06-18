import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Alert,
    ActivityIndicator,
    Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon, Input } from "@rneui/base";
import { deletePlaceItem, getPlaceItem } from "../Crud.js";

export default function AlarmCard({ id, place_id, hour, minute }) {
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [data, setData] = useState([]);

    const [modifiedHour, setModifiedHour] = useState(hour);
    const [modifiedMin, setModifiedMin] = useState(minute);

    const [midday, setMidday] = useState("");

    useEffect(() => {
        let newHour = hour;
        let newMin = minute;
        let newMidday = "";

        if (newHour < 12) {
            newMidday = "AM";
            if (newHour == 0) {
                newHour = 12;
            }
        } else {
            newMidday = "PM";
            newHour -= 12;
            if (newHour == 0) {
                newHour = 12;
            }
        }

        setModifiedMin(newMin.toString().padStart(2, "0"));
        setModifiedHour(newHour);
        setMidday(newMidday);
    }, [hour]);

    const navigation = useNavigation();
    const goToPlacePage = () => {
        navigation.navigate("PlacePage", { id, start, end, data });
        setTimeout(() => {
            setIsPressed(false);
        }, 1000);
    };

    const fetchPlaceItem = async () => {
        try {
            const item = await getPlaceItem(place_id);
            setStart(item.start);
            setEnd(item.end);
            setData(item.data);
            console.log(item.start);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchPlaceItem();
    }, [place_id]);

    const [arr, setArr] = useState([]);

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    const iconSettler = (data) => {
        const new_data = data.substring(1, data.length - 1);
        const old_arr = new_data.split(",");
        const new_arr = [];
        old_arr.forEach((e) => new_arr.push(parseInt(e)));
        setArr(new_arr);
    };

    const containerChanger = (len) => {
        if (len <= 2) {
            return {
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: "#a8bbd6",
                alignItems: "center",
                justifyContent: "center",
                margin: 4,
            };
        }
        if (len == 3) {
            return {
                width: 35,
                height: 35,
                margin: 4,
                borderRadius: 22,
                borderWidth: 3,
                borderColor: "#a8bbd6",
                alignItems: "center",
                justifyContent: "center",
            };
        }
        if (len == 4) {
            return {
                width: 30,
                height: 30,
                margin: 1.5,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: "#a8bbd6",
                alignItems: "center",
                justifyContent: "center",
            };
        }
        if (len == 5) {
            return {
                width: 24,
                height: 24,
                margin: 1,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: "#a8bbd6",
                alignItems: "center",
                justifyContent: "center",
            };
        } else {
            return {
                width: 20,
                height: 20,
                margin: 1,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: "#a8bbd6",
                alignItems: "center",
                justifyContent: "center",
            };
        }
    };

    const IconDivs = () => {
        return (
            <View style={styles.iconRow}>
                {data.includes(1) && (
                    <Icon
                        type="font-awesome-5"
                        name="walking"
                        style={styles.iconContainer}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={15}
                    />
                )}
                {data.includes(2) && (
                    <Icon
                        type="font-awesome-5"
                        name="car"
                        style={styles.iconContainer}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={15}
                    />
                )}
                {data.includes(3) && (
                    <Icon
                        type="font-awesome-5"
                        name="bus"
                        style={styles.iconContainer}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={15}
                    />
                )}
                {data.includes(4) && (
                    <Icon
                        type="font-awesome-5"
                        name="train"
                        style={styles.iconContainer}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={15}
                    />
                )}
                {data.includes(5) && (
                    <Icon
                        type="font-awesome-5"
                        name="bicycle"
                        style={styles.iconContainer}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={15}
                    />
                )}
                {data.includes(6) && (
                    <Icon
                        type="ionicon"
                        name="boat"
                        style={styles.iconContainer}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={15}
                    />
                )}
            </View>
        );
    };

    const [isPressed, setIsPressed] = useState(false);

    const handlePressIn = () => {
        setIsPressed(true);
    };

    const handlePressOut = () => {
        setIsPressed(false);
    };

    return (
        // <></>
        <View>
            {end.length === 0 ? (
                <View style={styles.activityContainer}>
                    <ActivityIndicator />
                </View>
            ) : (
                <TouchableWithoutFeedback
                    onPress={() => {
                        handlePressIn();
                        // goToPlacePage();
                    }}
                    onLongPress={() => {
                        handlePressIn();
                        Alert.alert(
                            "Do you want to delete?",
                            `From: ${start} \nTo: ${end}`,
                            [
                                {
                                    text: "Cancel",
                                    style: "cancel",
                                    fontSize: 30,
                                },
                                {
                                    text: "Delete",
                                    onPress: () => {
                                        deletePlaceItem(id);
                                    },
                                    style: "destructive",
                                },
                            ]
                        );
                    }}
                    onPressOut={handlePressOut}
                >
                    <View
                        style={[
                            styles.container,
                            {
                                backgroundColor: isPressed
                                    ? "#e6e6e6"
                                    : "white",
                            },
                        ]}
                    >
                        <View style={{ flex: 1, flexDirection: "column" }}>
                            <View
                                style={{
                                    flex: 3,
                                    alignItems: "flex-start",
                                    justifyContent: "center",
                                }}
                            >
                                <View style={{ flex: 1, flexDirection: "row" }}>
                                    <View
                                        style={{
                                            flex: 1,
                                            marginLeft: 30,
                                            flexDirection: "row",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 60,
                                                fontWeight: "400",
                                            }}
                                        >
                                            {modifiedHour}:{modifiedMin}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: 40,
                                                marginTop: 15,
                                                fontWeight: "300",
                                            }}
                                        >
                                            {midday}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginLeft: 30
                                        }}
                                    >
                                        <Switch
                                            trackColor={{
                                                false: "#767577",
                                                true: "#6CE200",
                                            }}
                                            thumbColor={"white"}
                                            ios_backgroundColor="#3e3e3e"
                                            onValueChange={toggleSwitch}
                                            value={isEnabled}
                                            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
                                            />
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    flex: 2.2,
                                    flexDirection: "row",
                                    marginLeft: 10,
                                }}
                            >
                                <View
                                    style={{
                                        justifyContent: "center",
                                        flex: 1.3,
                                        marginLeft: 10,
                                    }}
                                >
                                    <View style={{ flexDirection: "row" }}>
                                        <Icon
                                            type="font-awesome"
                                            name="location-arrow"
                                            color="#2596be"
                                            size={25}
                                            width={25}
                                        />
                                        <Text
                                            style={{
                                                fontSize:
                                                    start.length < 20 ? 18 : 13,
                                                marginLeft: 10,
                                                fontWeight: "300",
                                                flexShrink: 1,
                                            }}
                                        >
                                            {start}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: "row" }}>
                                        <Icon
                                            type="font-awesome"
                                            name="flag"
                                            color="#cd5554"
                                            size={22}
                                            width={25}
                                        />
                                        <Text
                                            style={{
                                                marginLeft: 10,
                                                fontWeight: "300",
                                                fontSize:
                                                    end.length < 20 ? 18 : 13,
                                                flexShrink: 1,
                                            }}
                                        >
                                            {end}
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: "center",
                                    }}
                                >
                                    <IconDivs />
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    activityContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        borderRadius: 15,
        justifyContent: "center",
        alignSelf: "center",
        margin: 15,
        aspectRatio: 3,
        height: (Dimensions.get("window").width - 40) * 0.34,
        Width: Dimensions.get("window").width - 60,
        shadowColor: "#000",
        shadowRadius: 10,
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: 5,
        },
    },
    columnContainer: {
        flex: 1,
        flexDirection: "column",
    },
    iconContainer: {
        width: 20,
        height: 20,
        margin: 3,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: "#a8bbd6",
        alignItems: "center",
    },
    lineParent: {
        marginLeft: "10%",
    },
    line: {
        borderWidth: 1,
        justifyContent: "flex-start",
        marginLeft: 10,
        height: 40,
        top: 0,
        alignSelf: "flex-start",
        flexDirection: "column",
    },
    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    textStyle: {
        fontSize: 22,
        maxWidth: "90%",
        textAlign: "center",
    },
    textParent: {
        flex: 1,
    },
    iconRow: {
        flex: 1,
        // backgroundColor: "#F2BA93",
        flexDirection: "row",
        alignItems: "center",
    },
    lineRow: {
        height: (Dimensions.get("window").width - 40) * 0.34,
        width: 7,
        backgroundColor: "#F2BA93",
        marginRight: 10,
        // alignItems: "center",
        // flexDirection: "row",
    },
    leftTrans: {
        flex: 0.25,
        alignItems: "center",
        // backgroundColor: 'red',
    }
});
