import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon, Input } from "@rneui/base";
import DashedLine from "react-native-dashed-line";

export default function PlaceCard({ id, start, end, data }) {
    const navigation = useNavigation();
    const goToPlacePage = () => {
        navigation.navigate("PlacePage", { id, start, end, data });
    };

    const [arr, setArr] = useState([]);

    const iconSettler = (data) => {
        const new_data = data.substring(1, data.length - 1);
        const old_arr = new_data.split(",");
        const new_arr = [];
        old_arr.forEach((e) => new_arr.push(parseInt(e)));
        setArr(new_arr);
    };

    useEffect(() => {
        iconSettler(data);
    }, [data]);

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

    const sizeChanger = (len) => {
        if (len <= 2) {
            return 26;
        }
        if (len == 3) {
            return 22;
        }
        if (len == 4) {
            return 18;
        }
        if (len == 5) {
            return 15;
        } else {
            return 11;
        }
    };
    const IconDivs = () => {
        return (
            <View style={styles.iconRow}>
                {data.includes(1) && (
                    <Icon
                        type="font-awesome-5"
                        name="walking"
                        style={containerChanger(arr.length)}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={sizeChanger(arr.length)}
                    />
                )}
                {data.includes(2) && (
                    <Icon
                        type="font-awesome-5"
                        name="car"
                        style={containerChanger(arr.length)}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={sizeChanger(arr.length)}
                    />
                )}
                {data.includes(3) && (
                    <Icon
                        type="font-awesome-5"
                        name="bus"
                        style={containerChanger(arr.length)}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={sizeChanger(arr.length)}
                    />
                )}
                {data.includes(4) && (
                    <Icon
                        type="font-awesome-5"
                        name="train"
                        style={containerChanger(arr.length)}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={sizeChanger(arr.length)}
                    />
                )}
                {data.includes(5) && (
                    <Icon
                        type="font-awesome-5"
                        name="bicycle"
                        style={containerChanger(arr.length)}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={sizeChanger(arr.length)}
                    />
                )}
                {data.includes(6) && (
                    <Icon
                        type="ionicon"
                        name="boat"
                        style={containerChanger(arr.length)}
                        backgroundColor="#a8bbd6"
                        color="white"
                        size={sizeChanger(arr.length)}
                    />
                )}
            </View>
        );
    };

    return (
        <TouchableWithoutFeedback onPress={goToPlacePage}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <View style={styles.leftTrans}>
                        <View style={styles.row}>
                            <IconDivs />
                            <View style={styles.lineRow}>
                                <Text></Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.columnContainer}>
                        <View style={styles.iconContainer}>
                            <Icon
                                type="font-awesome"
                                name="location-arrow"
                                color="#2596be"
                                size={30}
                                width={30}
                            />
                            <View style={{ marginLeft: 20, marginTop: 5 }}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        color: "gray",
                                    }}
                                >
                                    {start.length < 27
                                        ? `${start}`
                                        : `${start.substring(0, 26)}...`}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.iconContainer}>
                            <Icon
                                type="font-awesome"
                                name="flag"
                                color="#cd5554"
                                size={30}
                                width={30}
                            />
                            <View style={{ marginLeft: 20, marginTop: 5 }}>
                                <Text
                                    style={{
                                        fontSize: 18,
                                        fontWeight: "bold",
                                        color: "gray"
                                    }}
                                >
                                    {end.length < 27
                                        ? `${end}`
                                        : `${end.substring(0, 26)}...`}{" "}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#A7BAD3",
        backgroundColor: "white",
        borderRadius: 15,
        justifyContent: "center",
        // borderColor: "#dd602d",
        // backgroundColor: '#92A8D1',
        // borderColor: "#e32f45",
        // borderLeftWidth: 3,
        // borderBottomWidth: 8,
        // borderTopWidth: 5,
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
        flex: 1,
        flexDirection: "row",
        paddingTop: 12,
        marginBottom: 12,
        marginLeft: 5,
        marginRight: 35,
        borderBottomWidth: 1,
        borderColor: "gray",
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
        flexDirection: "column",
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
    },
});
