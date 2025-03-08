import React from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import AuthFooter from '../components/AuthFooter';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

const AuthScreen = () => {
  const navigation = useNavigation(); // Obtén el objeto de navegación

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.authContainer}>
        <Button
          title="Sign up"
          filled
          onPress={() => navigation.navigate('RegisterScreen')} // Navega a RegisterScreen
        />
        <Button
          title="Log in"
          onPress={() => navigation.navigate('LoginScreen')} // Navega a LoginScreen
        />
        <AuthFooter />
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
  authContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default AuthScreen;