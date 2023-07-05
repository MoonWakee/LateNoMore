import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Onboarding from "react-native-onboarding-swiper";
import { setOnboard } from "../Crud.js";
import * as Notifications from "expo-notifications";

const Stack = createStackNavigator();

export default function OnboardStack({onboardingDone}) {
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
                    title: "Are you a Latecomer?",
                    subtitle:
                        "Then this is the app just for you!\n\n\n Schedule the time of arrival to the destination\n\n And I will let you know when to get out!",
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
                            source={require("../resources/starting_card.png")}
                        />
                    ),
                    title: "Creating Routes",
                    subtitle:
                        "Create route by choosing: \n\n\n1. Starting location and destination\n\n 2. Selecting transportations to commute",
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
                            source={require("../resources/timer.png")}
                        />
                    ),
                    title: "Time the Timer",
                    subtitle:
                        "Time how long it takes to commute! \n\n\nTime the first commute time to use the alarm\n\n Timer runs on your background no need to leave open!",
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
                            source={require("../resources/alarm_page.png")}
                        />
                    ),
                    title: "Set Alarm",
                    subtitle:
                        "Set the time you wish to arrive at destination! \n\n1. Pick time, will repeat daily until turned off\n\n 2. Select commuting time to subtract\n i.e) the ETA you want to use!",
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
                            source={require("../resources/alarm_card.png")}
                        />
                    ),
                    title: "No need to check time!",
                    subtitle: "I will let you know \n\nbefore 10 mins, \n\nbefore 5 mins \n\nand the time to Get Out!",
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
                    title: "Ready to become an early bird?",
                    subtitle:
                        "Alarms can be toggled on and off\n\nYour routes, measured times, alarms\ncan be deleted by swiping left!\n\nRemember to start the timer when you leave!",
                },
            ]}
        />}

            </Stack.Screen>
        </Stack.Navigator>
    );
}
