import React, { useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import { theme } from "../../theme";
import TimeCard from "./TimeCard";
import ListItem from "./ListItem";

const LOGS = [
  {
    time: "02:51:10 PM",
    location:
      " Bamako Road, Ayawaso, Accra Metropolis, Greater Accra Region, Ghana",
    tags: [
      { id: 0, label: "Temperature", icon: "thermometer" },
      { id: 1, label: "Symptoms", icon: "shield-cross-outline" },
      { id: 2, label: "Remarks", icon: "pencil" },
    ],
  },
  {
    time: "01:16:22 PM",
    location:
      " Bamako Road, Ayawaso, Accra Metropolis, Greater Accra Region, Ghana",
    tags: [
      { id: 0, label: "Temperature", icon: "thermometer" },
      { id: 1, label: "Symptoms", icon: "shield-cross-outline" },
      { id: 2, label: "Remarks", icon: "pencil" },
    ],
  },
  {
    time: "07:19:02 AM",
    location:
      " Bamako Road, Ayawaso, Accra Metropolis, Greater Accra Region, Ghana",
    tags: [
      { id: 0, label: "Temperature", icon: "thermometer" },
      { id: 1, label: "Symptoms", icon: "shield-cross-outline" },
      { id: 2, label: "Remarks", icon: "pencil" },
    ],
  },
];

const Details = ({ route, navigation }) => {
  const { clockedIn } = route.params;
  const [clockOut, setClockOut] = useState(false);

  const _clockOut = () => {
    setClockOut(true);
  };

  React.useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (clockOut) {
          // If we don't have unsaved changes, then we don't need to do anything
          return;
        }

        // Prevent default behavior of leaving the screen
        e.preventDefault();

        // Prompt the user before leaving the screen
        Alert.alert(
          "Clocked out?",
          "You have not clocked out. Are you sure you you want to go back?",
          [
            { text: "Don't leave", style: "cancel", onPress: () => {} },
            {
              text: "Discard",
              style: "destructive",
              // If the user confirmed, then we dispatch the action we blocked earlier
              // This will continue the action that had triggered the removal of the screen
              onPress: () => navigation.dispatch(e.data.action),
            },
          ]
        );
      }),
    [navigation, clockOut]
  );

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={LOGS}
        keyExtractor={(_, index) => String(index)}
        ListHeaderComponent={
          <>
            <TimeCard clockedIn={clockedIn} />
            <View
              style={{ backgroundColor: "white", marginTop: 15, padding: 15 }}
            >
              <Text>
                To configure working hours, to{" "}
                <Text style={{ color: "blue" }}> Attendance Settings</Text>
              </Text>
              <Button
                color={clockedIn ? theme.colors.accent : theme.colors.primary}
                style={styles.btn}
                labelStyle={styles.btnLabel}
                mode="contained"
                onPress={_clockOut}
              >
                <Ionicons
                  name={clockedIn ? "exit-outline" : "enter-outline"}
                  size={33}
                  color={theme.colors.white}
                />
                {clockedIn ? "Clock Out" : "Clock In"}
              </Button>
            </View>
          </>
        }
        renderItem={({ item: { tags } }) => {
          return <ListItem tags={tags} />;
        }}
      />
    </View>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.grey001,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: "80%",
    alignSelf: "center",
    padding: 5,
    margin: 14,
  },
  btnLabel: {
    color: theme.colors.white,
    textTransform: "capitalize",
    fontWeight: "700",
    fontSize: 32,
    // marginLeft: 10,
  },
});
