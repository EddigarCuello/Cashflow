import React, { useState } from "react";
import { View, StyleSheet, Alert, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { registro } from "../Logic/Auth_Service";

const RegisterScreen = () => {
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
    <View style={styles.container}>
      <View style={styles.inputGrid}>
        <InputField label="Nombre" placeholder="Ingresa tu nombre" onChangeText={value => handleChange("nombre", value)} />
        <InputField label="Apellido" placeholder="Ingresa tu apellido" onChangeText={value => handleChange("apellido", value)} />
        <InputField label="Número de teléfono" placeholder="Ingresa tu número de teléfono" keyboardType="phone-pad" onChangeText={value => handleChange("telefono", value)} />

        {/* Campo de fecha con botón */}
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

        <InputField label="Número de cedula" placeholder="Ingresa tu número de cedula" keyboardType="numeric" onChangeText={value => handleChange("cedula", value)} />
        <InputField label="Correo" placeholder="Ingresa tu correo" onChangeText={value => handleChange("correo", value)} />
        <InputField label="Contraseña" placeholder="Ingresa el pin o contraseña" secureTextEntry onChangeText={value => handleChange("password", value)} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Register" filled onPress={handleRegister} style={styles.registerButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20
  },
  inputGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%"
  },
  dateInput: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fff"
  },
  dateText: {
    color: "#000",
    fontSize: 16
  },
  datePlaceholder: {
    color: "#999",
    fontSize: 16
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    alignItems: "center",
    marginTop: 10
  },
  registerButton: {
    width: "90%",
    paddingVertical: 15
  }
});

export default RegisterScreen;
