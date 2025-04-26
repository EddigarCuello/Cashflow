import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JSONStorageService } from '../Logic/JSON_Storage_Service';

const ConsignarScreen = ({ navigation, route }) => {
  const [monto, setMonto] = useState('');
  const [balance, setBalance] = useState(0);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (route.params?.balance) {
      setBalance(route.params.balance);
    }
    if (route.params?.user) {
      setUsuario(route.params.user);
    }
  }, [route.params]);

  const handleConsignar = async () => {
    if (!monto || isNaN(monto) || parseFloat(monto) <= 0) {
      Alert.alert('Error', 'Por favor ingrese un monto válido');
      return;
    }

    try {
      const montoNumerico = parseFloat(monto);
      const nuevoBalance = balance + montoNumerico;
      
      // Actualizar el balance en el servicio
      await JSONStorageService.saveUserBalance(usuario.cedula, nuevoBalance);
      
      // Actualizar el balance local
      setBalance(nuevoBalance);
      
      Alert.alert(
        'Éxito',
        `Consignación exitosa. Nuevo balance: $${nuevoBalance.toLocaleString()}`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Actualizar el balance en la pantalla anterior
              navigation.navigate('Home', { 
                balance: nuevoBalance,
                user: usuario
              });
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error al consignar:', error);
      Alert.alert('Error', 'Ocurrió un error al procesar la consignación');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#E5A442" />
          </TouchableOpacity>
          <Text style={styles.title}>Consignar</Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Balance Actual:</Text>
          <Text style={styles.balanceAmount}>${balance.toLocaleString()}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Monto a Consignar</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese el monto"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={monto}
            onChangeText={setMonto}
          />
        </View>

        <TouchableOpacity
          style={styles.consignarButton}
          onPress={handleConsignar}
        >
          <Text style={styles.consignarButtonText}>Consignar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1D2A',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E5A442',
  },
  balanceContainer: {
    backgroundColor: '#2A2D3E',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E5A442',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#2A2D3E',
    borderRadius: 10,
    padding: 15,
    color: '#FFF',
    fontSize: 16,
  },
  consignarButton: {
    backgroundColor: '#E5A442',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  consignarButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConsignarScreen; 