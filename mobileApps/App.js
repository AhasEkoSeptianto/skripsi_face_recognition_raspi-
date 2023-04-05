import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import socket from './socket';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';
import { Image } from 'react-native';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableHighlight } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem('@storage_Key', jsonValue)
  } catch (e) {
    // saving error
  }
}


const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@storage_Key')
    if(value !== null) {
      // value previously stored
    }
  } catch(e) {
    // error reading value
  }
}

export default function App() {

  return (
    <Fragment>
    <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            animation: 'slide_from_right'
          }}
        >
          <Stack.Screen name="startup">
            {(props) => <Startup {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Home">
            {(props) => <Home {...props} />}
          </Stack.Screen>
          <Stack.Screen name="About">
            {(props) => <About {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Fragment>
    
  );
}

function Startup({ navigation }){
  const [ formRaspiID, setFormRaspiID ] = useState('')
  const [ loadingSubmit, setLoadingSubmit ] = useState(false)
  const Submit = async () => {
    setLoadingSubmit(true)
    await storeData(formRaspiID)
    setLoadingSubmit(false)
  }


  useEffect(() => {
    console.log(getData())
  },[])

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


function Home({ navigation }){


  const [ cctv, setCctv ] = useState("")
  const [ totalUnknowFace, setTotalUnknowFace ] = useState([])


  useEffect(() => {
    socket.on("imageData", data => {
      let image = `data:image/png;base64, ${data}`
      setCctv(image)
    })
    
    socket.on("count_unknowFace", data => {
      setTotalUnknowFace(data?.image)
    })

  },[socket])

  return (
    <Fragment>
      <View style={{ flex: 10 }}>
        <View style={{ flex:8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Image 
            style={{ width: '100%', height: 300, marginTop: -100 }}
            source={{ uri: cctv }}
            resizeMethod='scale'
          />
        </View>
        <View style={{ flex:2, flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}>
          <Text>Unknow Face : {totalUnknowFace?.length}</Text>
        </View>
      </View>
      {/* <Button 
        title='Click To About'
        onPress={() => navigation.navigate("About")}
      /> */}
    </Fragment>
  )
}

function About({ navigation }){
  return (
    <Fragment>
      <Text>About</Text>
      <Button 
        title='Click To Home'
        onPress={() => navigation.navigate("Home")}
      />
    </Fragment>
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
