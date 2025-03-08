import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

const RecoveryScreen = ({ navigation }) => {
  const [cedula, setCedula] = useState('');

  const handleRecovery = () => {
    if (!cedula) {
      Alert.alert("Error", "Por favor, ingresa tu cédula.");
      return;
    }

    Alert.alert("Éxito", `Se enviará un código de recuperación al correo asociado a la cédula: ${cedula}`);
    console.log("Cédula ingresada:", cedula);
  };

  return (
    <View style={styles.container}>
      <Ionicons 
        name="arrow-back" 
        size={30} 
        color="white" 
        style={styles.backButton} 
        onPress={() => navigation.goBack()} 
      />

      <Text style={styles.title}>Recuperar Cuenta</Text>
      <Text style={styles.subtitle}>Ingresa tu cédula para enviar un código de recuperación a tu correo.</Text>

      <TextInput
        style={styles.input}
        placeholder="Ingresa tu cédula"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={cedula}
        onChangeText={setCedula}
      />

      <Button title="Enviar Código" filled onPress={handleRecovery} style={styles.recoveryButton} />
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
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000',
  },
  recoveryButton: {
    width: '100%',
    paddingVertical: 15,
  },
});

export default RecoveryScreen;