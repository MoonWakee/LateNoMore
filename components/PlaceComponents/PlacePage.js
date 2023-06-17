import React, { useEffect, useContext, useState, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    Animated,
    FlatList,
    Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppContext from "../../navigation/AppContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Icon } from "@rneui/base";
import SwitchSelector from "react-native-switch-selector";
import { addTimerItem, getTimerItems, deleteTimerItem } from "../../Crud";
import { SwipeListView } from "react-native-swipe-list-view";

export default function PlacePage({ route }) {
    const { id, start, end, data } = route.params;

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

    const AVAILABLE_HOURS = createArray(1, 12);
    const AVAILABLE_MINS = createArray(0, 59);

    const navigation = useNavigation();

    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [date, setDate] = useState(new Date());
    const [isTimer, setIsTimer] = useState(false);
    const [isDelete, setIsDelete] = useState(false);

    const animationValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isDelete) {
            Animated.timing(animationValue, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(animationValue, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [isDelete, animationValue]);

    const interpolateTextAlignment = animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 100],
    });

    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isFirst, setIsFirst] = useState(false);
    const [timerData, setTimerData] = useState([]);
    const [rowKey, setRowKey] = useState(0)
    const runningRef = useRef(null);

    const { isOpen } = useContext(AppContext);

    const handleStartText = () => {
        if (isRunning) return "Pause";
        else return isFirst ? "Resume" : "Start";
    };

    const handleStartColor = () => {
        if (isRunning) return "#F55451";
        else return "#6CE200";
    };

    const handleTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            const selectedHour = selectedTime.getHours();
            const selectedMinute = selectedTime.getMinutes();
            setHour(selectedHour);
            setMinute(selectedMinute);
            setDate(selectedTime);
        }
    };

    const handleStart = () => {
        setIsFirst(true);
        if (runningRef.current === null) {
            runningRef.current = setInterval(() => {
                setSeconds((prevSeconds) => {
                    if (prevSeconds === 59) {
                        setMinutes((prevMinutes) => {
                            if (prevMinutes === 59) {
                                setHours((prevHours) => prevHours + 1);
                                return 0;
                            }
                            return prevMinutes + 1;
                        });
                        return 0;
                    }
                    return prevSeconds + 1;
                });
            }, 1000);
        }
    };

    const handleStop = () => {
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
        setIsRunning(false);
    };

    useEffect(() => {
        return () => {
            handleStop();
        };
    }, []);

    useEffect(() => {
        fetchItems();
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
        console.log(hour, minute, time);
        return (
            <Animated.View
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
            </Animated.View>
        );
    };

    const HiddenItem = () => {
        return (
            <Animated.View
                style={{
                    flex: 1,
                    marginHorizontal: 10,
                    marginVertical: 5,
                    height: 70,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: 'flex-end',
                    interpolateTextAlignment,
                    paddingHorizontal: 16,
                    backgroundColor: "#FF0000",
                }}
            >
                <Text
                    style={{ fontSize: 18, color: "white", fontWeight: "bold" }}
                >
                    Delete
                </Text>
            </Animated.View>
        );
    };

    const handleSwipeValueChange = (swipeData, swipeRow) => {
        const { key, value } = swipeData;
        if (value < -Dimensions.get("window").width) {
            setIsDelete(!isDelete);
            deleteTimerItem(key);
            fetchItems();
        }
    };

    const fetchItems = async () => {
        try {
            const items = await getTimerItems(id);
            const newData = items.reverse().map((item) => ({
                timer_id: item.id,
                date: item.date,
                time: item.time,
            }));
            setTimerData(newData);
            setRowKey(parseInt(newData[0]['timer_id']))

        } catch (error) {
            console.log(error);
        }
    };

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
                        initial={0}
                        height={60}
                        onPress={(value) => setIsTimer(value)}
                        textColor={"#a8bbd6"}
                        selectedColor={"white"}
                        buttonColor={"#a8bbd6"}
                        borderColor={"#a8bbd6"}
                        hasPadding
                        fontSize={24}
                        textStyle={{ fontWeight: "bold" }}
                        selectedTextStyle={{ fontWeight: "bold" }}
                        options={[
                            { label: "Alarm", value: false },
                            { label: "Timer", value: true },
                        ]}
                    />
                </View>
                <View style={{ marginTop: 10, marginHorizontal: 20 }}>
                    {!isTimer && (
                        <>
                            <DateTimePicker
                                value={date}
                                height={200}
                                mode="time"
                                display="spinner"
                                onChange={handleTimeChange}
                            />
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
                            >
                                Set Alarm
                            </Button>
                        </>
                    )}
                    {isTimer && (
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
                                        width: 180,
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
                                        width: 180,
                                        borderRadius: 100,
                                    }}
                                    onPress={handleSave}
                                    disabled={isFirst ? false : true}
                                >
                                    Save
                                </Button>
                            </View>
                        </>
                    )}
                </View>
                {isTimer && (
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
                            rightOpenValue={-Dimensions.get("window").width}
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
