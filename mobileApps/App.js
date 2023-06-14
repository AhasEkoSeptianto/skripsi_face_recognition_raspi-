import { StatusBar } from "expo-status-bar";
import { Fragment, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
// import socket from './socket';
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "react-native";
import { Image } from "react-native";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableHighlight } from "react-native";
import { TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { io } from "socket.io-client";
import { Storage } from "expo-storage";
import axios from "axios";
import { PermissionsAndroid } from "react-native";
import messaging from "@react-native-firebase/messaging";

var socket = io("ws://192.168.100.9:3001", {
  // var socket = io("ws://tired-chefs-prove-103-119-62-12.loca.lt//", {
  // var socket = io("ws://skripsiAhasEkoSeptianto.com/", {
  transports: ["websocket", "polling"],
});

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const getTime = (time = "") => {
  let whitoutExtension = time?.split(".")?.[0];
  let changeDivider = whitoutExtension?.split("_");
  let res = `${changeDivider[0]}-${changeDivider[1]}-${changeDivider[2]} ${changeDivider[3]}:${changeDivider[4]}`;
  return res;
};

export default function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    messaging()
      .getToken()
      .then(async (token) => {
        console.log(token);
        setToken(token);
      })
      .catch((err) => {
        console.log(err);
      });

    messaging()
      .getInitialNotification()
      .then(async (remoteMsg) => {
        if (remoteMsg) {
          console.log(
            "notification cause app to open from quit state: ",
            remoteMsg.notification
          );
        }
      });

    messaging().onNotificationOpenedApp(async (remoteMsg) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMsg.notification
      );
    });

    // register background handler
    messaging().setBackgroundMessageHandler(async (remoteMsg) => {
      console.log("Message handled in the background", remoteMsg);
    });

    const unsubscribe = messaging().onMessage(async (remoteMsg) => {
      // Alert.alert("A new FCM message arrived !", JSON.stringify(remoteMsg));
    });

    return unsubscribe;
  }, []);

  return (
    <Fragment>
      <StatusBar style="auto" />
      {/* <Text>tes</Text> */}

      {/* fqhqfKdjR2-YXO6LY9CvlR:APA91bEI9SJYzxoMLs4E8FY8fxiE2zqbes_QQ4vPOd3S586b-Cxj0SzL7ecUXplda3aRKRgNIR33iEtx2koNG0Q_qv3ypiDs8wFzs6cA_PAvoSw2o4pq_vPYnDmgMtbc6ohEDG0slxhM */}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="startup" options={{ headerShown: false }}>
            {(props) => <Startup {...props} messagingToken={token} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      {/* <Text>{JSON.stringify(token)}</Text> */}
    </Fragment>
  );
}

