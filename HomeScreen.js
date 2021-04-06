import * as firebase from 'firebase';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, FlatList} from 'react-native';

export default function HomeScreen() {

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

    const[plants, setPlants] = useState([]);

    useEffect(() => {
        firebase.database().ref('plants/').on('value', snapshot => {
          const data= snapshot.val();
          if(data != null){
            const objs = Object.values(data);
            setPlants(objs);
          }
        });
      }, []);

    const listSeparator = () => {
        return (
        <View
            style={{
            height: 5,
            width: "80%",
            backgroundColor: "#fff",
            marginLeft: "10%"
            }}
        />
        );
    };

    return(
        <View style={styles.container}>
            <FlatList 
                style={{marginLeft : "5%", marginTop : "10%", width: "90%"}}
                keyExtractor={plant => plant.datetime}
                renderItem={({item}) => 
                    <View style={styles.listcontainer}>
                        <Text style={{fontSize: 18, fontWeight: 'bold'}}>{item.name}</Text>
                        <Image source={{ uri: item.photourl}} style={{height: 100, width: 100}}/>
                        <Text>{item.datetime}</Text>
                    </View>} 
                data={plants} 
                ItemSeparatorComponent={listSeparator} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
     flex: 1,
     backgroundColor: '#fff',
     alignItems: 'center',
     justifyContent: 'center',
    },
    listcontainer: {
        width: '100%',
        flexDirection: 'column',
        backgroundColor: '#fff',
        alignItems: 'center'
    }
});
