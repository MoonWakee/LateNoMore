import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function CreatePage() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
    <View style={styles.container}>
      <Text>CreatePage</Text>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
}) 