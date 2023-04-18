import React, { useEffect, useReducer, useMemo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";

import MainStack from "./src/navigation/MainStack";
import { theme as Theme } from "./src/theme";
import AuthStack from "./src/navigation/AuthStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "./src/navigation/AuthContext";
import { ActivityIndicator, Text, View } from "react-native";

export default function App() {
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: Theme.colors.primary,
    },
  };

  const initialLoginState = {
    loading: false,
    userToken: null,
  };

  const loginReducer = (state, action) => {
    switch (action.type) {
      case "RETRIEVE_TOKEN":
        return {
          ...state,
          userToken: action.token,
          loading: false,
        };
      case "LOGIN":
        return {
          ...state,
          userToken: action.token,
          loading: false,
        };
      case "LOGOUT":
        return {
          ...state,
          userToken: null,
          loading: false,
        };
    }
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(() => ({
    login: async (token) => {
      let userToken = null;
      if (token) {
        try {
          userToken = token;
          await AsyncStorage.setItem("userToken", userToken);
        } catch (error) {
          console.log(error);
        }
      }
      console.log({ token });
      dispatch({ type: "LOGIN", token: userToken });
    },
    logout: async () => {
      try {
        await AsyncStorage.removeItem("userToken");
      } catch (error) {
        console.log(error);
      }
      dispatch({ type: "LOGOUT" });
    },
  }));

  useEffect(() => {
    const fetchAppData = async () => {
      let userToken = null;
      try {
        userToken = await AsyncStorage.getItem("userToken");
      } catch (error) {
        console.log(error);
      }
      // console.log({userToken});
      dispatch({ type: "RETRIEVE_TOKEN", token: userToken });
    };
    fetchAppData();
  }, []);

  if (loginState.loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text>Please wait...</Text>
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AuthContext.Provider value={authContext}>
          {loginState.userToken !== null ? <MainStack /> : <AuthStack />}
        </AuthContext.Provider>
      </NavigationContainer>
    </PaperProvider>
  );
}
