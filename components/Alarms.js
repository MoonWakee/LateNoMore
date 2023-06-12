import { StyleSheet, Text, View } from 'react-native'
import React, {useContext} from 'react'
import AppContext from "../navigation/AppContext";

export default function Alarms() {
    const {isOpen} = useContext(AppContext);

  return (

    <View style={styles.container}>
      <Text>Alarms</Text>
      {isOpen && <View style={styles.overlay} />}

    </View> 
  )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'white'
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999
    }
})