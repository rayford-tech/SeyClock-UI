import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

import { theme } from "../../theme";

const ListItem = ({ tags }) => {
  return (
    <View style={styles.container}>
      <View style={styles.thumbnail}>
        <Ionicons name="enter-outline" size={28} color={theme.colors.white} />
      </View>
      <View style={{ flex: 1, paddingLeft: 10 }}>
        <Text style={styles.time}>02:51:10PM</Text>
        <Text style={styles.location}>
          Bamako Road, Ayawaso, Accra Metropolis, Greater Accra Region, Ghana
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tagsContainer}>
            {tags.map(({ id, label, icon }) => (
              <View key={id} style={styles.tag}>
                <MaterialCommunityIcons
                  name={icon}
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.tagLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomColor: theme.colors.grey001,
    borderBottomWidth: 0.5,
    padding: 12,
  },
  thumbnail: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 18,
    fontWeight: "500",
  },
  location: {
    fontSize: 12,
    fontStyle: "italic",
    // fontWeight: "300",
    color: theme.colors.grey002,
    marginTop: 3,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  tag: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 1.8,
    alignSelf: "flex-start",
    margin: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  tagLabel: {
    color: theme.colors.primary,
    marginLeft: 5,
  },
});
