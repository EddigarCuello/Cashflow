import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "./screens/AuthScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import RecoveryScreen from "./screens/RecoveryScreen";
import HomeScreen from "./screens/HomeScreen";
import AdminScreen from "./screens/AdminScreen";
import TasaDeInteres from "./screens/TasaDeInteres";
import CompoundInterestScreen from "./screens/CompoundInterestScreen";
import AnnuitiesScreen from "./screens/AnnuitiesScreen";
import TotalInteres from "./screens/TotalInteres";
import GradienteScreen from "./screens/GradienteScreen";
import AmortizacionScreen from "./screens/AmortizacionScreen";
import CapitalizacionScreen from './screens/CapitalizacionScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1B1D2A",
          },
          headerTintColor: "#E5A442",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RecoveryScreen"
          component={RecoveryScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TasaDeInteres"
          component={TasaDeInteres}
          options={{ title: "Tasa de Interés" }}
        />
        <Stack.Screen
          name="InteresCompuesto"
          component={CompoundInterestScreen}
          options={{ title: "Interés Compuesto" }}
        />
        <Stack.Screen
          name="Anualidades"
          component={AnnuitiesScreen}
          options={{ title: "Anualidades" }}
        />
        <Stack.Screen
          name="TotalInteres"
          component={TotalInteres}
          options={{ title: "Total Interés" }}
        />
        <Stack.Screen
          name="Gradiente"
          component={GradienteScreen}
          options={{ title: "Gradiente" }}
        />
        <Stack.Screen
          name="Amortizacion"
          component={AmortizacionScreen}
          options={{ title: "Amortización" }}
        />
        <Stack.Screen
          name="Capitalizacion"
          component={CapitalizacionScreen}
          options={{ title: "Capitalización" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
