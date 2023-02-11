import { Pressable, StyleSheet, Text } from "react-native"
import React from "react"
import { Ionicons } from "@expo/vector-icons"

const UpdateButton = props => {
  return (
    <Pressable style={styles.container} onPress={props.onPress}>
      <Ionicons name="ios-add" size={24} color="black" />
      <Text style={styles.title}>Update item</Text>
    </Pressable>
  )
}

export default UpdateButton

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#D8E9A8",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20
  },
  title: {
    color: "#323232",
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 5
  }
})
