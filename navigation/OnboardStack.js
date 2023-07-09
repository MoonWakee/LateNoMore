import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "react-native-onboarding-swiper";
import { setOnboard } from "../Crud.js";
import * as Notifications from "expo-notifications";
import en from "../locales/en.js";
import ko from "../locales/ko.js";

const Stack = createStackNavigator();

export default function OnboardStack({onboardingDone}) {
    const translations = global.appLanguage === "ko" ? ko : en;
    const kor = global.appLanguage === "ko" ? true: false;

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Onboarding">
            {() => <Onboarding
            showSkip={false}
            bottomBarHighlight={false}
            titleStyles={{fontSize: 30}}
            subTitleStyles={{fontSize: 20}}
            onDone={() => {
                onboardingDone()
                setOnboard();
                Notifications.requestPermissionsAsync();
            }}
            pages={[
                {
                    backgroundColor: "#548ca4",
                    image: (
                        <Image
                            resizeMode="contain"
                            style={{
                                width: Dimensions.get("screen").width - 50,
                                height: 220,
                            }}
                            source={require("../resources/getout_logo.png")}
                        />
                    ),
                    title: translations.onboard_1,
                    subtitle:
                        translations.onboard_1_1,
                },
                {
                    backgroundColor: "#9c57c2",
                    image: (
                        <Image
                            resizeMode="contain"
                            style={{
                                width: Dimensions.get("screen").width - 50,
                                height: 220,
                            }}
                            source={ kor ? require("../resources/ko_place_card.png"): require("../resources/starting_card.png")}
                        />
                    ),
                    title: translations.onboard_2,
                    subtitle:
                        translations.onboard_2_1,
                },
                {
                    backgroundColor: "#a79af3",
                    image: (
                        <Image
                            resizeMode="contain"
                            style={{
                                width: Dimensions.get("screen").width - 50,
                                height: 220,
                            }}
                            source={kor ? require("../resources/ko_timer.png") : require("../resources/timer.png")}
                        />
                    ),
                    title: translations.onboard_3,
                    subtitle:
                        translations.onboard_3_1,
                },
                {
                    backgroundColor: "#5284DA",
                    image: (
                        <Image
                            resizeMode="contain"
                            style={{
                                width: Dimensions.get("screen").width - 50,
                                height: 220,
                            }}
                            source={kor ? require("../resources/ko_alarm_page.png") : require("../resources/alarm_page.png")}
                        />
                    ),
                    title: translations.onboard_4,
                    subtitle:
                        translations.onboard_4_1,
                },
                {
                    backgroundColor: "#1B6E8B",
                    image: (
                        <Image
                            resizeMode="contain"
                            style={{
                                width: Dimensions.get("screen").width - 50,
                                height: 220,
                            }}
                            source={ kor ? require("../resources/ko_alarm_card.png") : require("../resources/alarm_card.png")}
                        />
                    ),
                    title: translations.onboard_5,
                    subtitle: translations.onboard_5_1,
                },
                {
                    backgroundColor: "#d98310",
                    image: (
                        <Image
                            resizeMode="contain"
                            style={{
                                width: Dimensions.get("screen").width - 50,
                                height: 220,
                            }}
                            source={require("../resources/getout_logo.png")}
                        />
                    ),
                    title: translations.onboard_6,
                    subtitle:
                        translations.onboard_6_1,
                },
            ]}
        />}

            </Stack.Screen>
        </Stack.Navigator>
    );
}
