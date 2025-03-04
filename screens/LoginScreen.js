import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import InputField from '../components/InputField';
import Button from '../components/Button';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [pin, setPin] = useState('');

  const handleLogin = () => {
    if (!phoneNumber || !idNumber || !pin) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (phoneNumber.length < 10 || idNumber.length < 5 || pin.length < 4) {
      Alert.alert('Error', 'Verifica los datos ingresados');
      return;
    }

    Alert.alert('Éxito', 'Inicio de sesión exitoso');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField 
          label="Número de teléfono" 
          placeholder="Ingresa tu número de teléfono" 
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <InputField 
          label="Número de identificación" 
          placeholder="Ingresa tu cédula" 
          keyboardType="numeric"
          value={idNumber}
          onChangeText={setIdNumber}
        />

        <InputField 
          label="PIN" 
          placeholder="Ingresa tu PIN" 
          keyboardType="numeric"
          secureTextEntry
          value={pin}
          onChangeText={setPin}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Iniciar sesión" filled onPress={handleLogin} style={styles.loginButton} />
      </View>
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
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%', 
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  loginButton: {
    width: '90%',
    paddingVertical: 15,
  },
});

export default LoginScreen;
