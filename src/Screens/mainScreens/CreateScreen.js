import { Camera, CameraType } from "expo-camera";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

import * as Location from "expo-location";

export default function CreateScreen({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [snap, setSnap] = useState(null);
  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState("");
  const [isShowKeyBoard, setIsShowKeyBoard] =
    useState(false);

  const [permission, requestPermission] =
    Camera.useCameraPermissions();

  useEffect(() => {
    (async () => {
      let { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg(
          "Permission to access location was denied"
        );
        return;
      }
    })();
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button
          onPress={requestPermission}
          title="grant permission"
        />
      </View>
    );
  }

  // let text = "Waiting..";
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  // }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back
        ? CameraType.front
        : CameraType.back
    );
  }

  const takePhoto = async () => {
    if (!photo) {
      const { uri } = await snap.takePictureAsync();
      setPhoto(uri);
      let currentLocation =
        await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    }
    if (photo) {
      setPhoto("");
    }
  };

  const postIsReady = () => {
    if (!photo || !title || !locality || !location)
      return false;
    return true;
  };

  const sendPhoto = async () => {
    if (!postIsReady())
      return Alert.alert("Fill in all fields");
    // let currentLocation =
    //   await Location.getCurrentPositionAsync({});
    // setLocation(currentLocation);

    navigation.navigate("DefaultPosts", {
      photo,
      location: location.coords,
      title,
      locality,
    });
    setPhoto("");
    setLocation("");
    setTitle("");
    setLocality("");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={
          Platform.OS === "ios" ? "padding" : "height"
        }
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      >
        <View style={styles.container}>
          <Camera
            style={styles.camera}
            type={type}
            ref={setSnap}
          >
            {photo && (
              <View style={styles.takePhotoContainer}>
                <Image
                  source={{ uri: photo }}
                  style={{
                    width:
                      Dimensions.get("window").width - 32,
                    height: 240,
                    borderRadius: 8,
                  }}
                />
              </View>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraType}
              >
                <Ionicons
                  name="camera-reverse-outline"
                  size={24}
                  color="#BDBDBD"
                />
              </TouchableOpacity>
            </View>
            {!photo ? (
              <View style={styles.snapWrapper}>
                <TouchableOpacity
                  onPress={takePhoto}
                  style={styles.snapContainer}
                >
                  <MaterialIcons
                    name="photo-camera"
                    size={24}
                    color="#BDBDBD"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.deleteSnapWrapper}>
                <TouchableOpacity
                  onPress={takePhoto}
                  style={{
                    ...styles.snapContainer,
                    width: 30,
                    height: 30,
                  }}
                >
                  <FontAwesome
                    name="trash-o"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            )}
          </Camera>
          <View style={styles.inputContainer}>
            {!photo ? (
              <Text style={styles.textOptionsFoto}>
                Upload a photo
              </Text>
            ) : (
              <Text style={styles.textOptionsFoto}>
                Edit photo
              </Text>
            )}
            <View>
              <TextInput
                style={styles.input}
                placeholder={"Title..."}
                onFocus={() => setIsShowKeyBoard(true)}
                value={title}
                onChangeText={(value) => setTitle(value)}
              />
            </View>
            <View>
              <TextInput
                style={styles.input}
                placeholder={"Locality..."}
                onFocus={() => setIsShowKeyBoard(true)}
                value={locality}
                onChangeText={(value) => setLocality(value)}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={sendPhoto}
            style={{
              ...styles.publishBtn,
              backgroundColor: !postIsReady()
                ? "#F6F6F6"
                : "#FF6C00",
            }}
          >
            <Text
              style={{
                fontFamily: "SS_Regular",
                fontSize: 16,
                color: postIsReady()
                  ? "#ffffff"
                  : "#BDBDBD",
              }}
            >
              {photo && !location && <Text>Wait</Text>}{" "}
              Publish
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginHorizontal: 16,
  },
  camera: {
    position: "relative",
    height: 240,
    marginTop: 32,
    marginBottom: 8,
    borderRadius: 8,
  },
  takePhotoContainer: {
    position: "absolute",
    borderColor: "#fff",
    borderWidth: 1,
    height: "100%",
    width: "100%",
  },
  snapWrapper: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginRight: "-50%",
    marginBottom: "-50%",
    flex: 1,
    justifyContent: "flex-start",

    alignItems: "center",
  },
  deleteSnapWrapper: {
    position: "absolute",
    bottom: -10,
    right: 10,
  },
  snapContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: "#FFFFFF",
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  snap: { color: "#FFF" },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 24,
  },
  button: {
    flex: 1,
    alignSelf: "flex-start",
    alignItems: "flex-end",
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
  publishBtn: {
    marginTop: 43,
    marginBottom: 16,
    backgroundColor: "#FF6C00",
    height: 51,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {},
  textOptionsFoto: {
    marginBottom: 16,
    color: "#BDBDBD",
    fontFamily: "SS_Regular",
    fontSize: 16,
  },
  input: {
    marginTop: 16,
    paddingLeft: 16,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 8,
    height: 50,
    fontFamily: "SS_Regular",
    color: "#BDBDBD",
    fontSize: 16,
  },
});
