import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableRipple } from "react-native-paper";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../theme";
import Onboarding from "../screens/Auth/Onboarding";
import Register from "../screens/Auth/Register";
import Login from "../screens/Auth/Login";

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTintColor: theme.colors.white,
        headerBackTitle: " ",
      }}
    >
      {/* <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
};

export default AuthStack;
