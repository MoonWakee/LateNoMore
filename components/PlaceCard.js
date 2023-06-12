import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function PlaceCard({ start, end, starred }) {
const navigation = useNavigation();

const goToPlacePage = () => {
    navigation.navigate('PlacePage', {start, end, starred})    
}
  return (
    <TouchableWithoutFeedback onPress={goToPlacePage}>
      <View  style={styles.container}>
      <View style={styles.columnContainer}>
        <Text>{start}</Text>
        <Text>{end}</Text>
        <Text>{starred}</Text>
      </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgreen",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: 'center',
    margin: 15,
    aspectRatio: 1.5, 
    height: (Dimensions.get("window").width - 40) * 0.75, 
    maxWidth: (Dimensions.get("window").width - 40), 
  },
  columnContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

