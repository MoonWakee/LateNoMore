import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function PlacePage({route}) {

    const {start, end, starred} = route.params;
  return (
    <View style={styles.container}>
      <Text>{start}</Text>
      <Text>{end}</Text>
      <Text>{start}</Text>
    </View> 
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
})