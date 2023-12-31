import React, { useEffect, useContext, useState, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    Animated,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Alert,
    AppState,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppContext from "../../navigation/AppContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Icon } from "@rneui/base";
import SwitchSelector from "react-native-switch-selector";
import {
    addTimerItem,
    getTimerItems,
    deleteTimerItem,
    addAlarmItem,
    updateAlarmItem,
    getAlarmNotificationIds,
    getAlarmwithPlace,
    deleteAlarmItem,
    getAlarmItemsOn,
    addRunning,
    getRunningItems,
    deleteRunningItem,
} from "../../Crud";
import { SwipeListView } from "react-native-swipe-list-view";
import SelectDropdown from "react-native-select-dropdown";
import { cancelNotification, setNotification } from "../Notification";
import BackgroundTimer from "react-native-background-timer";
import ko from "../../locales/ko";
import en from "../../locales/en";

export default function PlacePage({ route }) {
    const {
        id,
        start,
        end,
        fromAlarm,
        initTime,
        subtracted = -1,
    } = route.params;
    useEffect(() => {
        if (fromAlarm == 1) {
            setDropSelect(subtracted);
        }
    }, [fromAlarm]);

    useEffect(() => {
        fetchItems();
    }, [id]);

    const createArray = (i, num) => {
        const arr = [];
        for (; i <= num; i++) {
            arr.push(i);
        }
        return arr;
    };
    let dateNow = new Date().toLocaleString();
    let dateUse;
    if (dateNow.includes(",")) {
        dateUse = dateNow.split(",")[0];
    } else {
        dateUse = dateNow.split(" ")[0];
    }

    const navigation = useNavigation();
    let [subtractIndex, setSubtractIndex] = useState(subtracted);

    let [hour, setHour] = useState(() => {
        if (initTime.length === 3) {
            return initTime[0];
        }
        return new Date().getHours();
    });
    let [minute, setMinute] = useState(() => {
        if (initTime.length === 3) {
            return initTime[1];
        }
        return new Date().getMinutes();
    });
    const [date, setDate] = useState(() => {
        const currentDate = new Date();
        if (initTime.length === 3) {
            currentDate.setHours(initTime[0]);
            currentDate.setMinutes(initTime[1]);
        }
        return currentDate;
    });
    let [alarmId, setAlarmId] = useState(
        initTime.length === 3 ? initTime[2] : -1
    );
    const [isAlarm, setIsAlarm] = useState(parseInt(fromAlarm));
    const [isDelete, setIsDelete] = useState(false);
    let [curOpened, setCurOpened] = useState(-1);
    let [dropSelect, setDropSelect] = useState(-1);

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isFirst, setIsFirst] = useState(false);
    const [hasTimer, setHasTimer] = useState(false);
    const [timerData, setTimerData] = useState([]);
    const [rowKey, setRowKey] = useState(0);
    const runningRef = useRef(null);
    const [slowest, setSlowest] = useState(0);
    const [average, setAverage] = useState(0);
    const [fastest, setFastest] = useState(0);

    useEffect(() => {
        setSlowest(Math.max(...timerData.map((item) => parseFloat(item.time))));
        const total = timerData.reduce(
            (sum, item) => sum + parseFloat(item.time),
            0
        );
        setAverage(Math.round(total / timerData.length));
        setFastest(Math.min(...timerData.map((item) => parseFloat(item.time))));
    }, [timerData]);

    const { isModified, setIsModified, setAlarmItems } = useContext(AppContext);



    const subtractText = (sec) => {
        let hour = 0,
            minute = 0,
            second = 0;

        if (sec > 3600) {
            hour = Math.floor(sec / 3600);
            sec -= hour * 3600;
        }
        if (sec > 60) {
            minute = Math.floor(sec / 60);
            sec -= minute * 60;
        }
        second = sec;
        let texter = "";

        if (hour > 0) {
            texter += ' ' + hour + ' ' + translations.sub_hr;
        }
        if (minute > 0) {
            texter += ' ' + minute + ' ' + translations.sub_min;
        }
        texter += ' ' + sec + ' ' + translations.sub_sec;

        return texter;
    };

    const handleStartText = () => {
        if (isRunning) return translations.timer_pause;
        else return isFirst ? translations.timer_resue : translations.timer_start;
    };

    const handleStartColor = () => {
        if (isRunning) return "#F55451";
        else return "#6CE200";
    };

    const fetchItems = async () => {
        try {
            const items = await getTimerItems(id);
            if (items.length != 0) {
                const newData = items.reverse().map((item) => ({
                    timer_id: item.id,
                    date: item.date,
                    time: item.time,
                }));
                setTimerData(newData);
                setRowKey(parseInt(newData[0].timer_id));
                setHasTimer(true);
            } else {
                setTimerData([]);
                setHasTimer(false);
                const for_await = async () => {
                    const items = await getAlarmwithPlace(id);
                    const newData = items.slice().map((item) => ({
                        alarm_id: item.alarm_id,
                    }));
                    newData.forEach(async (nd) => {
                        let id_from_al = nd.alarm_id;
                        let old_notifications = await getAlarmNotificationIds(
                            id_from_al
                        );
                        if (old_notifications.length != 3) {
                            const new_data = old_notifications.substring(
                                1,
                                old_notifications.length - 1
                            );
                            const new_arr = new_data.split(",");
                            new_arr.forEach(async (e) => {
                                await cancelNotification(e);
                            });
                        }
                        deleteAlarmItem(id_from_al);
                    });
                };
                for_await();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [id]);

    const handleTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            const selectedHour = selectedTime.getHours();
            const selectedMinute = selectedTime.getMinutes();
            setHour(selectedHour);
            setMinute(selectedMinute);
            setDate(selectedTime);
        }
    };

    useEffect(() => {
        AppState.addEventListener("change", handleAppStateChange);

        return () => {
            AppState.removeEventListener("change", handleAppStateChange);
        };
    }, []);

    const handleAppStateChange = (nextAppState) => {
        if (nextAppState === "active") {
            // App became active from background with startTime recorded
            let runningItem = async () => {
                let startItem = await getRunningItems();

                if (startItem.length === 0) {
                    // if there is no startDate.getTime() in the DB do nothing
                    return;
                } else {
                    // if back from background and the timer needs to be running
                    let startTime = startItem[0].date;
                    let endTime = new Date().getTime();
                    let diff = Math.floor((endTime - startTime) / 1000);

                    setSeconds((prevSeconds) => {
                        let trueSeconds = prevSeconds + diff;
                        let updatedMinutes = minutes;
                        let updatedHours = hours;

                        if (trueSeconds >= 60) {
                            updatedMinutes += Math.floor(trueSeconds / 60);
                            trueSeconds %= 60;
                        }

                        if (updatedMinutes >= 60) {
                            updatedHours += Math.floor(updatedMinutes / 60);
                            updatedMinutes %= 60;
                        }

                        setMinutes(updatedMinutes);
                        setHours(updatedHours);

                        return (trueSeconds + 1) % 60;
                    });
                    handleStart();
                    deleteRunningItem();
                }
            };
            runningItem();
        } else if (nextAppState === "background" && runningRef.current) {
            // App moved to the background while running timer
            console.log("background");
            handleStop();
            addRunning(new Date().getTime());
        }
    };

    const handleStart = async () => {
        setIsFirst(true);
        if (runningRef.current === null) {
            BackgroundTimer.start();
            runningRef.current = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds >= 59) {
                        setMinutes((prevMinutes) => {
                            if (prevMinutes >= 59) {
                                setHours((prevHours) => prevHours + 1);
                                return 0;
                            }
                            return prevMinutes + 1;
                        });
                    }
                    return (prevSeconds + 1) % 60;
                });
            }, 1000);
        }
    };

    const handleStop = () => {
        BackgroundTimer.stop();
        clearInterval(runningRef.current);
        runningRef.current = null;
    };

    const handleSave = () => {
        handleStop();
        let total_time = 0;
        if (hours) total_time += hours * 3600;
        if (minutes) total_time += minutes * 60;
        if (seconds) total_time += seconds;
        addTimerItem(id, dateUse, parseInt(total_time));
        fetchItems();
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setIsFirst(false);
        setHasTimer(true);
        setIsRunning(false);
    };

    useEffect(() => {
        return () => {
            handleStop();
        };
    }, []);

    const TimerItem = ({ item }) => {
        let time = parseInt(item.time);
        let hour = 0,
            minute = 0,
            second = 0;

        if (time > 3600) {
            hour = Math.floor(time / 3600);
            time -= hour * 3600;
        }
        if (time > 60) {
            minute = Math.floor(time / 60);
            time -= minute * 60;
        }
        second = time;
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: "#f6f8fb",
                    height: 70,
                    marginHorizontal: 10,
                    margin: 5,
                    borderRadius: 10,
                }}
            >
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View
                        style={{
                            flex: 2,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ fontSize: 18, color: "#1d1e22" }}>
                            {item.date}
                        </Text>
                    </View>
                    <View style={{ flex: 1 }} />
                    <View
                        style={{
                            alignItems: "center",
                            flex: 3,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <View style={{ flexDirection: "row" }}>
                            <View>
                                <Text
                                    style={{ fontSize: 28, color: "#1d1e22" }}
                                >
                                    {hour.toString().padStart(2, "0")}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 0.1,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        color: "#1d1e22",
                                    }}
                                >
                                    :
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={{ fontSize: 28, color: "#1d1e22" }}
                                >
                                    {minute.toString().padStart(2, "0")}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flex: 0.1,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        color: "#1d1e22",
                                    }}
                                >
                                    :
                                </Text>
                            </View>
                            <View>
                                <Text
                                    style={{ fontSize: 28, color: "#1d1e22" }}
                                >
                                    {second.toString().padStart(2, "0")}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const HiddenItem = () => {
        const translations = global.appLanguage === "ko" ? ko : en;

        return (
            <View
                style={{
                    flex: 1,
                    marginHorizontal: 10,
                    marginVertical: 5,
                    height: 70,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "flex-end",
                    marginLeft: 20,
                    paddingHorizontal: 16,
                    backgroundColor: "#F55451",
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        setIsDelete(!isDelete);
                        deleteTimerItem(curOpened);
                        fetchItems();
                    }}
                >
                    <Text
                        style={{
                            fontSize: 18,
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        {translations.swipe_delete}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    const handleSwipeValueChange = (swipeData, swipeRow) => {
        const { key, value } = swipeData;
        if (value < -30) {
            setCurOpened(key);
        }
        // --- Used to swipe to delete, but changed to swipe and click
        // if (value < -Dimensions.get("window").width) {
        //     setIsDelete(!isDelete);
        //     deleteTimerItem(key);
        //     fetchItems();
        // }
    };

    const SetAlarm = async () => {
        let minus_time = 0;
        if (dropSelect === 0) minus_time = fastest;
        else if (dropSelect === 1) minus_time = average;
        else minus_time = slowest;

        if (dropSelect === -1) {
            Alert.alert(translations.alarm_alert, "");
            return;
        }
        if (alarmId === -1) {
            let notificationIds = await setNotification(
                (hour = hour),
                (minute = minute),
                (title = start + " → " + end),
                (minus_time = minus_time)
            );
            addAlarmItem(
                (place_id = id),
                (hour = hour),
                (minute = minute),
                (subtract = dropSelect),
                (minus_time = minus_time),
                (notificationIds = notificationIds)
            );
        } else {
            let old_notifications = await getAlarmNotificationIds(alarmId);
            // console.log("old", old_notifications);
            const new_data = old_notifications.substring(
                1,
                old_notifications.length - 1
            );
            console.log(new_data);
            const new_arr = new_data.split(",");
            console.log(new_arr);
            new_arr.forEach(async (e) => {
                await cancelNotification(e);
            });

            let new_notificationIds = await setNotification(
                (hour = hour),
                (minute = minute),
                (title = start + " → " + end),
                (minus_time = minus_time)
            );

            updateAlarmItem(
                (alarm_id = alarmId),
                (hour = hour),
                (minute = minute),
                (isOn = 1),
                (subtract = dropSelect),
                (minus_time = minus_time),
                (notificationIds = new_notificationIds)
            );
        }
        let alarm_length = await getAlarmItemsOn();
        setAlarmItems(alarm_length);

        setIsModified(true);
        navigation.navigate("Alarms");
    };

    const dropDownRenderer = () => {
        return <Icon type="font-awesome" name="caret-down" marginRight={5} />;
    };

    const translations = global.appLanguage === "ko" ? ko : en;


    return (
        <View style={styles.container}>
            <View style={{ height: 65, backgroundColor: "#a8bbd6" }}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            height: 65,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: start.length > 30 ? 15 : 20,
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            {start}
                        </Text>
                    </View>
                    <View style={{ flex: 0.2 }}>
                        <Icon
                            type="font-awesome"
                            name="long-arrow-right"
                            size={30}
                            color="white"
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            height: 65,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: end.length > 30 ? 15 : 20,
                                fontWeight: "bold",
                                color: "white",
                            }}
                        >
                            {end}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={styles.arc}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Icon
                            type="font-awesome"
                            name="location-arrow"
                            color="#2596be"
                            size={30}
                            width={30}
                        />
                    </View>
                    <View style={{ flex: 0.2 }} />
                    <View
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Icon
                            type="font-awesome"
                            name="flag"
                            color="#cd5554"
                            size={30}
                            width={30}
                        />
                    </View>
                </View>
            </View>
            <View style={{ flex: 5 }}>
                <View style={{ marginHorizontal: 50, marginTop: 30 }}>
                    <SwitchSelector
                        initial={fromAlarm}
                        height={60}
                        onPress={(value) => setIsAlarm(value)}
                        textColor={"#a8bbd6"}
                        selectedColor={"white"}
                        buttonColor={"#a8bbd6"}
                        borderColor={"#a8bbd6"}
                        hasPadding
                        fontSize={24}
                        textStyle={{ fontWeight: "bold" }}
                        selectedTextStyle={{ fontWeight: "bold" }}
                        options={[
                            { label: translations.place_timer, value: 0 },
                            { label: translations.place_alarm, value: 1 },
                        ]}
                    />
                </View>
                <View style={{ marginTop: 10, marginHorizontal: 20 }}>
                    {isAlarm === 1 && (
                        <>
                            <DateTimePicker
                                value={date}
                                height={200}
                                mode="time"
                                display="spinner"
                                onChange={handleTimeChange}
                            />
                            {!!fastest && !!slowest && !!average && (
                                <SelectDropdown
                                    defaultValueByIndex={subtractIndex}
                                    renderDropdownIcon={dropDownRenderer}
                                    dropdownIconPosition="right"
                                    buttonStyle={{
                                        width:
                                            Dimensions.get("window").width - 40,
                                        borderRadius: 10,
                                    }}
                                    rowStyle={{ backgroundColor: "#e6e6e6" }}
                                    data={[
                                        translations.alarm_fastest +
                                            subtractText(fastest),
                                        translations.alarm_average +
                                            subtractText(average),
                                        translations.alarm_slowest +
                                            subtractText(slowest),
                                    ]}
                                    defaultButtonText= {translations.alarm_select_time}
                                    onSelect={(selectedItem, index) => {
                                        setDropSelect(index);
                                    }}
                                />
                            )}
                            <Button
                                titleStyle={{
                                    fontWeight: "bold",
                                    fontSize: 18,
                                }}
                                buttonStyle={{
                                    borderRadius: 100,
                                    height: 50,
                                    marginTop: 20,
                                }}
                                onPress={SetAlarm}
                                disabled={!hasTimer}
                            >
                                {translations.alarm_set_alarm}
                            </Button>
                        </>
                    )}
                    {isAlarm === 0 && (
                        <>
                            <View
                                style={{
                                    height: 100,
                                    backgroundColor: "#f6f8fb",
                                    borderRadius: 20,
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 70,
                                            fontWeight: "400",
                                            color: "#1d1e22",
                                        }}
                                    >
                                        {hours.toString().padStart(2, "0")}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flex: 0.1,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 50,
                                            color: "#1d1e22",
                                        }}
                                    >
                                        :
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 70,
                                            fontWeight: "400",
                                            color: "#1d1e22",
                                        }}
                                    >
                                        {minutes.toString().padStart(2, "0")}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flex: 0.1,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 50,
                                            color: "#1d1e22",
                                        }}
                                    >
                                        :
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flex: 1,
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 70,
                                            fontWeight: "400",
                                            color: "#1d1e22",
                                        }}
                                    >
                                        {seconds.toString().padStart(2, "0")}
                                    </Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                    marginTop: 30,
                                    height: 70,
                                }}
                            >
                                <Button
                                    titleStyle={{
                                        fontWeight: "bold",
                                        fontSize: 18,
                                    }}
                                    buttonStyle={{
                                        height: 70,
                                        width:
                                            Dimensions.get("window").width / 2 -
                                            30,
                                        borderRadius: 50,
                                        backgroundColor: handleStartColor(),
                                    }}
                                    onPress={() => {
                                        if (isRunning) {
                                            handleStop();
                                        } else {
                                            handleStart();
                                        }
                                        setIsRunning(!isRunning);
                                    }}
                                >
                                    {handleStartText()}
                                </Button>
                                <Button
                                    titleStyle={{
                                        fontWeight: "bold",
                                        fontSize: 18,
                                    }}
                                    buttonStyle={{
                                        height: 70,
                                        width:
                                            Dimensions.get("window").width / 2 -
                                            30,
                                        borderRadius: 100,
                                    }}
                                    onPress={handleSave}
                                    disabled={isFirst ? false : true}
                                >
                                    {translations.timer_save}
                                </Button>
                            </View>
                        </>
                    )}
                </View>
                {isAlarm === 0 && (
                    <View style={{ flex: 1, marginTop: 30 }}>
                        {/* <FlatList
                            data={timerData}
                            renderItem={TimerItem}
                            numColumns={1}
                            keyExtractor={(TimerItem) => TimerItem.id}
                        /> */}
                        <SwipeListView
                            data={timerData}
                            disableRightSwipe
                            renderItem={TimerItem}
                            renderHiddenItem={HiddenItem}
                            rightOpenValue={-100}
                            // previewOpenValue={-30}
                            // previewOpenDelay={1000}
                            // previewRowKey={rowKey}
                            onSwipeValueChange={handleSwipeValueChange}
                            useNativeDriver={false}
                            keyExtractor={(item) => item.timer_id}
                        />
                    </View>
                )}
            </View>
            <View
                style={{
                    height: 95,
                    alignContent: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    backgroundColor: "#a8bbd6",
                }}
            ></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    arc: {
        height: 50,
        backgroundColor: "#a8bbd6",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    animationContainer: {
        height: 200,
        marginLeft: 20,
        marginRight: 20,
    },
});
