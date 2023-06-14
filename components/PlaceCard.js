import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/base";

export default function PlaceCard({ id, start, end, data }) {
    const navigation = useNavigation();
    const goToPlacePage = () => {
        navigation.navigate("PlacePage", { id, start, end, data });
    };

    return (
        <TouchableWithoutFeedback onPress={goToPlacePage}>
            <View style={styles.container}>
                <View style={styles.columnContainer}>
                    <View style={styles.iconContainer}>
                        <View style={styles.row}>
                            <Icon
                                type="font-awesome"
                                name="location-arrow"
                                size={30}
                                width={30}
                            />
                            <View style={styles.textParent}>
                                <Text style={styles.textStyle}>{start}</Text>
                            </View>
                        </View>
                    </View>
                    {/* <View style={styles.lineParent}>
                        <View style={styles.line} />
                    </View> */}
                    <View style={styles.iconContainer}>
                        <View style={styles.row}>
                            <Icon
                                type="font-awesome"
                                name="flag"
                                size={30}
                                width={30}
                            />
                            <View style={styles.textParent}>
                                <Text style={styles.textStyle}>{end}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.timeContainer}>
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                                maxWidth: "90%",
                            }}
                        >
                            <View style={styles.iconRow}>
                                {data.includes(1) && (
                                    <Icon
                                        type="font-awesome-5"
                                        name="walking"
                                        style={styles.transContainer}
                                    />
                                )}
                                {data.includes(2) && (
                                    <Icon
                                        type="font-awesome-5"
                                        name="car"
                                        style={styles.transContainer}
                                    />
                                )}
                                {data.includes(3) && (
                                    <Icon
                                        type="font-awesome-5"
                                        name="bus"
                                        style={styles.transContainer}
                                    />
                                )}
                                {data.includes(4) && (
                                    <Icon
                                        type="font-awesome-5"
                                        name="train"
                                        style={styles.transContainer}
                                    />
                                )}
                                {data.includes(5) && (
                                    <Icon
                                        type="font-awesome-5"
                                        name="bicycle"
                                        style={styles.transContainer}
                                    />
                                )}
                                {data.includes(6) && (
                                    <Icon
                                        type="ionicon"
                                        name="boat"
                                        style={styles.transContainer}
                                    />
                                )}
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
        backgroundColor: "#A7BAD3",
        borderRadius: 15,
        justifyContent: "center",
        alignSelf: "center",
        margin: 15,
        aspectRatio: 3.3,
        height: (Dimensions.get("window").width - 40) * 0.3,
        Width: Dimensions.get("window").width - 40,
        shadowColor: "black",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    },
    columnContainer: {
        flex: 1,
        flexDirection: "column",
    },
    iconContainer: {
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "flex-start",
        marginLeft: "10%",
        marginRight: "10%",
    },
    transContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: "black",
        alignItems: "center",
        justifyContent: "center",
        margin: 4,
    },
    timeContainer: {
        flex: 1,
        // backgroundColor: 'gray',
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
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
        flexDirection: "row",
        alignItems: "center",
    },
});
