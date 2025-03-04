import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import AuthFooter from '../components/AuthFooter';
import RegisterScreen from './RegisterScreen';
import LoginScreen from './LoginScreen';

const AuthScreen = () => {
  const [screen, setScreen] = useState('auth');

  return (
    <View style={styles.container}>
      {screen === 'auth' && <Header />}
      {screen === 'register' ? (
        <RegisterScreen />
      ) : screen === 'login' ? (
        <LoginScreen />
      ) : (
        <View style={styles.authContainer}>
          <Button title="Sign up" filled onPress={() => setScreen('register')} />
          <Button title="Log in" onPress={() => setScreen('login')} />
          <AuthFooter />
        </View>
      )}
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
  authContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default AuthScreen;