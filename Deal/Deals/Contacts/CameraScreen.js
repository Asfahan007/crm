// 'use strict';
import React, { PureComponent } from 'react';
import { useState } from 'react';
import {StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
// import TextRecognition from 'react-native-text-recognition';
import RNTextDetector from 'rn-text-detector';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'


const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text>Waiting</Text>
  </View>
);

const CameraScreen=({navigation})=>{
    const[text,settext]=useState('')
    const[isFlash,setIsFlash]=useState(false)
    const [isactive,setisactive]=useState(false)
    const takePicture = async function(camera) {
      setisactive(true)
        const options = { quality: 0.5, base64: true,fixOrientation: true,forceUpOrientation: true };
        const data = await camera.takePictureAsync(options);
        //  eslint-disable-next-line
        console.log("x",data);
        // const result =[];
        // = await TextRecognition.recognize(`${data.uri}`)
        const result=await RNTextDetector.detectFromUri(data.uri);
        settext(result)
        console.log("insidetext",result.length)
        result.map((e)=>{
          console.log(e.text)
        })

        result.length>1?navigation.navigate("Camera Data",{result,other:data.uri}):alert("Please Capture Picture Properly");
        if(result.length<1)
        {
          setisactive(false)
        }
      };
      console.log("outsidetext",text)

      
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={isFlash?RNCamera.Constants.FlashMode.on: RNCamera.Constants.FlashMode.off}
          autoFocus={RNCamera.Constants.AutoFocus.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
         
          
        >
          {({ camera, status, recordAudioPermissionStatus }) => {
            console.log("camera",status);
            if (status !== 'READY')
             return <PendingView />;
            //  if(status=='NOT_AUTHORIZED')
            //  return navigation.navigate("AllContact");
            return (
              <View style={{flexDirection:'row',marginBottom:20}}>
              <View style={{ }}>
                <TouchableOpacity onPress={() =>takePicture(camera)} style={{padding:10,alignSelf:'center',marginLeft:140}} disabled={isactive}>
                  {/* <Text style={{ fontSize: 14 }}> SNAP </Text> */}
                <Ionicons name={"ios-camera-outline"} size={50} color="white"/>

                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={()=>setIsFlash(!isFlash)}>
              <View>
                {/* <FontAwesome5 name="bolt" size={40} color="#17B29A" style={{flexDirection:'row',marginLeft:100}} /> */}
                <Ionicons name={isFlash?'flash-outline':'flash-off-outline'} size={30} color="white" style={{flexDirection:'row',marginLeft:100,marginTop:20}} />

                </View>
                </TouchableOpacity>
                </View>
            );
          }}
        </RNCamera>
      </View>
    );
  }

  

export default CameraScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    
  },
  capture: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
