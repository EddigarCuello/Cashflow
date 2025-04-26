import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Text, TouchableOpacity, Platform, ScrollView, TextInput, KeyboardAvoidingView, Dimensions, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { LinearGradient } from 'expo-linear-gradient';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from "@react-navigation/native";
import { JSONStorageService } from "../Logic/JSON_Storage_Service";

const { width } = Dimensions.get('window');

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    fecha_nacimiento: "",
    cedula: "",
    correo: "",
    password: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    isAdmin: false,
    adminPassword: "",
    hasBiometricEnabled: false
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnrolled, setIsBiometricEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  // Animaciones
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    checkBiometricSupport();

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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleChange('fecha_nacimiento', formattedDate);
    }
  };

  const validarDatos = () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu nombre');
      return false;
    }
    if (!formData.apellido.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu apellido');
      return false;
    }
    if (!formData.cedula.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu cédula');
      return false;
    }
    if (!/^\d+$/.test(formData.cedula)) {
      Alert.alert('Error', 'La cédula debe contener solo números');
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Por favor ingresa una contraseña');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleBiometricRegistration = async () => {
    if (!validarDatos()) {
      Alert.alert(
        'Error',
        'Por favor completa todos los campos correctamente antes de registrar la huella dactilar'
      );
      return;
    }

    setIsLoading(true);
    try {
      // Verificar si el usuario ya existe
      const existingUser = await JSONStorageService.findUserByCedula(formData.cedula);
      if (existingUser) {
        Alert.alert("Error", "Ya existe un usuario con esta cédula");
        return;
      }

      // Crear nuevo usuario
      const newUser = {
        cedula: formData.cedula,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono,
        fecha_nacimiento: formData.fecha_nacimiento,
        correo: formData.correo,
        password: formData.password,
        isAdmin: formData.isAdmin,
        hasBiometricEnabled: true
      };

      // Guardar usuario
      const userSaved = await JSONStorageService.saveUser(newUser);
      if (!userSaved) {
        throw new Error('Error al guardar el usuario');
      }

      // Establecer saldo inicial
      const balanceSaved = await JSONStorageService.saveUserBalance(formData.cedula, 20000);
      if (!balanceSaved) {
        throw new Error('Error al establecer el saldo inicial');
      }

      // Mostrar pantalla de registro de huella
      Alert.alert(
        "Registro de Huella",
        "¿Desea registrar su huella dactilar ahora?",
        [
          {
            text: "No, más tarde",
            style: "cancel",
            onPress: () => {
              Alert.alert(
                "Éxito",
                "Usuario registrado correctamente. Puede registrar su huella más tarde.",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.navigate("LoginScreen"),
                  },
                ]
              );
              setIsLoading(false);
            }
          },
          {
            text: "Sí, registrar ahora",
            onPress: async () => {
              try {
                // Verificar si hay huellas registradas
                const enrolled = await LocalAuthentication.isEnrolledAsync();
                if (!enrolled) {
                  Alert.alert(
                    "Error",
                    "No hay huellas registradas en el dispositivo. Por favor, registre una huella en la configuración del dispositivo primero.",
                    [
                      {
                        text: "OK",
                        onPress: () => navigation.navigate("LoginScreen"),
                      },
                    ]
                  );
                  return;
                }

                // Solicitar autenticación biométrica
                const result = await LocalAuthentication.authenticateAsync({
                  promptMessage: 'Registro de huella dactilar',
                  fallbackLabel: 'Cancelar',
                  disableDeviceFallback: true
                });

                if (result.success) {
                  // Guardar credenciales biométricas
                  const biometricSaved = await JSONStorageService.saveBiometricCredentials(
                    formData.cedula,
                    formData.password
                  );

                  if (!biometricSaved) {
                    throw new Error('Error al guardar las credenciales biométricas');
                  }

                  // Actualizar estado local
                  handleChange('hasBiometricEnabled', true);

                  Alert.alert(
                    "Éxito",
                    "Huella dactilar registrada correctamente",
                    [
                      {
                        text: "OK",
                        onPress: () => navigation.navigate("LoginScreen"),
                      },
                    ]
                  );
                } else {
                  Alert.alert("Error", "No se pudo registrar la huella dactilar");
                }
              } catch (error) {
                console.error("Error en registro de huella:", error);
                Alert.alert("Error", "Ocurrió un error al registrar la huella dactilar: " + error.message);
              } finally {
                setIsLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error("Error en registro:", error);
      Alert.alert("Error", "Ocurrió un error al registrar el usuario: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1B1D2A', '#2A2D3E']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Ionicons name="person-add" size={80} color="#E5A442" />
              <Text style={styles.title}>Crear Cuenta</Text>
              <Text style={styles.subtitle}>Únete a nuestra comunidad</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color="#E5A442" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  placeholderTextColor="#666"
                  value={formData.nombre}
                  onChangeText={(value) => handleChange('nombre', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color="#E5A442" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Apellido"
                  placeholderTextColor="#666"
                  value={formData.apellido}
                  onChangeText={(value) => handleChange('apellido', value)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={24} color="#E5A442" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Teléfono"
                  placeholderTextColor="#666"
                  value={formData.telefono}
                  onChangeText={(value) => handleChange('telefono', value)}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={24} color="#E5A442" style={styles.inputIcon} />
                <Text style={[styles.input, !formData.fecha_nacimiento && styles.placeholderText]}>
                  {formData.fecha_nacimiento || "Fecha de nacimiento"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.fecha_nacimiento ? new Date(formData.fecha_nacimiento) : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

              <View style={styles.inputContainer}>
                <Ionicons name="card-outline" size={24} color="#E5A442" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Cédula"
                  placeholderTextColor="#666"
                  value={formData.cedula}
                  onChangeText={(value) => handleChange('cedula', value)}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="#E5A442" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#666"
                  value={formData.correo}
                  onChangeText={(value) => handleChange('correo', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="#E5A442" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#666"
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry={!formData.showPassword}
                />
                <TouchableOpacity
                  onPress={() => handleChange('showPassword', !formData.showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={formData.showPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="#E5A442"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="#E5A442" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar contraseña"
                  placeholderTextColor="#666"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleChange('confirmPassword', value)}
                  secureTextEntry={!formData.showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => handleChange('showConfirmPassword', !formData.showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={formData.showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="#E5A442"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.roleContainer}>
                <Text style={styles.roleTitle}>Tipo de cuenta:</Text>
                <View style={styles.roleOptions}>
                  <TouchableOpacity
                    style={[styles.roleOption, !formData.isAdmin && styles.roleOptionSelected]}
                    onPress={() => handleChange('isAdmin', false)}
                  >
                    <Ionicons
                      name="person-outline" 
                      size={24}
                      color={!formData.isAdmin ? "#FFFFFF" : "#E5A442"} 
                    />
                    <Text style={[styles.roleText, !formData.isAdmin && styles.roleTextSelected]}>
                      Cliente
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roleOption, formData.isAdmin && styles.roleOptionSelected]}
                    onPress={() => handleChange('isAdmin', true)}
                  >
                    <Ionicons 
                      name="shield-outline" 
                      size={24} 
                      color={formData.isAdmin ? "#FFFFFF" : "#E5A442"} 
                    />
                    <Text style={[styles.roleText, formData.isAdmin && styles.roleTextSelected]}>
                      Administrador
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {formData.isAdmin && (
                <View style={styles.inputContainer}>
                  <Ionicons name="key-outline" size={24} color="#E5A442" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Contraseña de administrador"
                    placeholderTextColor="#666"
                    value={formData.adminPassword}
                    onChangeText={(value) => handleChange('adminPassword', value)}
                    secureTextEntry
                  />
                </View>
              )}

              {!formData.hasBiometricEnabled && (
                <TouchableOpacity 
                  style={[
                    styles.biometricButton,
                    (!formData.nombre || !formData.apellido || !formData.cedula || !formData.password || !formData.confirmPassword) && 
                    styles.biometricButtonDisabled
                  ]}
                  onPress={handleBiometricRegistration}
                  disabled={!formData.nombre || !formData.apellido || !formData.cedula || !formData.password || !formData.confirmPassword}
                  activeOpacity={0.8}
                >
                  <Ionicons name="finger-print-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.biometricButtonText}>Registrar huella dactilar</Text>
                </TouchableOpacity>
              )}

              {formData.hasBiometricEnabled && (
                <View style={styles.biometricSuccess}>
                  <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                  <Text style={styles.biometricSuccessText}>Huella dactilar registrada</Text>
                </View>
              )}

              <View style={styles.buttonContainer}>
                <Button 
                  title={isLoading ? "Registrando..." : "Registrarse"} 
                  filled 
                  onPress={handleBiometricRegistration} 
                  style={styles.registerButton}
                  disabled={isLoading}
                />
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                  <Text style={styles.loginLink}>Inicia Sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5A442',
    marginTop: 5,
  },
  formContainer: {
    width: width * 0.9,
    maxWidth: 400,
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
  placeholderText: {
    color: '#666',
  },
  eyeIcon: {
    padding: 10,
  },
  roleContainer: {
    marginBottom: 15,
  },
  roleTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 10,
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  roleOptionSelected: {
    backgroundColor: '#E5A442',
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  roleTextSelected: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  registerButton: {
    width: "100%",
    paddingVertical: 15,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  loginLink: {
    color: '#E5A442',
    fontSize: 14,
    fontWeight: 'bold',
  },
  biometricButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(229, 164, 66, 0.2)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  biometricButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
  },
  biometricSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  biometricSuccessText: {
    color: '#4CAF50',
    fontSize: 16,
    marginLeft: 10,
  },
  biometricButtonDisabled: {
    opacity: 0.5,
  },
});

export default RegisterScreen;