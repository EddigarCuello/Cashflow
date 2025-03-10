import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './screens/AuthScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RecoveryScreen from './screens/RecoveryScreen';
import HomeScreen from './screens/HomeScreen';
import TasaDeInteres from './screens/TasaDeInteres'; // Importa la nueva pantalla

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthScreen">
        <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RecoveryScreen" component={RecoveryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TasaDeInteres" component={TasaDeInteres} options={{ headerShown: false }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;