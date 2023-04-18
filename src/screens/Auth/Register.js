import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Button, TouchableRipple } from "react-native-paper";
import FormInput from "../../components/FormInput";
import { theme } from "../../theme";

import styles from "./styles";

const Register = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={{ marginTop: 28 }}>
          <FormInput placeholder="Email" />
          <FormInput placeholder="Password" />
          <TouchableRipple>
            <Text style={styles.optionText}>Register via Phone</Text>
          </TouchableRipple>
          <Button
            mode="contained"
            style={styles.btnMain}
            labelStyle={styles.btnMainLabel}
          >
            Register
          </Button>
          <Text style={styles.agreement}>
            By clicking Register, you agree to our{" "}
            <Text style={{ color: theme.colors.primary }}>
              Terms and Policies
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Register;
