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
import { addItem } from '../Crud';

export default function CreateModal() {
    const sheetRef = useRef(null);
    const snapPoints = ["68%", "78%"];
    const { setIsOpen } = useContext(AppContext);
    const input = useRef();

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
                    { backgroundColor: item.selected ? "black" : "white" },
                ]}
            >
                <Icon
                    type={item.type}
                    name={item.name}
                    size={50}
                    color={item.selected ? "#e32f45" : "black"}
                ></Icon>
            </TouchableOpacity>
        );
    };

    const closeAndNavigate = () => {
        sheetRef.current.close();
        addItem("Item 1", 1);
    };

    return (
        <BottomSheet
            ref={sheetRef}
            index={keyboardStatus ? 1 : 0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            onClose={() => setIsOpen(false)}
            animationDuration={10}
            animationEasing={Easing.ease}
        >
            <BottomSheetView>
                <View style={styles.container}>
                    <Input
                        ref={input}
                        leftIcon={{
                            type: "font-awesome",
                            name: "location-arrow",
                        }}
                        leftIconContainerStyle={{ marginRight: 10 }}
                        placeholder="Enter current location..."
                    ></Input>
                </View>
                <View style={styles.container}>
                    <Input
                        ref={input}
                        leftIcon={{ type: "font-awesome", name: "flag" }}
                        leftIconContainerStyle={{ marginRight: 10 }}
                        placeholder="Enter destination..."
                    ></Input>
                </View>
                <View style={styles.selectStyle}>
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>
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
                    <Text style={{ color: "white", fontWeight: "bold" }}>
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
        backgroundColor: "rgba(111, 202, 186, 1)",
        borderRadius: 12,
        width: 120,
        height: 60,
    },
});
