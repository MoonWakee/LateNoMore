import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppContext from '../navigation/AppContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '@rneui/base';

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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: start + '-->' + end,
    });
  }, [navigation, start, end]);

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

  return (
    <View style={styles.container}>
      <Button onPress={() =>setIsAlarm(!isAlarm)} style={{marginBottom: 20}}>
        For Alarm?
      </Button>
      <Button
        onPress={() => setIsTimer(!isTimer)}
      >
        For Timer?
      </Button>
      {isAlarm && <DateTimePicker
        value={date}
        mode="time"
        display="spinner"
        onChange={handleTimeChange}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
