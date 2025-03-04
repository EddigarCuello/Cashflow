import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AuthFooter = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        By continuing you accept our {' '}
        <Text style={styles.link}>Terms of Service</Text> and {' '}
        <Text style={styles.link}>Privacy Policy</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    color: '#bbbbbb',
    fontSize: 12,
    textAlign: 'center',
  },
  link: {
    color: '#3B82F6',
  },
});

export default AuthFooter;
