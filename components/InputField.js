import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputField = ({ label, placeholder, onChangeText, secureTextEntry, keyboardType }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#ffffff" // Asegura que sea blanco
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    marginBottom: 15,
  },
  label: {
    color: '#ffffff',
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    color: '#ffffff', // Color del texto ingresado
  },
});

export default InputField;