function Startup({ navigation, messagingToken }) {
  const [allImageUnknow, setAllImageUnknow] = useState([]);
  const [cctv, setCctv] = useState("");
  const [allFileName, setAllFileName] = useState([]);

  const [imgKnowFace, setImgKnowFace] = useState([]);
  const [allFileNameKnowFace, setAllFileNameKnowFace] = useState([]);

  const [updateSocket, setUpdateSocket] = useState(null);

  useEffect(() => {
    socket.on("count_unknowFace", (data) => {
      setAllImageUnknow(data?.image);
      setAllFileName(data?.allFiles);
    });
    socket.on("knowFaces", (data) => {
      setImgKnowFace(data?.image);
      setAllFileNameKnowFace(data?.allFiles);
    });
    socket.on("imageData", (data) => {
      let image = `data:image/png;base64, ${data}`;
      setCctv(image);
    });
  }, [socket, updateSocket]);

  const LogoutApps = async () => {
    raspiID = "";
    let isHaveRaspiID = await Storage.getItem({ key: "@storage" });
    if (isHaveRaspiID) {
      let storage = JSON.parse(isHaveRaspiID);
      raspiID = storage.raspi_id;
    }

    await axios
      .post(
        "https://raspi-gateway.netlify.app/api/MobileAppsLogout?raspi_id=" +
          raspiID +
          "&messagingID=" +
          messagingToken
      )
      .then(async (res) => {
        await Storage.setItem({ key: "raspiID", value: "" })
          .then((res) => {
            navigation.navigate("GetRaspi");
            socket.disconnect();
            socket.close();
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  };

  return (
    <Fragment>
      <Drawer.Navigator initialRouteName="GetRaspi">
        {/* <Drawer.Navigator initialRouteName='WajahTidakDiketahui'> */}
        <Drawer.Screen
          name="GetRaspi"
          options={{
            drawerItemStyle: { height: 0 },
            headerShown: false,
          }}
        >
          {(props) => (
            <GetRaspiDevice
              {...props}
              messagingToken={messagingToken}
              setUpdateSocket={setUpdateSocket}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen
          name="Home"
          options={{
            headerRight: () => (
              <TouchableOpacity onPress={LogoutApps}>
                <Text style={{ marginRight: 10 }}>Keluar</Text>
              </TouchableOpacity>
            ),
          }}
        >
          {(props) => (
            <Home
              {...props}
              cctv={cctv}
              allImageUnknow={allImageUnknow}
              setUpdateSocket={setUpdateSocket}
            />
          )}
        </Drawer.Screen>
        <Drawer.Screen
          name="WajahTidakDiketahui"
          options={{
            title: "Wajah yang tidak diketahui",
          }}
        >
          {(props) => (
            <WajahTidakDiketahui
              {...props}
              allImageUnknow={allImageUnknow}
              allFileName={allFileName}
            />
          )}
        </Drawer.Screen>

        <Drawer.Screen
          name="WajahDiketahui"
          options={{
            title: "Dataset / Wajah tersimpan",
          }}
        >
          {(props) => (
            <DataSet
              {...props}
              imgKnowFace={imgKnowFace}
              allFileNameKnowFace={allFileNameKnowFace}
            />
          )}
        </Drawer.Screen>

        <Drawer.Screen
          name="saveFace"
          options={{
            title: "simpan wajah",
            drawerItemStyle: { height: 0 },
          }}
        >
          {(props) => (
            <SaveFaces
              {...props}
              allFileName={allFileName}
              allImageUnknow={allImageUnknow}
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </Fragment>
  );
}

function GetRaspiDevice({ navigation, setUpdateSocket, messagingToken }) {
  const [formRaspiID, setFormRaspiID] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [alert, setAlert] = useState("");
  const Submit = async () => {
    setLoadingSubmit(true);
    await axios
      .get(
        "https://raspi-gateway.netlify.app/api/raspi_config?raspi_id=" +
          formRaspiID +
          "&messagingID=" +
          messagingToken
      )
      // await axios.get("http://192.168.100.9:3000/api/raspi_config?raspi_id=" + formRaspiID + "&messagingID=" + messagingToken)
      .then(async (res) => {
        if (res?.data?.data?.length > 0) {
          let host = res?.data?.data?.[0]?.mobileAppsCon
            ?.replace("https://", "ws://")
            ?.replace("\n", "");
          socket = await io(host, {
            transports: ["websocket", "polling"],
          });
          // await Storage.setItem({ key: 'raspiID', value: formRaspiID })
          await Storage.setItem({
            key: "@storage",
            value: JSON.stringify(res?.data?.data?.[0]),
          });
          navigation.navigate("Home");
          setFormRaspiID("");
        } else {
          Alert.alert("error", "maaf id rasberry pi kamu tidak ditemukan");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setLoadingSubmit(false);
  };

  useEffect(() => {
    Setup();
  }, []);

  const Setup = async () => {
    let isHaveRaspiID = await Storage.getItem({ key: "@storage" });
    if (isHaveRaspiID) {
      let storage = JSON.parse(isHaveRaspiID);
      let host = storage?.mobileAppsCon
        ?.replace("https://", "ws://")
        ?.replace("\n", "");
      socket = await io(host, {
        transports: ["websocket", "polling"],
      });
      setUpdateSocket(Math.random());
      navigation.navigate("Home");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View style={{ maxWidth: "80%" }}>
        <Text style={{ textAlign: "center" }}>
          Harap masukan rasberry pi ID anda untuk terhubung pada sistem kami
        </Text>
        <TextInput
          placeholder="ketik rasberry pi ID anda"
          onChangeText={(text) => setFormRaspiID(text)}
          value={formRaspiID}
          style={{
            textAlign: "center",
            borderWidth: 0.2,
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
          }}
        />
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity
            style={{ backgroundColor: "#0078AA", borderRadius: 5, padding: 5 }}
            onPress={Submit}
          >
            <Text
              disabled={loadingSubmit}
              style={{ textAlign: "center", color: "white", fontSize: 15 }}
            >
              {loadingSubmit ? <ActivityIndicator color="white" /> : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function Home({ navigation, cctv, allImageUnknow }) {
  const [raspiID, setRaspiID] = useState("");

  useEffect(() => {
    Setup();
  }, []);

  const Setup = async () => {
    let isHaveRaspiID = await Storage.getItem({ key: "@storage" });
    if (isHaveRaspiID) {
      let storage = JSON.parse(isHaveRaspiID);
      setRaspiID(storage.raspi_id);
    }
  };

  return (
    <Fragment>
      <View style={{ flex: 10 }}>
        <Text style={{ paddingVertical: 10, marginLeft: 5 }}>
          ID device rasberry pi kamu : {raspiID}
        </Text>
        <View
          style={{
            flex: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{ width: "100%", height: 300, marginTop: -100 }}
            source={{ uri: cctv }}
            resizeMethod="scale"
          />
        </View>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("WajahTidakDiketahui")}
          >
            <Text>Wajah yang tidak diketahui : {allImageUnknow?.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
}

function WajahTidakDiketahui({ navigation, allImageUnknow, allFileName }) {
  return (
    <View style={{ marginTop: 5 }}>
      <ScrollView>
        {allImageUnknow?.map((item, key) => (
          <View
            style={{
              backgroundColor: "white",
              marginBottom: 5,
              padding: 10,
              marginHorizontal: 10,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-around",
            }}
          >
            <Image
              key={key}
              style={{ width: 100, height: 100, borderRadius: 5 }}
              source={{
                uri: `data:image/png;base64, ${item}`,
              }}
            />
            <View
              style={{
                height: 100,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Text style={{ fontSize: 13 }}>Tanggal Terekam :</Text>
              <Text>{getTime(allFileName?.[key])}</Text>
              <Button
                title="Saya Mengenalnya"
                onPress={() => navigation.navigate("saveFace", { imgIdx: key })}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function SaveFaces({ navigation, route, allImageUnknow, allFileName }) {
  const { params } = route;
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [name, setName] = useState("");

  // console.log(`data:image/png;base64, ${allImageUnknow?.[params?.imgIdx]}`)

  const Submit = async () => {
    setLoadingSubmit(true);
    socket.emit("saveFace", {
      fileName: allFileName?.[params?.imgIdx],
      name: name,
    });
    socket.on("saveFaceSuccess", (data) => {
      // console.log(data);
      if (data === "success") {
        setName("");
        navigation.navigate("WajahTidakDiketahui");
        setLoadingSubmit(false);
      }
    });
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {allImageUnknow?.map((item, key) => (
        <Fragment>
          {key === params?.imgIdx && (
            <Image
              key={key}
              style={{ width: 100, height: 100, borderRadius: 5 }}
              source={{
                uri: `data:image/png;base64, ${item}`,
              }}
            />
          )}
        </Fragment>
      ))}
      <View style={{ marginTop: 20, width: "80%" }}>
        <TextInput
          style={{
            borderWidth: 0.2,
            borderRadius: 5,
            padding: 10,
            textAlign: "center",
          }}
          placeholder="ketik nama"
          onChangeText={(text) => setName(text)}
          value={name}
        />
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#0078AA",
          borderRadius: 5,
          padding: 5,
          marginTop: 20,
          width: "30%",
        }}
        onPress={Submit}
      >
        <Text
          disabled={loadingSubmit}
          style={{ textAlign: "center", color: "white", fontSize: 15 }}
        >
          {loadingSubmit ? <ActivityIndicator color="white" /> : "Submit"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function DataSet({ navigation, allFileNameKnowFace, imgKnowFace }) {
  // console.log(imgKnowFace.length);
  const getTimeF = (time = "") => {
    time = time?.replaceAll(".jpg", "")?.replaceAll(".png", "");
    let name = time?.split("_").shift();
    let whitoutName = time.replaceAll(name + "_", "");
    time = getTime(whitoutName);

    return time;
  };

  // console.log(imgKnowFace);

  return (
    <View style={{ marginTop: 5 }}>
      <ScrollView>
        {imgKnowFace?.map((item, key) => (
          <View
            key={key}
            style={{
              backgroundColor: "white",
              marginBottom: 5,
              padding: 10,
              marginHorizontal: 10,
              borderRadius: 5,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-around",
            }}
          >
            <Image
              key={key}
              style={{ width: 100, height: 100, borderRadius: 5 }}
              source={{
                uri: `data:image/png;base64, ${item}`,
              }}
            />
            <View
              style={{
                height: 100,
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 13, marginBottom: 10 }}>
                Nama : {allFileNameKnowFace?.[key]?.split("_")?.shift()}
              </Text>
              <Text style={{ fontSize: 13 }}>
                Tanggal Terekam : {getTimeF(allFileNameKnowFace?.[key])}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  width: "90%",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    socket.emit("deleteFace", {
                      fileName: allFileNameKnowFace?.[key],
                    });
                  }}
                >
                  <Text style={{ color: "red" }}>hapus</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
