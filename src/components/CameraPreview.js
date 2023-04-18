import React from "react";
import { StyleSheet, ImageBackground, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";

const CameraPreview = ({ photo, submitPhoto, retakePhoto, loading }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      />
      <View style={styles.optionsRow}>
        <TouchableRipple onPress={retakePhoto}>
          <Text style={styles.text}>Re-take</Text>
        </TouchableRipple>
        <TouchableRipple onPress={submitPhoto}>
          <Text style={styles.text}>Submit</Text>
        </TouchableRipple>
      </View>
    </View>
  );
};

export default CameraPreview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  optionsRow: {
    position: "absolute",
    top: 30,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    padding: 20,
    justifyContent: "space-between",
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});
