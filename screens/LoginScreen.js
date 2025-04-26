import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { login, loginWithBiometric, hasBiometricCredentials, mostrarUsuarios, eliminarTodosLosUsuarios } from '../Logic/Auth_Service';
import { JSONStorageService } from '../Logic/JSON_Storage_Service';
import { BalanceService } from '../Logic/Balance_Service';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    checkBiometricSupport();
    initializeJSONStorage();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const initializeJSONStorage = async () => {
    await JSONStorageService.initializeJSON();
  };

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsBiometricEnrolled(enrolled);
      }
    } catch (error) {
      console.error("Error checking biometric support:", error);
    }
  };

  const handleLogin = async () => {
    if (!cedula || !password) {
      Alert.alert("Error", "Por favor ingrese cédula y contraseña");
      return;
    }

    try {
      const user = await JSONStorageService.findUserByCedula(cedula);
      if (user && user.password === password) {
        await JSONStorageService.setCurrentUser(user);
        const isAdmin = await JSONStorageService.isUserAdmin(cedula);
        navigation.replace(isAdmin ? "Admin" : "Home", { 
          user,
          balance: await JSONStorageService.getUserBalance(cedula)
        });
      } else {
        Alert.alert("Error", "Cédula o contraseña incorrectos");
      }
    } catch (error) {
      console.error('Error en login:', error);
      Alert.alert("Error", "Ocurrió un error al iniciar sesión");
    }
  };

  const handleBiometricLogin = async () => {
    setIsLoading(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación biométrica',
        fallbackLabel: 'Usar contraseña',
        disableDeviceFallback: true
      });

      if (result.success) {
        const credentials = await JSONStorageService.getBiometricCredentials();
        
        if (!credentials) {
          Alert.alert('Error', 'No hay credenciales biométricas registradas');
          return;
        }
        
        const user = await JSONStorageService.findUserByCedula(credentials.cedula);
        
        if (!user) {
          Alert.alert('Error', 'Usuario no encontrado');
          return;
        }
        
        await JSONStorageService.setCurrentUser(user);
        
        const saldoActual = await JSONStorageService.getUserBalance(credentials.cedula);
        
        if (saldoActual === null || saldoActual === undefined) {
          await JSONStorageService.saveUserBalance(credentials.cedula, 20000);
        }

        const isAdmin = await JSONStorageService.isUserAdmin(credentials.cedula);
        navigation.replace(isAdmin ? "Admin" : "Home", { 
          user, 
          balance: saldoActual || 20000 
        });
      } else {
        Alert.alert('Error', 'Autenticación biométrica fallida');
      }
    } catch (error) {
      console.error('Error en login biométrico:', error);
      Alert.alert('Error', 'Ocurrió un error en la autenticación biométrica');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUsers = async () => {
    try {
      const result = await JSONStorageService.deleteAllUsers();
      if (result) {
        Alert.alert('Éxito', 'Todos los usuarios han sido eliminados correctamente');
      } else {
        Alert.alert('Error', 'No se pudieron eliminar los usuarios');
      }
    } catch (error) {
      console.error('Error al eliminar usuarios:', error);
      Alert.alert('Error', 'Ocurrió un error al eliminar los usuarios');
    }
  };

  const handleShowUsers = async () => {
    try {
      const allUsers = await JSONStorageService.getAllUsers();
      console.log('=== DETALLE COMPLETO DE USUARIOS REGISTRADOS ===');
      console.log('Total de usuarios:', allUsers.length);
      console.log('----------------------------------------');
      allUsers.forEach((user, index) => {
        console.log(`Usuario #${index + 1}:`);
        console.log('Datos completos del usuario:');
        console.log(JSON.stringify(user, null, 2));
        console.log('----------------------------------------');
      });
      console.log('========================================');
      
      // También mostrar en una alerta para confirmar
      let usersMessage = '=== USUARIOS REGISTRADOS ===\n\n';
      allUsers.forEach((user, index) => {
        usersMessage += `${index + 1}. ${user.nombre} ${user.apellido} (Cédula: ${user.cedula})\n`;
      });
      usersMessage += '\n===========================\n\nRevisa la consola para ver más detalles.';
      
      Alert.alert('Usuarios Registrados', usersMessage);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      Alert.alert('Error', 'No se pudieron obtener los usuarios');
    }
  };

  return (
    <LinearGradient
      colors={['#1B1D2A', '#2A2D3E']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.title}>¡Bienvenido de nuevo!</Text>
            <Text style={styles.subtitle}>Ingresa a tu cuenta</Text>
          </View>

          <View style={styles.inputsContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="card-outline" size={24} color="#E5A442" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Número de cédula"
                placeholderTextColor="#666"
                value={cedula}
                onChangeText={setCedula}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={24} color="#E5A442" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={24} 
                  color="#E5A442" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('RecoveryScreen')}
              style={styles.forgotPassword}
            >
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>

            {isBiometricSupported && isBiometricEnrolled && (
              <TouchableOpacity 
                style={styles.biometricButton}
                onPress={handleBiometricLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Ionicons name="finger-print-outline" size={24} color="#FFFFFF" />
                <Text style={styles.biometricButtonText}>
                  {isLoading ? 'Autenticando...' : 'Iniciar sesión con huella'}
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>O</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
                <Text style={styles.registerLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5A442',
    marginBottom: 20,
  },
  inputsContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    paddingVertical: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#E5A442',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#E5A442',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  biometricButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(229, 164, 66, 0.2)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  biometricButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    color: '#FFFFFF',
    marginHorizontal: 10,
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  registerLink: {
    color: '#E5A442',
    fontSize: 14,
    fontWeight: 'bold',
  },
  adminButton: {
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  adminButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;