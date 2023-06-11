import React, { useState } from "react";
import {
  StatusBar,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  View,
  Platform,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Button, SearchBar } from "@rneui/base";
import PlaceList from "./PlaceList";
import { useNavigation } from "@react-navigation/native";


export default function Home() {
  const searchBarStyle = Platform.OS === "ios" ? "ios" : "Android";
  const [search, setSearch] = useState("");
  const updateSearch = (search) => {
    setSearch(search);
  };

  const navigation = useNavigation();

  const goToCreate = () => {
    navigation.navigate("CreatePage")
  }

  const [placeData, setPlaceData] = useState([
    { start: "home", end: "station", starred: true },
    { start: "home", end: "school", starred: true },
    { start: "school", end: "station", starred: true },
    { start: "penthouse", end: "airport", starred: false },
    { start: "home", end: "work", starred: false },
  ]);

  const addPlaceData = () => {
    const newItem = { start: "new start", end: "new end", starred: false };
    console.log("added");
    setPlaceData([...placeData, newItem]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <SearchBar
        platform={searchBarStyle}
        placeholder="Type here..."
        onChangeText={updateSearch}
        value={search}
      />
      <PlaceList style={styles.folderView} placeData={placeData} />
      <View style={styles.bottomView}>
      {/* onPress={addPlaceData} was added below to add to data*/}
        <TouchableOpacity onPress={goToCreate}>
          <View>
            <Text style={styles.button}>SUP</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  folderView: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
  bottomView: {
    flex: 0.2,
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "skyblue",
    fontSize: 80,
    fontWeight: "bold",
  },
});
