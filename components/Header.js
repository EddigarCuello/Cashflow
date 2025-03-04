import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import bannerImage from '../assets/banner2.png';

const Header = () => {
  return (
    <View style={styles.container}>
      <Image source={bannerImage} style={styles.image} />
      <Text style={styles.title}>Cashflow{''}</Text>
      <Text style={styles.subtitle}>
      Cashflow es una poderosa herramienta que le permite calcular y observar tus prestamos de una forma rapida y sencilla 
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 50,
  },
  image: {
    width: 300,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#bbbbbb',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default Header;