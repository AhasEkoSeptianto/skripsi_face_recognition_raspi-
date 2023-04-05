import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import socket from './socket';
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

import { Storage } from 'expo-storage'

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

  useEffect(() => {
    socket.on("count_unknowFace", data => {
      setAllImageUnknow(data?.image)
    })
    socket.on("imageData", data => {
      let image = `data:image/png;base64, ${data}`
      setCctv(image)
    })
  },[socket])

  return (
    <Fragment>
      <Drawer.Navigator initialRouteName='GetRaspi'>
        <Drawer.Screen 
          name='GetRaspi'
          options={{
            drawerItemStyle: { height: 0 }
          }}  
        >
          {(props) => <GetRaspiDevice {...props} />}
        </Drawer.Screen>
        <Drawer.Screen name='Home'
          
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
      </Drawer.Navigator>
    </Fragment>
  )
}

function GetRaspiDevice({ navigation }){
  const [ formRaspiID, setFormRaspiID ] = useState('')
  const [ loadingSubmit, setLoadingSubmit ] = useState(false)
  const Submit = async () => {
    setLoadingSubmit(true)
    await Storage.setItem({
      key: 'raspiID',
      value: formRaspiID
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


  const [ raspiID, setRaspiID ] = useState('')
  

  useEffect(() => {
    Setup()
  },[])
  
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
            {/* <Text style={{ fontSize: 13 }}>Apakah anda mengenal orang tersebut ?</Text> */}
            <Button 
              title='Saya Mengenalnya'
            />
          </View>
        </View>
      ))}
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
