import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";

const FormInput = ({
  placeholder,
  onChangeText,
  value,
  secureTextEntry,
  keyboardType,
  ...props
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        {...{ placeholder, onChangeText, value, secureTextEntry, keyboardType }}
        {...props}
      />
      {/* <TouchableRipple>
        <Ionicons name="eye-outline" size={21} />
      </TouchableRipple> */}
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    height: 50,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  input: {
    fontSize: 17,
    fontWeight: "500",
    flex: 1,
  },
});
