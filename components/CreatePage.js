import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function CreatePage() {
  return (
    <View style={styles.container}>
      <Text>CreatePage</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
}) 