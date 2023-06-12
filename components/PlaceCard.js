import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "@rneui/base";

export default function PlaceCard({ start, end, starred }) {
const navigation = useNavigation();

const goToPlacePage = () => {
    navigation.navigate('PlacePage', {start, end, starred})    
}
  return (
    <TouchableWithoutFeedback onPress={goToPlacePage}>
      <View  style={styles.container}>
      <View style={styles.columnContainer}>
        <View>
          <Text>
            From : Starting point
          </Text>
        </View>
        <View>
          <Text>
            To : Ending point
          </Text>
        </View>
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
    justifyContent: "center",
    alignSelf: 'center',
    margin: 15,
    aspectRatio: 2, 
    height: (Dimensions.get("window").width - 40) * 0.6, 
    maxWidth: (Dimensions.get("window").width - 40), 
  },
  columnContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'space-around'
  },
});

