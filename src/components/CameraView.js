import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";
import { TouchableRipple } from "react-native-paper";

const CameraView = React.forwardRef(
  ({ camera, onFlipCamera, onCancel, onCapture, ...props }) => {
    return (
      <Camera style={{ flex: 1, width: "100%" }} {...props}>
        <View style={styles.container}>
          <View style={styles.optionsRow}>
            <TouchableRipple onPress={onFlipCamera}>
              <Ionicons name="camera-reverse-outline" size={35} color="white" />
            </TouchableRipple>
            <TouchableRipple onPress={onCapture} style={styles.captureBtn}>
              <Ionicons name="camera-outline" size={30} />
            </TouchableRipple>
            <TouchableRipple onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableRipple>
          </View>
        </View>
      </Camera>
    );
  }
);

export default CameraView;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    flex: 1,
    width: "100%",
    padding: 20,
    justifyContent: "space-between",
  },
  optionsRow: {
    alignSelf: "center",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelText: {
    color: "white",
    fontWeight: "500",
    fontSize: 18,
  },
  captureBtn: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
