import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React from "react";
import PlacePage from "./PlacePage";
import { useNavigation } from "@react-navigation/native";

export default function Place({ start, end, starred }) {
const navigation = useNavigation();

const goToPlacePage = () => {
    navigation.navigate('PlacePage', {start, end, starred})    
}
  return (
    <TouchableOpacity onPress={goToPlacePage}>
      <View style={styles.container}>
        <Text>{start}</Text>
        <Text>{end}</Text>
        <Text>{starred}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: 150,
    width: Dimensions.get("window").width / 3,
    alignItems: "center",
  },
});
