import React, { useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Button, TouchableRipple } from "react-native-paper";
import FormInput from "../../components/FormInput";
import { AuthContext } from "../../navigation/AuthContext";
import { theme } from "../../theme";
import * as c from "../../api/constants";

import styles from "./styles";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onHandleLogin = (e, p) => {
    if (e === "rayford@example.com" && p === "password") {
      login("helloworld!!!");
    } else {
      alert("Invalid user!");
    }
  };

  const onHandleSubmit = () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    console.log({ formData });
    onSubmitData(formData);
  };

  const onSubmitData = async (data) => {
    setLoading(true);
    try {
      var headers = {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Type": "multipart/form-data; ",
      };
      const route = `${c.API_URL}/auth/login`;
      let api_response = await fetch(route, {
        method: "post",
        body: data,
        headers: headers,
      });
      let response = await api_response.json();
      if (response.error == "Unauthorised") {
        Alert.alert(
          "Unauthorized access",
          "Please check log-in details and try again.",
          [
            {
              text: "OK",
              onPress: () => null,
              style: "cancel",
            },
          ]
        );
        setLoading(false);
        return false;
      } else if (response.error) {
        Alert.alert("Sign-in error", "Please try again", [
          {
            text: "OK",
            onPress: () => null,
            style: "cancel",
          },
        ]);
        setLoading(false);
        return false;
      }
      console.log({ response });
      const userToken = JSON.stringify(response.success.token);
      login(userToken);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          //   justifyContent: "center",
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 0.36,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 24 }}>SeyClock</Text>
        </View>
        <View style={{ marginTop: 28, flex: 1 }}>
          <FormInput
            placeholder="Email"
            value={email}
            onChangeText={(email) => setEmail(email)}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
          />
          <FormInput
            placeholder="Password"
            value={password}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
          />
          <Button
            mode="contained"
            color={theme.colors.primary}
            style={styles.btnMain}
            labelStyle={styles.btnMainLabel}
            loading={loading}
            disabled={loading}
            onPress={onHandleSubmit}
          >
            Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
