import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import React, { useRef, useContext, useState, useEffect } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Easing, Keyboard } from "react-native";
import AppContext from "../navigation/AppContext";
import { Icon, Input } from "@rneui/base";
import { addItem, getItems } from "../Crud";
import { useNavigation } from "@react-navigation/native";

export default function CreateModal() {
    const sheetRef = useRef(null);
    const snapPoints = ["68%", "78%", "90%"];
    const { setIsOpen, setIsModified } = useContext(AppContext);
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");

    const [keyboardStatus, setKeyboardStatus] = useState(false);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardStatus(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardStatus(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleTransportItemPress = (id) => {
        setTransportData((prevData) =>
            prevData.map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const [transportData, setTransportData] = useState([
        { id: 1, type: "font-awesome-5", name: "walking", selected: false },
        { id: 2, type: "font-awesome-5", name: "car", selected: false },
        { id: 3, type: "font-awesome-5", name: "bus", selected: false },
        { id: 4, type: "font-awesome-5", name: "train", selected: false },
        { id: 5, type: "font-awesome-5", name: "bicycle", selected: false },
        { id: 6, type: "ionicon", name: "boat", selected: false },
    ]);

    const renderTransportItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => handleTransportItemPress(item.id)}
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: item.selected ? "#a8bbd6" : "#d4d4dc",
                        borderWidth: 1,
                        borderColor: "black",
                    },
                ]}
            >
                <Icon
                    type={item.type}
                    name={item.name}
                    size={50}
                    color={item.selected ? "white" : "black"}
                ></Icon>
            </TouchableOpacity>
        );
    };

    const navigation = useNavigation();

    const goToPlacePage = (id, start, end, date) => {
        navigation.navigate("PlacePage", { id, start, end, data });
    };

    const closeAndNavigate = () => {
        setIsModified(true);
        sheetRef.current.close();
        const filteredTransportData = transportData.filter(
            (item) => item.selected === true
        );
        const transports = [];
        filteredTransportData.forEach((item) => {
            transports.push(item.id);
        });
        if (
            input1.trim() != "" &&
            input2.trim() != "" &&
            transports.length != 0
        ) {
            const id = addItem(
                (start = input1),
                (end = input2),
                (data = transports)
            );
            goToPlacePage(id, start, end, data);
        }
    };

    return (
        <BottomSheet
            backgroundStyle={{ backgroundColor: "#1d1e22" }}
            handleIndicatorStyle={{ backgroundColor: "#d4d4dc" }}
            ref={sheetRef}
            index={keyboardStatus ? 2 : 1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => {
                setIsOpen(false);
                setIsModified(true);
            }}
            animationDuration={3}
            animationEasing={Easing.ease}
            backdropComponent={({ style }) => (
                <View style={[style, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
                )}
        >
            <BottomSheetView>
                <View style={styles.container}>
                    <Input
                        value={input1}
                        onChangeText={setInput1}
                        leftIcon={{
                            type: "font-awesome",
                            name: "location-arrow",
                            color: "#d4d4dc",
                        }}
                        leftIconContainerStyle={{ marginRight: 10 }}
                        placeholder="Enter current location..."
                        inputStyle={{ color: "#d4d4dc" }}
                    ></Input>
                </View>
                <View style={styles.container}>
                    <Input
                        value={input2}
                        onChangeText={setInput2}
                        leftIcon={{
                            type: "font-awesome",
                            name: "flag",
                            color: "#d4d4dc",
                        }}
                        leftIconContainerStyle={{ marginRight: 10 }}
                        placeholder="Enter destination..."
                        inputStyle={{ color: "#d4d4dc" }}
                    ></Input>
                </View>
                <View style={styles.selectStyle}>
                    <Text
                        style={{
                            fontSize: 18,
                            marginBottom: 10,
                            color: "#d4d4dc",
                            fontWeight: "600",
                        }}
                    >
                        Select the transportations used to commute
                    </Text>
                    <FlatList
                        data={transportData}
                        numColumns={3}
                        renderItem={renderTransportItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.transportList}
                    />
                </View>
                <TouchableOpacity
                    onPress={closeAndNavigate}
                    style={styles.saveStyle}
                >
                    <Text
                        style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 18,
                        }}
                    >
                        Create
                    </Text>
                </TouchableOpacity>
            </BottomSheetView>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    selectStyle: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    transportList: {
        alignItems: "center",
    },
    iconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 1.5,
        borderColor: "gray",
        alignItems: "center",
        justifyContent: "center",
        margin: 10,
    },
    saveStyle: {
        padding: 5,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#cd5554",
        borderRadius: 12,
        width: 200,
        height: 60,
    },
});
