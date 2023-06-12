import { SafeAreaView, StyleSheet, Text, View, Modal } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useRef } from "react";
import "react-native-gesture-handler";



// This whole page is not used since am using modal, it is only here to trick the Navigator :)
export default function CreatePage() {
    const bottomSheetModalRef = useRef(null);
    const snapPoints = ["48%"];

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>
                <BottomSheetModal
                    ref={bottomSheetModalRef}
                    index={0}
                    snapPoints={snapPoints}>
                        <View>
                            Hi
                        </View>
                </BottomSheetModal>
            </View>
        </BottomSheetModalProvider>
    );
}

const styles = StyleSheet.create({
        container: {
        flex: 1,
        backgroundColor: "gray",
        alignItems: "center",
        justifyContent: "center",
    },
});
