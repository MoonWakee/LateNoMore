import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Tabs from "./navigation/Tabs";
import { initializeDatabase, getOnboard, setOnboard } from "./Crud.js";
import OnboardStack from "./navigation/OnboardStack";
import { View } from "react-native";

export default function App() {
    const [isOnBoard, setIsOnBoard] = useState(null);

    const checkOnboardItem = async () => {
        try {
            const onboardItem = await getOnboard();
            if (!onboardItem) {
                setIsOnBoard(false);
            } else {
                setIsOnBoard(true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const waitInit = async () => {
        try {
            await initializeDatabase();
            await checkOnboardItem();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        waitInit();
    }, []);

    const handleOnBoardDone = () => {
        setIsOnBoard(true);
        getOnboard();
    };

    return (
        <NavigationContainer>
            {isOnBoard === null && <View />}
            {isOnBoard === true && <Tabs />}
            {isOnBoard === false && <OnboardStack onboardingDone={handleOnBoardDone}/>}
        </NavigationContainer>
    );
}
