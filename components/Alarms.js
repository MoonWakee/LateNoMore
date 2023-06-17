import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AppContext from "../navigation/AppContext";
import { SearchBar } from "@rneui/base";
import PlaceList from "./PlaceComponents/PlaceList";
import { getPlaceItems } from "../Crud";


export default function Alarms() {
    const searchBarOS = Platform.OS === "ios" ? "ios" : "Android";
    const { isModified, setIsModified } = useContext(AppContext);

    const [search, setSearch] = useState("")
    const [placeData, setPlaceData] = useState([]);

    const updateSearch = (search) => {
        setSearch(search);
    };
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const items = await getPlaceItems();
            //Reversing the item in items so that the newly created is shown on top
            const newData = items.reverse().map((item) => ({
                id: item.id,
                start: item.start,
                end: item.end,
                data: item.data,
            }));

            setPlaceData(newData);
        } catch (error) {
            console.log(error);
        }
    };

    if (isModified) {
        fetchItems().then(() => setIsModified(false));
    }


    return (
        <View style={styles.container}>                
            <View style={styles.arc} />
            <PlaceList
                    style={styles.folderView}
                    placeData={placeData}
                />
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
        backgroundColor: '#a8bbd6',
        height: 85,
    },
    searchBarStyle: {
        flex: 1,
    },
    // overlay: {
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    //     right: 0,
    //     bottom: 0,
    //     backgroundColor: "rgba(0, 0, 0, 0.5)",
    //     zIndex: 9999,
    // },
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
