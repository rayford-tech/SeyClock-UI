import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableRipple } from "react-native-paper";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Dashboard from "../screens/Dashboard/Dashboard";
import { theme } from "../theme";
import Details from "../screens/Details/Details";

const Stack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
          shadowColor: "transparent",
          elevation: 0,
        },
        headerTintColor: theme.colors.white,
        headerBackTitle: "",
      }}
    >
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen
        name="Details"
        component={Details}
        options={({ navigation }) => ({
          title: "Attendance",
          headerLeft: (props) => (
            <TouchableRipple
              onPress={() => navigation.navigate("Dashboard")}
              {...props}
            >
              <Ionicons
                name={
                  Platform.OS === "android" ? "arrow-back" : "ios-chevron-back"
                }
                size={33}
                color={theme.colors.white}
                {...props}
              />
            </TouchableRipple>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
