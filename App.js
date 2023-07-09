import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Tabs from "./navigation/Tabs";
import { initializeDatabase, getOnboard, setOnboard } from "./Crud.js";
import OnboardStack from "./navigation/OnboardStack";
import { View, LogBox } from "react-native";
import { NativeModules } from "react-native";



const defaultLanguage = 'en';

// Get the device's language
const deviceLanguage =
  NativeModules.SettingsManager.settings.AppleLocale ||
  NativeModules.SettingsManager.settings.AppleLanguages[0];

// Check if the device language is Korean (ko) or starts with 'ko'
const isKorean = deviceLanguage.includes('ko') || deviceLanguage === 'ko';

// Set the app's language
const appLanguage = isKorean ? 'ko' : defaultLanguage;

// Set the app's language globally
global.appLanguage = appLanguage;
// console.log(global.appLanguage)


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
    LogBox.ignoreAllLogs();

    return (
        <NavigationContainer>
            {isOnBoard === null && <View />}
            {isOnBoard === true && <Tabs />}
            {isOnBoard === false && (
                <OnboardStack onboardingDone={handleOnBoardDone} />
            )}
        </NavigationContainer>
    );
}
