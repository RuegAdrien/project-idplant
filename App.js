import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import PictureScreen from './PictureScreen';

export default function App() {
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({ color, size}) => {
            
            let iconName;

            if(route.name === 'Home') {
              iconName = 'md-home';
            } else if (route.name === 'Picture') {
              iconName = 'md-camera';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Picture" component={PictureScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
