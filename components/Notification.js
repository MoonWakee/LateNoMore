import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";

export default function Notification({ hour, minute, title }) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    const trueTime = new Date();
    trueTime.setHours(hour);
    trueTime.setMinutes(minute);

    const tenTime = new Date(trueTime);
    tenTime.setMinutes(trueTime.getMinutes() - 10);

    if (tenTime.getMinutes() > trueTime.getMinutes()) {
        tenTime.setHours(trueTime.getHours() - 1);
    }

    const fiveTime = new Date(trueTime);
    fiveTime.setMinutes(fiveTime.getMinutes() - 5);

    if (fiveTime.getMinutes() > trueTime.getMinutes()) {
        fiveTime.setHours(trueTime.getHours() - 1);
    }

    const scheduleLocalNotification = async (triggerTime, title, body) => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            console.log(status);
            if (status !== "granted") {
                console.log("Permission not granted for notifications");
                return;
            }

            const notificationId =
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: "Get Out",
                        body: body
                        // sound: "default",
                        
                    },
                    trigger: {
                        hour: triggerTime.getHours(),
                        minute: triggerTime.getMinutes(),
                        repeats: true,
                    },
                    sticky: true,
                    
                });

            console.log("Scheduled notification with ID:", notificationId);
        } catch (error) {
            console.log("Error scheduling local notification:", error);
        }
    };

    useEffect(() => {
        scheduleLocalNotification(tenTime, 'hi', '10 minutes before leaving!');
        scheduleLocalNotification(fiveTime, 'hi', '5 minutes before leaving!');
        scheduleLocalNotification(trueTime, 'hi', "It's time to leave! Get Out!");
    }, []);

    return null;
}
