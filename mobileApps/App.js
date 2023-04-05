import { StatusBar } from 'expo-status-bar';
import { Fragment, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import socket from './socket';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';
import { Image } from 'react-native';

const Stack = createNativeStackNavigator();


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
      <View style={{ flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <Image 
          style={{ width: '100%', height: 300, marginTop: -100 }}
          source={{ uri: cctv }}
          resizeMethod='scale'
        />
      </View>
      <View>
        <Text>Unknow Face : {totalUnknowFace?.length}</Text>
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
