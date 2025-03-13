import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { login, loginWithCedula } from '../Logic/Auth_Service';

const LoginScreen = ({ navigation }) => {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');

  const handleLogin = async () => {
    if (!correo || !contraseña) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const userData = await loginWithCedula(correo, contraseña);

      if (userData) {
        Alert.alert("Éxito", "Inicio de sesión exitoso.");
        console.log("Datos del usuario:", userData);
        navigation.navigate('HomeScreen'); // Redirige al HomeScreen después del login exitoso
      } else {
        Alert.alert("Error", "Credenciales incorrectas.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al iniciar sesión. Inténtalo de nuevo.");
      console.error("Error en el inicio de sesión:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons 
        name="arrow-back" 
        size={30} 
        color="white" 
        style={styles.backButton} 
        onPress={() => navigation.navigate('AuthScreen')} 
      />
      <View style={styles.inputContainer}>
        <InputField 
          label="Cedula" 
          placeholder="Ingresa tu Cedula" 
          keyboardType="email-address"
          value={correo}
          onChangeText={setCorreo}
        />

        <InputField 
          label="Contraseña" 
          placeholder="Ingresa tu contraseña" 
          keyboardType="default"
          secureTextEntry
          value={contraseña}
          onChangeText={setContraseña}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Iniciar sesión" filled onPress={handleLogin} style={styles.loginButton} />
      </View>

      {/* Texto "Recuperar cuenta" */}
      <TouchableOpacity onPress={() => navigation.navigate('RecoveryScreen')}>
        <Text style={styles.recoveryText}>Recuperar cuenta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20, 
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20, // Espacio adicional para el texto de recuperación
  },
  loginButton: {
    width: '90%',
    paddingVertical: 15,
  },
  recoveryText: {
    color: '#fff', // Color blanco para que coincida con el tema oscuro
    fontSize: 16,
    textDecorationLine: 'underline', // Subrayado para que parezca un enlace
  },
});

export default LoginScreen;