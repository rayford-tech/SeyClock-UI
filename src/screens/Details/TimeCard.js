import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { format, getTime } from "date-fns";

import { theme } from "../../theme";

const TimeCard = ({ clockedIn }) => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [day, setDay] = useState(format(new Date(), "cccc"));
  const [date, setDate] = useState(format(new Date(), "dd MMMM, yyyy"));

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bordertop,
          {
            backgroundColor: clockedIn
              ? theme.colors.accent
              : theme.colors.primary,
          },
        ]}
      >
        <View style={styles.borderRibbon} />
        <View style={styles.borderRibbon} />
      </View>
      <View style={styles.content}>
        <Text style={styles.time}>
          {time} <Text style={styles.period}></Text>
        </Text>
        <Text style={styles.date}>
          {day} | {date}
        </Text>
      </View>
    </View>
  );
};

export default TimeCard;

const styles = StyleSheet.create({
  container: {
    height: 150,
    backgroundColor: theme.colors.white,
    width: "90%",
    alignSelf: "center",
    marginTop: 22,
    borderRadius: 14,
  },
  bordertop: {
    backgroundColor: theme.colors.primary,
    height: "20%",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  borderRibbon: {
    height: 17,
    width: 17,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: "white",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
  time: {
    fontWeight: "700",
    fontSize: 31,
  },
  period: {
    fontWeight: "600",
    fontSize: 27,
  },
  date: {
    marginTop: 10,
    fontSize: 18,
  },
});
