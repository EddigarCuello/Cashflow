import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ title, onPress, filled, style }) => {
    return (
      <TouchableOpacity
        style={[styles.button, filled ? styles.filled : styles.outlined, style]} // Agregar `style` aquí
        onPress={onPress}
      >
        <Text style={[styles.text, filled ? styles.textFilled : styles.textOutlined]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  filled: {
    backgroundColor: '#3B82F6',
  },
  outlined: {
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textFilled: {
    color: '#ffffff',
  },
  textOutlined: {
    color: '#ffffff',
  },
});

export default Button;