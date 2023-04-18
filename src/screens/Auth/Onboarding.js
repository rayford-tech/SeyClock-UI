import React from "react";
import { View, Text, Button } from "react-native";

const Onboarding = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button
        title="Register"
        onPress={() => navigation.navigate("Register")}
      />
      <Button
        title="Existing user?"
        onPress={() => navigation.navigate("Login")}
      />
    </View>
  );
};

export default Onboarding;
