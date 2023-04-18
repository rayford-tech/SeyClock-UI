import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableRipple, Button } from "react-native-paper";
import { Camera } from "expo-camera";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/core";
import { getDistance, getPreciseDistance } from "geolib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mime from "mime";
import * as ImagePicker from "expo-image-picker";

import { theme } from "../../theme";
import CameraPreview from "../../components/CameraPreview";
import ProgressiveImage from "../../components/ProgressiveImage";
import { AuthContext } from "../../navigation/AuthContext";
import { api } from "../../api/api";
import * as c from "../../api/constants";

const { width, height } = Dimensions.get("screen");
const CARD_HEIGHT = 150;

const Dashboard = ({ navigation }) => {
  let camera = Camera;
  const { logout } = useContext(AuthContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [openCamera, setOpenCamera] = useState(false);
  const [previewImage, setPreviewImage] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [flashMode, setFlashMode] = useState("off");
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [companyDistance, setCompanyDistance] = useState({
    longitude: 0,
    latitude: 0,
  });
  const [currentDistance, setCurrentDistance] = useState(0);
  const [requiredRadius, setRequiredRadius] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickedImagePath, setPickedImagePath] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  let locationTxt = "Fetching current Location..";
  if (errorMsg) {
    locationTxt = errorMsg;
  } else if (location) {
    locationTxt = JSON.stringify(location);
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: openCamera ? false : true,
    });
  }, [navigation, openCamera]);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      calculateDistance();
      // console.log({ location });

      return () => {
        // Do something when the screen is unfocused
        setOpenCamera(false);
      };
    }, [location])
  );

  const getLocationStatus = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    setLocationLoading(true);
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setLocationLoading(false);
  };

  useEffect(() => {
    getConfig();
    getLocationStatus();
    // console.log({ requiredRadius });
    return () => {};
  }, [
    navigation,
    requiredRadius,
    companyDistance.longitude,
    companyDistance.latitude,
  ]);

  const getConfig = async () => {
    // setLoading(true);
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      const data = {};
      var headers = {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${userToken.split('"')[1]}`,
      };
      const route = "/configs";
      const response = await api.get(route, data, headers);
      console.log({ response });
      const {
        config: { required_km, latitude, longitude },
        clockin,
        user,
      } = response.success;
      setRequiredRadius(required_km);
      setCompanyDistance({
        longitude,
        latitude,
      });
      calculateDistance();
      setStatus([...clockin]);
      setProfileImage(user.image);
      // setLoading(false);
    } catch (error) {
      console.log(error);
      // setError(true);
      // setLoading(false);
    }
  };

  const calculateDistance = () => {
    const currLat = parseFloat(location?.coords.latitude);
    const currLong = parseFloat(location?.coords.longitude);
    // console.log(companyDistance);
    // console.log(location);
    var dis = getDistance(
      {
        latitude: parseFloat(companyDistance.latitude),
        longitude: parseFloat(companyDistance.longitude),
      },
      { latitude: currLat, longitude: currLong }
    );
    var currentDistance = dis / 1000;
    setCurrentDistance(currentDistance);
    // console.log(currentDistance);
    // console.log(requiredRadius);

    // console.log({ currentDistance, requiredRadius });
    // alert(`Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`);
  };

  const calculatePreciseDistance = () => {
    var pdis = getPreciseDistance(
      { latitude: 20.0504188, longitude: 64.4139099 },
      { latitude: 51.528308, longitude: -0.3817765 }
    );
    alert(`Precise Distance\n\n${pdis} Meter\nOR\n${pdis / 1000} KM`);
  };

  const _openCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      setHasPermission(true);
      setOpenCamera(true);
    } else {
      alert("Camera access denied!");
    }
    setClockedIn(true);
  };

  const checkIn = () => {
    if (!errorMsg) {
      if (currentDistance > requiredRadius) {
        Alert.alert(
          "Out of bounds!",
          "Please move closer to company premises and clock in",
          [
            {
              text: "OK",
              onPress: () => null,
              style: "cancel",
            },
          ]
        );
        return false;
      }
    } else {
      Alert.alert(
        "Access Denied!",
        "Location permission denied. Please enable location service in settings to continue",
        [
          {
            text: "OK",
            onPress: () => null,
            style: "cancel",
          },
        ]
      );
      return false;
    }
    _takePhoto();
  };

  // const _takePhoto = async () => {
  //   if (!camera) return;
  //   const photo = await camera.takePictureAsync();
  //   console.log({ photo });
  //   setPreviewImage(true);
  //   setCapturedPhoto(photo);
  // };

  const _flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const checkout = () => {
    Alert.alert("Are you sure you want to clock out?", "", [
      {
        text: "Yes",
        onPress: () => onHandleCheckOut(),
        style: "destructive",
      },
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
    ]);
  };

  const onHandleCheckOut = () => {
    const currentDate = new Date().toISOString();
    let data = new FormData();
    data.append("clockout", currentDate);
    console.log({ data });
    onHandleClockout(data);
  };

  const onHandleClockout = async (data) => {
    const id = status[0]?.id;
    console.log({ id });
    setSubmitLoading(true);
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      var headers = {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${userToken.split('"')[1]}`,
        "Content-Type": "multipart/form-data; ",
      };
      const route = `${c.API_URL}/clockout/${id}`;
      let res = await fetch(route, {
        method: "post",
        body: data,
        headers: headers,
      });
      let response = await res.json();
      const { clockin } = response.success;
      console.log({ response });
      setStatus([...clockin]);
      getConfig();
      setSubmitLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onHandleSubmitPhoto = () => {
    const newImageUri = "file:///" + capturedPhoto.uri.split("file:/").join("");
    const imag = {
      uri: newImageUri,
      type: mime.getType(newImageUri),
      name: newImageUri.split("/").pop(),
    };
    const currentDate = new Date().toISOString();
    let uriParts = capturedPhoto.uri.split(".");
    let fileType = capturedPhoto.uri[capturedPhoto.uri.length - 1];
    let data = new FormData();
    // data.append("photo", imag);
    // data.append('photo', {
    //   name: newImageUri.split("/").pop(),
    //   type: mime.getType(newImageUri),
    //   uri: Platform.OS === 'ios' ? capturedPhoto.uri.replace('file://', '') : capturedPhoto.uri,
    // });
    data.append("photo", {
      // uri: capturedPhoto.uri,
      uri: capturedPhoto.uri,
      type: "image/jpg",
      name: "userProfile.jpg",
    });
    data.append("clockin", currentDate);
    console.log({ data });
    _submitPhoto(data);
  };

  const _takePhoto = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      aspect: [4, 3],
    });

    // Explore the result
    // console.log(result);

    if (result.cancelled) {
      return;
    }

    // setPickedImagePath(result.uri);
    // console.log(result.uri);

    let localUri = result.uri;
    let filename = localUri.split("/").pop();

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "photo" is the name of the form field the server expects
    formData.append("photo", { uri: localUri, name: filename, type });
    const currentDate = new Date().toISOString();
    formData.append("clockin", currentDate);
    console.log({ formData });
    _submitPhoto(formData);
  };

  const _submitPhoto = async (data) => {
    // make a post request to server
    setSubmitLoading(true);
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      var headers = {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${userToken.split('"')[1]}`,
        "Content-Type": "multipart/form-data; ",
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const _route = `${c.API_URL}/clockin`;
      let res = await fetch(_route, {
        method: "post",
        body: data,
        headers: headers,
      });

      let response = await res.json();
      console.log(response);
      // return false
      // let response = await res.json();

      console.log(response);
      setCapturedPhoto(null);
      setPreviewImage(false);
      setOpenCamera(false);
      getConfig();
      setSubmitLoading(false);
      // navigation.goBack();
    } catch (error) {
      console.log(error);
      setSubmitLoading(false);
    }
    // console.log({ capturedPhoto });
    // navigation.navigate("Details", { clockedIn: clockedIn });
  };

  const _retakePhoto = () => {
    setCapturedPhoto(null);
    setPreviewImage(false);
    _openCamera();
  };

  const _handleFlashMode = () => {
    if (flashMode === "on") {
      setFlashMode("off");
    } else if (flashMode === "off") {
      setFlashMode("on");
    } else {
      setFlashMode("auto");
    }
  };

  // if (openCamera) {
  //   if (loading) {
  //     return <ActivityIndicator />;
  //   } else {
  //     return (
  //       <>
  //         {previewImage && capturedPhoto ? (
  //           <CameraPreview
  //             photo={capturedPhoto}
  //             submitPhoto={onHandleSubmitPhoto}
  //             retakePhoto={_retakePhoto}
  //           />
  //         ) : (
  //           <Camera
  //             style={{ flex: 1 }}
  //             flashMode={flashMode}
  //             type={Camera.Constants.Type.front}
  //             ref={(r) => {
  //               camera = r;
  //             }}
  //           >
  //             <View
  //               style={{
  //                 position: "absolute",
  //                 bottom: 0,
  //                 flexDirection: "row",
  //                 flex: 1,
  //                 width: "100%",
  //                 padding: 20,
  //                 justifyContent: "space-between",
  //               }}
  //             >
  //               <View
  //                 style={{
  //                   alignSelf: "center",
  //                   flex: 1,
  //                   flexDirection: "row",
  //                   alignItems: "center",
  //                   justifyContent: "space-between",
  //                 }}
  //               >
  //                 {/* <TouchableRipple onPress={_flipCamera}>
  //                   <Ionicons
  //                     name="camera-reverse-outline"
  //                     size={35}
  //                     color="white"
  //                   />
  //                 </TouchableRipple> */}
  //                 <View />
  //                 <TouchableRipple
  //                   onPress={_takePhoto}
  //                   style={{
  //                     width: 70,
  //                     height: 70,
  //                     bottom: 0,
  //                     borderRadius: 50,
  //                     backgroundColor: "#fff",
  //                     alignItems: "center",
  //                     justifyContent: "center",
  //                   }}
  //                 >
  //                   <Ionicons name="camera-outline" size={30} />
  //                 </TouchableRipple>
  //                 <TouchableRipple onPress={() => setOpenCamera(false)}>
  //                   <Text
  //                     style={{
  //                       color: "white",
  //                       fontWeight: "500",
  //                       fontSize: 18,
  //                     }}
  //                   >
  //                     Cancel
  //                   </Text>
  //                 </TouchableRipple>
  //               </View>
  //             </View>
  //           </Camera>
  //         )}
  //       </>
  //     );
  //   }
  // }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", margin: 12 }}>
          <View style={styles.thumnail}>
            <ProgressiveImage
              thumbnailSource={require("../../assets/default-profile-img.png")}
              source={{
                uri: profileImage,
              }}
              style={styles.profileImg}
            />
          </View>
          <View style={{ alignSelf: "center", marginLeft: 12, flex: 1 }}>
            <Text style={styles.greeting}>Good Day,</Text>
            <Text style={styles.question}>What do you want to do today?</Text>
          </View>
        </View>
      </View>
      <View style={styles.content}>
        {locationLoading && (
          <View style={{ margin: 20 }}>
            <ActivityIndicator color="black" />
            <Text>Getting current location...</Text>
          </View>
        )}
        {submitLoading && (
          <View style={{ margin: 20 }}>
            <ActivityIndicator color="black" />
            <Text>Please wait...</Text>
          </View>
        )}
        <Button
          mode="contained"
          style={styles.logoutBtn}
          labelStyle={styles.logoutBtnText}
          disabled={submitLoading || locationLoading}
          onPress={() => logout()}
        >
          Log out
        </Button>
      </View>
      <View style={cardStyles.container}>
        <View
          style={{
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View>
            <Text style={cardStyles.title}>
              {!status.length ? "Clock In" : "Clock Out"}
            </Text>
            <Text style={cardStyles.description}>
              {status.length
                ? "Don't forget to clock out"
                : "You haven't clocked in yet"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={[
                cardStyles.status,
                {
                  color: status.length
                    ? theme.colors.accent
                    : theme.colors.primary,
                },
              ]}
            >
              {status.length ? "Bye! See You..." : "Have a Nice Day..."}
            </Text>
            <Ionicons
              name={status.length ? "exit-outline" : "enter-outline"}
              size={28}
              color={status.length ? theme.colors.accent : theme.colors.primary}
            />
          </View>
        </View>
        <View
          style={[
            cardStyles.btnContainer,
            {
              borderColor: status.length
                ? theme.colors.accent
                : theme.colors.primary,
            },
          ]}
        >
          <Button
            color={status.length ? theme.colors.accent : theme.colors.primary}
            mode="contained"
            style={[
              cardStyles.innerBtnContainer,
              {
                color: status.length
                  ? theme.colors.accent
                  : theme.colors.primary,
              },
            ]}
            labelStyle={cardStyles.btnlabel}
            onPress={status.length ? () => checkout() : () => checkIn()}
            disabled={locationLoading || submitLoading}
            // loading={locationLoading || submitLoading}
          >
            {locationLoading || submitLoading ? (
              <ActivityIndicator color="#a5a5a5" />
            ) : (
              <Text>{!status.length ? "Clock In" : "Clock Out"}</Text>
            )}
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Dashboard;

const cardStyles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "90%",
    minHeight: CARD_HEIGHT,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    alignSelf: "center",
    top: height * 0.22,
    padding: 13,
    flexDirection: "row",
    // alignItems: "center",
  },
  title: {
    fontSize: 23,
    fontWeight: "500",
  },
  description: {
    fontSize: 16,
    marginTop: 5,
  },
  status: {
    fontWeight: "500",
    fontSize: 18,
    color: theme.colors.primary,
    fontStyle: "italic",
  },
  btnContainer: {
    height: "40%",
    // width: "30%",
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    alignSelf: "center",
  },
  innerBtnContainer: {
    // backgroundColor: theme.colors.primary,
    flex: 1,
    borderRadius: 1000,
    margin: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  btnlabel: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "none",
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  content: {
    backgroundColor: theme.colors.grey001,
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    // flex: height * 0.8
    height: height * 0.3,
    backgroundColor: theme.colors.primary,
  },
  thumnail: {
    height: 120,
    width: 120,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: theme.colors.white,
  },
  profileImg: {
    flex: 1,
    height: null,
    width: null,
    borderRadius: 120,
  },
  greeting: {
    fontSize: 18,
  },
  question: {
    fontWeight: "700",
    fontSize: 23,
    letterSpacing: 0.2,
    marginTop: 10,
  },
  logoutBtn: {
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "77%",
    alignSelf: "center",
    borderRadius: 0,
  },
  logoutBtnText: {
    color: "white",
    fontWeight: "bold",
  },
});
