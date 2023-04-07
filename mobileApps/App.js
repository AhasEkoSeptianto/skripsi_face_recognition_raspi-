import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
// import socket from './socket';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';
import { Image } from 'react-native';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableHighlight } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { io } from 'socket.io-client';
import { Storage } from 'expo-storage'
import axios from 'axios';

var socket = io("ws://tired-chefs-prove-103-119-62-12.loca.lt//", {
// var socket = io("ws://skripsiAhasEkoSeptianto.com/", {
    transports: ["websocket", "polling"],
})

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();


export default function App() {

  return (
    <Fragment>
    <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="startup" options={{ headerShown: false }}>
            {(props) => <Startup {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Fragment>
    
  );
}

function Startup({ navigation }){

  const [ allImageUnknow, setAllImageUnknow ] = useState([])
  const [ cctv, setCctv ] = useState('')
  const [ allFileName, setAllFileName ] = useState([])

  useEffect(() => {
    socket.on("count_unknowFace", data => {
      setAllImageUnknow(data?.image)
      setAllFileName(data?.allFiles)
    })
    socket.on("imageData", data => {
      let image = `data:image/png;base64, ${data}`
      setCctv(image)
    })
  },[socket])

  useEffect(() => {

  },[navigation])

  return (
    <Fragment>
      <Drawer.Navigator initialRouteName='GetRaspi'>
      {/* <Drawer.Navigator initialRouteName='WajahTidakDiketahui'> */}
        <Drawer.Screen 
          name='GetRaspi'
          options={{
            drawerItemStyle: { height: 0 },
            headerShown: false
          }}  
        >
          {(props) => <GetRaspiDevice {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name='Home' 
          options={{
            headerRight: () => (
              <TouchableOpacity onPress={async () => {
                console.log("clicked")
                await Storage.setItem({key: 'raspiID', value: "" })
                  .then(res => {
                    navigation.navigate('GetRaspi')
                  }).catch(err => {

                  })
              }}>
                <Text style={{ marginRight: 10 }}>Keluar</Text>
              </TouchableOpacity>
            )
          }}
        >
          {(props) => <Home {...props} cctv={cctv} allImageUnknow={allImageUnknow} />}
        </Drawer.Screen>
        <Drawer.Screen 
          name='WajahTidakDiketahui' 
          options={{
            title: 'Wajah yang tidak diketahui'
          }}
        >
          {(props) => <WajahTidakDiketahui {...props} allImageUnknow={allImageUnknow} />}
        </Drawer.Screen>

        <Drawer.Screen 
          name='saveFace' 
          options={{
            title: 'simpan wajah',
            drawerItemStyle: { height: 0 }
          }}
        >
          {(props) => <SaveFaces {...props} allFileName={allFileName} allImageUnknow={allImageUnknow} />}
        </Drawer.Screen>

      </Drawer.Navigator>
    </Fragment>
  )
}

function GetRaspiDevice({ navigation }){
  const [ formRaspiID, setFormRaspiID ] = useState('')
  const [ loadingSubmit, setLoadingSubmit ] = useState(false)
  const [ alert, setAlert ] = useState('')

  const Submit = async () => {
    setLoadingSubmit(true)
    await axios.get("https://raspi-gateway.netlify.app/api/raspi_config?raspi_id=" + formRaspiID)
      .then(async res => {
        if (res?.data?.data?.length > 0){
          let host = res?.data?.data?.[0]?.mobileAppsCon?.replace('https://', 'ws://')?.replace("\n", "")
          console.log(host , '<==============================')
          socket = await io(host, {
              transports: ["websocket", "polling"],
          })
          console.log(host)
          await Storage.setItem({
            key: 'raspiID',
            value: formRaspiID
          })
          navigation.navigate("Home")
          setFormRaspiID('')
        }else{
          Alert.alert('error', 'maaf id rasberry pi kamu tidak ditemukan')
        }
      }).catch(err => {
        console.log(err)
      })
    
    setLoadingSubmit(false)
  }

  useEffect(() => {
    Setup()
  },[])

  const Setup = async () => {
    let isHaveRaspiID = await Storage.getItem({ key: 'raspiID' })
    if(isHaveRaspiID){
      navigation.navigate('Home')
    }
  }

  return (
    <View style={{ flex:1, flexDirection: 'row', alignItems:'center', justifyContent:'center' }}>
      <View style={{ maxWidth: '80%' }}>
        <Text style={{ textAlign: 'center' }}>Harap masukan rasberry pi ID anda untuk terhubung pada sistem kami</Text>
        <TextInput 
          placeholder='ketik rasberry pi ID anda'
          onChangeText={(text) => setFormRaspiID(text)}
          value={formRaspiID}
          style={{ textAlign: 'center', borderWidth: .2, padding: 10, borderRadius: 5, marginTop: 20 }}
        />
        <View style={{ marginTop: 20 }}>
          <TouchableOpacity style={{ backgroundColor: '#0078AA', borderRadius: 5, padding: 5 }} onPress={Submit}>
            <Text disabled={loadingSubmit} style={{ textAlign: 'center', color: 'white', fontSize: 15 }}>
              {loadingSubmit ? <ActivityIndicator color='white' /> : 'Submit' }
            </Text>
          </TouchableOpacity>
          
          
        </View>
      </View>
    </View>
  )
}


function Home({ navigation, cctv, allImageUnknow }){
  console.log(socket)

  const [ raspiID, setRaspiID ] = useState('')
  
  useFocusEffect(() => {
    Setup()
    // console.log(socket)
  })

  
  const Setup = async () => {
    let isHaveRaspiID = await Storage.getItem({ key: 'raspiID' })
    if (isHaveRaspiID){
      setRaspiID(isHaveRaspiID)
    }
  }

  return (
    <Fragment>
      <View style={{ flex: 10 }}>
        <Text style={{ paddingVertical: 10, marginLeft:5 }}>ID device rasberry pi kamu : {raspiID}</Text>
        <View style={{ flex:8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Image 
            style={{ width: '100%', height: 300, marginTop: -100 }}
            source={{ uri: cctv }}
            resizeMethod='scale'
          />
        </View>
        <View style={{ flex:2, flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => navigation.navigate("WajahTidakDiketahui")}>
            <Text >Wajah yang tidak diketahui : {allImageUnknow?.length}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  )
}

function WajahTidakDiketahui({ navigation, allImageUnknow }){
 
  return (
    <View style={{ marginTop: 5 }}>
      <ScrollView>
        {allImageUnknow?.map((item, key) => (
          <View style={{ backgroundColor: 'white', marginBottom: 5, padding: 10, marginHorizontal: 10, borderRadius: 5, flexDirection: 'row', alignItems:'flex-start', justifyContent: 'space-around' }}>
            <Image 
              key={key}
              style={{ width: 100, height: 100, borderRadius: 5 }}
              source={{
                uri: `data:image/png;base64, ${item}`
              }}
            />
            <View style={{ height: 100, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
              <Text style={{ fontSize: 13 }}>Tanggal Terekam : 1 juni 2022 18.12</Text>
              <Button 
                title='Saya Mengenalnya'
                onPress={() => navigation.navigate("saveFace", { imgIdx: key })}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

function SaveFaces({ navigation, route, allImageUnknow, allFileName }){

  const { params } = route
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [ name, setName ] = useState('')

  // console.log(`data:image/png;base64, ${allImageUnknow?.[params?.imgIdx]}`)

  const Submit = async () => {
    setLoadingSubmit(true)
    socket.emit("saveFace", { fileName: allFileName?.[params?.imgIdx], name: name })
    socket.on("saveFaceSuccess", data => {
      console.log(data)
      if (data === "success"){
        setName('')
        navigation.navigate("WajahTidakDiketahui")
        setLoadingSubmit(false)
      }
    })
  }

  return (
    <View style={{ flex:1,flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {allImageUnknow?.map((item, key) => (
        <Fragment>
          {key === params?.imgIdx && (
            <Image 
              key={key}
              style={{ width: 100, height: 100, borderRadius: 5 }}
              source={{
                uri: `data:image/png;base64, ${item}`
              }}
            />
          )}
        </Fragment>
      ))}
      <View style={{ marginTop: 20, width: '80%' }}>
        <TextInput 
          style={{ borderWidth: .2, borderRadius: 5, padding: 10, textAlign: 'center' }}
          placeholder='ketik nama'
          onChangeText={(text) => setName(text)}
          value={name}
        />
      </View>
      <TouchableOpacity style={{ backgroundColor: '#0078AA', borderRadius: 5, padding: 5, marginTop: 20, width: '30%' }} onPress={Submit}>
        <Text disabled={loadingSubmit} style={{ textAlign: 'center', color: 'white', fontSize: 15 }}>
          {loadingSubmit ? <ActivityIndicator color='white' /> : 'Submit' }
        </Text>
      </TouchableOpacity>
    </View>
  )
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
