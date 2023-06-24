import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";

export const setNotification = async (hour, minute, body, minus_time) => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
        }),
    });

    let sub_hours = 0;
    let sub_minutes = 0;
    let sub_seconds = 0;
    if (minus_time > 3600) {
        sub_hours = Math.floor(minus_time / 3600);
        const remainingSeconds = minus_time % 3600;

        sub_minutes = Math.floor(remainingSeconds / 60);
        sub_seconds = remainingSeconds % 60;
    } else if (minus_time > 60) {
        sub_minutes = Math.floor(minus_time / 60);
        sub_seconds = minus_time % 60;
    } else {
        sub_seconds = minus_time;
    }

    const trueTime = new Date();
    trueTime.setHours(hour);
    trueTime.setMinutes(minute);
    trueTime.setSeconds(0);

    trueTime.setSeconds(trueTime.getSeconds() - sub_seconds);
    trueTime.setMinutes(trueTime.getMinutes() - sub_minutes);
    trueTime.setHours(trueTime.getHours() - sub_hours);

    if (trueTime.getSeconds() < 0) {
        const minutesToBorrow = Math.ceil(Math.abs(trueTime.getSeconds()) / 60);
        trueTime.setMinutes(trueTime.getMinutes() - minutesToBorrow);
        trueTime.setSeconds(60 + trueTime.getSeconds());
    }

    if (trueTime.getMinutes() < 0) {
        const hoursToBorrow = Math.ceil(Math.abs(trueTime.getMinutes()) / 60);
        trueTime.setHours(trueTime.getHours() - hoursToBorrow);
        trueTime.setMinutes(60 + trueTime.getMinutes());
    }

    if (trueTime.getHours() < 0) {
        trueTime.setHours(24 + trueTime.getHours());
    }

    console.log(sub_seconds);
    console.log(trueTime.getSeconds());

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
            // console.log(status);
            if (status !== "granted") {
                console.log("Permission not granted for notifications");
                return;
            }

            const notificationId =
                await Notifications.scheduleNotificationAsync({
                    content: {
                        title: title,
                        body: body,
                        sound: "default",
                    },
                    trigger: {
                        hour: triggerTime.getHours(),
                        minute: triggerTime.getMinutes(),
                        second: triggerTime.getSeconds(),
                        repeats: true,
                    },
                });
            // console.log("Scheduled notification with ID:", notificationId);
            return notificationId;
        } catch (error) {
            console.log("Error scheduling local notification:", error);
        }
    };

    let arr = [];
    arr.push(
        scheduleLocalNotification(tenTime, title, "10 minutes before leaving!")
    );
    arr.push(
        scheduleLocalNotification(fiveTime, title, "5 minutes before leaving!")
    );
    arr.push(
        scheduleLocalNotification(
            trueTime,
            title,
            "It's time to leave! Get Out!"
        )
    );
    try {
        const notificationIds = await Promise.all(arr);
        return notificationIds;
        // console.log("Scheduled notifications with IDs:", notificationIds);
    } catch (error) {
        console.log("Error scheduling notifications:", error);
    }
};

export const cancelNotification = async (notificationId) => {
    try {
        const { status } = await Notifications.requestPermissionsAsync();
        // console.log(status);
        if (status !== "granted") {
            console.log("Permission not granted for notifications");
            return;
        }
        // console.log(notificationId)

        notificationId = notificationId.replace(/\n/g, "").trim();
        const notification = notificationId.substring(1, notificationId.length - 1);
        await Notifications.cancelScheduledNotificationAsync(notification);
        // console.log("Cancelled notification with ID:", notification);
    } catch (error) {
        console.log("Error cancelling notifications:", error);
    }
};
