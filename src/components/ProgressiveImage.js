import React from "react";
import { StyleSheet, Animated } from "react-native";

const ProgressiveImage = ({ source, thumbnailSource, style, ...props }) => {
  const thumbnailAnimated = new Animated.Value(0);
  const imageAnimated = new Animated.Value(0);

  const onThumbnailLoad = () => {
    Animated.timing(thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const onImageLoad = () => {
    Animated.timing(imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  return (
    <>
      <Animated.Image
        {...props}
        source={thumbnailSource}
        style={[style, { opacity: thumbnailAnimated }]}
        blurRadius={0}
        onLoad={onThumbnailLoad}
      />
      <Animated.Image
        {...props}
        source={source}
        style={[styles.imageOverlay, style, { opacity: imageAnimated }]}
        onLoad={onImageLoad}
      />
    </>
  );
};

export default ProgressiveImage;

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
