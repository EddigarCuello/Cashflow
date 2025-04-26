import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CapitalizacionScreen from '../screens/CapitalizacionScreen';
import AnnuitiesScreen from '../screens/AnnuitiesScreen';
import GradienteScreen from '../screens/GradienteScreen';
import AmortizacionScreen from '../screens/AmortizacionScreen';
import TotalInteres from '../screens/TotalInteres';
import TasaDeInteres from '../screens/TasaDeInteres';
import CompoundInterestScreen from '../screens/CompoundInterestScreen';
import TIRScreen from '../screens/TIRScreen';
import AuthScreen from '../screens/AuthScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RecoveryScreen from '../screens/RecoveryScreen';
import ConsignarScreen from '../screens/ConsignarScreen';
import AdminScreen from '../screens/AdminScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1B1D2A',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#E5A442',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Pantallas de Autenticación */}
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ 
          title: 'Iniciar Sesión',
          headerTransparent: true,
          headerBackTitleVisible: false
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ 
          title: 'Crear Cuenta',
          headerTransparent: true,
          headerBackTitleVisible: false
        }}
      />
      <Stack.Screen
        name="RecoveryScreen"
        component={RecoveryScreen}
        options={{ 
          title: 'Recuperar Contraseña',
          headerTransparent: true,
          headerBackTitleVisible: false
        }}
      />

      {/* Pantallas de la Aplicación */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Consignar"
        component={ConsignarScreen}
        options={{ 
          title: 'Consignar Dinero',
          headerTransparent: true,
          headerBackTitleVisible: false
        }}
      />
      <Stack.Screen
        name="TotalInteres"
        component={TotalInteres}
        options={{ title: 'Tasa de Interés' }}
      />
      <Stack.Screen
        name="TasaDeInteres"
        component={TasaDeInteres}
        options={{ title: 'Interés Simple' }}
      />
      <Stack.Screen
        name="InteresCompuesto"
        component={CompoundInterestScreen}
        options={{ title: 'Interés Compuesto' }}
      />
      <Stack.Screen
        name="Capitalizacion"
        component={CapitalizacionScreen}
        options={{ title: 'Capitalización' }}
      />
      <Stack.Screen
        name="Anualidades"
        component={AnnuitiesScreen}
        options={{ title: 'Anualidades' }}
      />
      <Stack.Screen
        name="Gradiente"
        component={GradienteScreen}
        options={{ title: 'Gradientes' }}
      />
      <Stack.Screen
        name="Amortizacion"
        component={AmortizacionScreen}
        options={{ title: 'Amortización' }}
      />
      <Stack.Screen
        name="TIR"
        component={TIRScreen}
        options={{ title: 'TIR' }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ 
          title: 'Panel de Administración',
          headerTransparent: true,
          headerBackTitleVisible: false
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator; 