import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View,Button } from 'react-native';
import {Camera} from 'expo-camera';
import {Video} from 'expo-av'

export default function App() {

  const [hasAudioPermission,setHasAudioPermission]=useState(null);
  const [hasCameraPermission,setHasCameraPermission]=useState(null);
  const [camera,setCamera]=useState(null)
  const [record,setRecord]=useState(null)
  const [type,setType]=useState(Camera.Constants.Type.front);
  const video=React.useRef(null);
  const [status,setStatus]=React.useState({});
  
  useEffect(()=>{
    (async()=>{
      const cameraStatus=await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status==="granted");
      
      const audioStatus=await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus.status==="granted");
    })();
  },[]);

  const takeVideo=async()=>{
    if(camera){
      const data=await camera.recordAsync({ maxDuration:10})
      setRecord(data.uri);
      console.log(data.uri);
    }
  }

  const stopVideo=async()=>{
    camera.stopRecording();
  }

  if(hasCameraPermission===null || hasAudioPermission===null){
    return <View/>;
  }

  if(hasCameraPermission===false|| hasAudioPermission===false){
    return<Text>No Access to Camera</Text>
  }

  return (
    <View style={{flex:1}}>
     <View style={styles.cameracontainer}>
      <Camera ref={ref=>setCamera(ref)} style={styles.fixedRatio} type={type} ratio={'4:3'}/>
     </View>
     <Video ref={video} style={styles.video} source={{uri:record,}} useNativeControls resizeMode='contain' isLooping onPlaybackStatusUpdate={status=>setStatus(()=>status)}/>
    <Button title={status.isPlaying?'Pause':'Play'} onPress={()=>status.isPlaying? video.current.pauseAsync():video.current.playAsync()}/>
    <Button title="flip video" onPress={()=>{setType(type===Camera.Constants.Type.back? Camera.Constants.Type.front:Camera.Constants.Type.back)}}/>
    <Button title="Take Video" onPress={()=>takeVideo()}/>
    <Button title="Stop Video" onPress={()=>stopVideo()}/>
    </View>
  );
}

const styles = StyleSheet.create({
  cameracontainer: {
    flex: 1,
    flexDirection:'row',
  },
  fixedRatio:{
    flex:1,
    aspectRatio:1
  },
  video:{
    alignSelf:'center',
    width:350,
    height:220,
  },
});
