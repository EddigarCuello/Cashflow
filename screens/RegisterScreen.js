import React, { useState } from "react";
import { View, StyleSheet, Alert, Text, TouchableOpacity, Platform, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { registro } from "../Logic/Auth_Service";

const RegisterScreen = ({ navigation }) => {
  const [persona, setPersona] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    fecha_nacimiento: "",
    cedula: "",
    correo: "",
    password: ""
  });

  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (field, value) => {
    setPersona({ ...persona, [field]: value.trim() });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // AAAA-MM-DD
      setPersona({ ...persona, fecha_nacimiento: formattedDate });
    }
  };

  const validarDatos = () => {
    let { nombre, apellido, telefono, fecha_nacimiento, cedula, correo, password } = persona;

    if (!nombre || !apellido || !telefono || !fecha_nacimiento || !cedula || !correo || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return false;
    }

    if (!/^\d+$/.test(telefono) || telefono.length < 7) {
      Alert.alert("Error", "El teléfono debe ser un número válido.");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(correo)) {
      Alert.alert("Error", "Correo inválido.");
      return false;
    }

    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres.");
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validarDatos()) return;

    console.log("Valores ingresados:", persona);
    try {
      await registro(persona);
      Alert.alert("Éxito", "Registro exitoso.");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema con el registro.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Botón de regreso */}
        <Ionicons
          name="arrow-back"
          size={30}
          color="white"
          style={styles.backButton}
          onPress={() => navigation.navigate("AuthScreen")}
        />

        <View style={styles.inputContainer}>
          <InputField label="Nombre" placeholder="Ingresa tu nombre" onChangeText={value => handleChange("nombre", value)} />
          <InputField label="Apellido" placeholder="Ingresa tu apellido" onChangeText={value => handleChange("apellido", value)} />
          <InputField label="Número de teléfono" placeholder="Ingresa tu número de teléfono" keyboardType="phone-pad" onChangeText={value => handleChange("telefono", value)} />

          {/* Campo de fecha con título */}
          <Text style={styles.label}>Fecha de nacimiento</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowPicker(true)}>
            <Text style={persona.fecha_nacimiento ? styles.dateText : styles.datePlaceholder}>
              {persona.fecha_nacimiento ? persona.fecha_nacimiento : "Selecciona tu fecha de nacimiento"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={persona.fecha_nacimiento ? new Date(persona.fecha_nacimiento) : new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          )}

          <InputField label="Número de cédula" placeholder="Ingresa tu número de cédula" keyboardType="numeric" onChangeText={value => handleChange("cedula", value)} />
          <InputField label="Correo" placeholder="Ingresa tu correo" onChangeText={value => handleChange("correo", value)} />
          <InputField label="Contraseña" placeholder="Ingresa el pin o contraseña" secureTextEntry onChangeText={value => handleChange("password", value)} />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Registrarse" filled onPress={handleRegister} style={styles.registerButton} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  inputContainer: {
    width: "100%",
    marginTop: 20,
  },
  label: {
    color: "#fff", // Color del texto del título
    fontSize: 16,
    marginBottom: 8, // Espacio entre el título y el campo de fecha
  },
  dateInput: {
    width: "90%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#000000",
  },
  dateText: {
    color: "#fff", // Color del texto cuando hay una fecha seleccionada
    fontSize: 16,
  },
  datePlaceholder: {
    color: "#999", // Color del texto del placeholder
    fontSize: 16,
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
});

export default RegisterScreen;