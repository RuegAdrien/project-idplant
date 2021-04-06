import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, Image, View, Button} from 'react-native';
import { Overlay } from 'react-native-elements';
import { Camera } from 'expo-camera';
import * as firebase from 'firebase';

export default function PictureScreen() {

    const firebaseConfig= {
        apiKey: "AIzaSyAUWtccQKHZA9QIQpkGVR6Pb_mpmI6P_2g",
        authDomain: "project-idplant.firebaseapp.com",
        databaseURL: "https://project-idplant-default-rtdb.firebaseio.com",
        projectId: "project-idplant",
        storageBucket: "project-idplant.appspot.com",
        messagingSenderId: "988738189982",
      };
    
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
     }else {
        firebase.app(); // if already initialized, use that one
     }
    
    const [hasCameraPermission, setPermission] = useState(null);
    const[photoUrl, setPhotoUrl] = useState('');
    const[photoBase64, setPhotoBase64] = useState([]);
    const[dateTime, setDateTime] = useState('0.0.0 0:0:0');
    const[probability, setProbability] = useState(0);
    const camera= useRef(null);

    const data = {
        api_key: "dXfT0KEABlypmofQqauHDaPKS6T0L9Pf0LfaolqO34hxbDz5RW",
        images: photoBase64,
        modifiers: ["crops_fast", "similar_images"],
        plant_language: "en",
        plant_details: ["common_names",
                          "url",
                          "wiki_description",
                        ]
    };

    const[visible, setVisible] = useState(false);
    const [idName, setIdName] = useState('Rosa Botanica');
    const [idImageUrl, setIdImageUrl] = useState('https://cdn.pixabay.com/photo/2014/04/10/11/24/rose-320868__340.jpg');

    useEffect(() => {
    askCameraPermission();
    }, []);

    const askCameraPermission = async () => {
        const { status } = await Camera.requestPermissionsAsync();
        setPermission( status == 'granted' );
    }

    const snap = async() => {
        if (camera) {
            const photo = await camera.current.takePictureAsync({base64:true,quality:0.1});
            setPhotoBase64([photo.base64]);
        }
    };

    const getID = () => {
        fetch('https://api.plant.id/v2/identify', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then((response) => response.json())
            .then((identification) => {
                console.log('Success', identification);
                setIdName(identification.suggestions[0].plant_details.common_names[0]);
                setIdImageUrl(identification.suggestions[0].similar_images[0].url);
                setPhotoUrl(identification.images[0].url);
                setProbability(Math.trunc(identification.suggestions[0].probability * 100));
                updateTime();
                toggleOverlay();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const updateTime = () => {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        var hour = new Date().getHours();
        var min = new Date().getMinutes();
        var sec = new Date().getSeconds();
        setDateTime(date + '.' + month + '.' + year + ' ' + hour + ':' + min + ':' + sec);
    }

    const savePlant = () => {
        firebase.database().ref('plants/').push(
            {'name' : idName, 'photourl' : photoUrl, 'datetime' : dateTime}
        );
        toggleOverlay();
    }

    const toggleOverlay = () => {
        setVisible(!visible);
    }

    return(
        <View style={styles.container}>
            { hasCameraPermission ?
                (
                    <View style={{ width:'100%', flex:1}}>
                        <Overlay overlayStyle={{height:'50%'}} isVisible={visible}>
                            <View style={{flex:4, alignItems:'center'}}>
                                <Text style={{fontWeight:'bold', fontSize:20}}>{idName}</Text>
                                <Image style={{
                                    width: 200,
                                    height: '80%',
                                    resizeMode: 'contain'
                                }}
                                source= {{ uri: idImageUrl }}/>
                                <Text>Probability: {probability}%</Text>
                            </View>
                            <View style={{flex:1, flexDirection: 'row', alignItems:'center', justifyContent:'space-around'}}>
                                <Button color='red' title="Try Again" onPress={toggleOverlay}/>
                                <Button color='green' title="Save" onPress={savePlant}/>
                            </View>
                        </Overlay>

                        <Camera style={{ flex:2, resizeMode: 'contain' }} ref ={camera} />
                        <Image style={{flex:1, resizeMode:'contain'}} source={{uri : `data:image/gif;base64,${photoBase64}`}} />
                        <View style={{justifyContent: 'space-evenly', flexDirection: 'row'}}>
                            <Button title="TakePhoto" onPress={snap} />
                            <Button title="Send" onPress={getID} />
                        </View>
                    </View>
                    ) : (
                        <Text>No access to camera.</Text>
            )}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
    }
});
