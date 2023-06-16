import React, { useEffect, useContext, useState, useRef } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AppContext from "../../navigation/AppContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Icon } from "@rneui/base";

export default function PlacePage({ route }) {
  const { id, start, end, data } = route.params;

  const createArray = (i, num) => {
    const arr = [];
    for (; i <= num; i++) {
      arr.push(i);
    }
    return arr;
  };

  const AVAILABLE_HOURS = createArray(1, 12);
  const AVAILABLE_MINS = createArray(0, 59);

  const navigation = useNavigation();

  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [date, setDate] = useState(new Date());
  const [isAlarm, setIsAlarm] = useState(false);
  const [isTimer, setIsTimer] = useState(false);

  const { isOpen } = useContext(AppContext);

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const selectedHour = selectedTime.getHours();
      const selectedMinute = selectedTime.getMinutes();
      setHour(selectedHour);
      setMinute(selectedMinute);
      setDate(selectedTime);
    }
  };

  const toggleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(toggleAnimation, {
      toValue: isAlarm || isTimer ? 1 : 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [isAlarm, isTimer]);

  const handleToggleAlarm = () => {
    setIsAlarm(!isAlarm);
  };

  const handleToggleTimer = () => {
    setIsTimer(!isTimer);
  };

  const animatedStyles = {
    opacity: toggleAnimation,
    transform: [
      {
        translateY: toggleAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
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
        <Animated.View style={[styles.animationContainer, animatedStyles]}>
          {isAlarm && (
            <DateTimePicker
              value={date}
              mode="time"
              display="spinner"
              onChange={handleTimeChange}
            />
          )}
          {isTimer && <Text>Hello there</Text>}
        </Animated.View>
      </View>
      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Button
          onPress={handleToggleAlarm}
          buttonStyle={{ padding: 10, borderRadius: 10 }}
          style={{ marginRight: 50 }}
        >
          For Alarm?
        </Button>
        <Button
          onPress={handleToggleTimer}
          buttonStyle={{ padding: 10, borderRadius: 10 }}
        >
          For Timer?
        </Button>
      </View>
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
