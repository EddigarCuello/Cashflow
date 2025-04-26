import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { calcularGradienteAritmetico } from "../Logic/GradienteAritmetico";
import { calcularGradienteGeometrico, calcularPago } from "../Logic/GradienteGeometrico";
import { Picker } from '@react-native-picker/picker';
import { JSONStorageService } from "../Logic/JSON_Storage_Service";

const GradienteScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tipoGradiente, setTipoGradiente] = useState("aritmetico");
  const [calculo, setCalculo] = useState("Vf");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const tabIcons = ["info", "functions", "calculate"];

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <InfoSection />;
      case 1:
        return <FormulasSection />;
      case 2:
        return (
          <CalculationSection
            tipoGradiente={tipoGradiente}
            calculo={calculo}
            setCalculo={setCalculo}
            setTipoGradiente={setTipoGradiente}
          />
        );
      default:
        return <InfoSection />;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderTabContent()}
      </ScrollView>

      <View style={styles.tabContainer}>
        {["Conceptos", "Fórmulas", "Cálculos"].map((title, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tabButton, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <Icon
              name={tabIcons[index]}
              size={24}
              color={activeTab === index ? "#E5A442" : "#FFF"}
              style={styles.icon}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === index && styles.activeTabText,
              ]}
            >
              {title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Sección 1: Conceptos
const InfoSection = () => (
  <View style={styles.section}>
    <Text style={styles.title}>¿Qué son los Gradientes?</Text>
    
    <Text style={styles.subtitle}>Gradiente Aritmético</Text>
    <Text style={styles.text}>
      El gradiente aritmético es una serie de pagos periódicos que aumentan o disminuyen en una cantidad fija en cada período. Es útil para modelar situaciones donde los flujos de efectivo cambian de manera constante, como incrementos salariales anuales o pagos de préstamos con ajustes periódicos.
    </Text>

    <Text style={styles.subtitle}>Gradiente Geométrico</Text>
    <Text style={styles.text}>
      El gradiente geométrico es una serie de pagos periódicos que aumentan o disminuyen en una proporción constante (en lugar de una cantidad fija). Es útil para modelar situaciones donde los flujos de efectivo crecen o decrecen exponencialmente, como inversiones con rendimientos crecientes o costos que aumentan con el tiempo.
    </Text>
  </View>
);

// Sección 2: Fórmulas
const FormulasSection = () => (
  <View style={styles.section}>
    <Text style={styles.title}>Fórmulas de los Gradientes</Text>
    
    <Text style={styles.subtitle}>Gradiente Aritmético</Text>
    <Text style={styles.formula}>
      Vp = A × [(1 - (1 + i)^-n) / i] + (G / i) × [(1 - (1 + i)^-n) / i - n / (1 + i)^n]
    </Text>

    <Text style={styles.subtitle}>Gradiente Geométrico</Text>
    <Text style={styles.formula}>
      Para calcular el Valor Futuro (Vf): {"\n"}
      Vf = [A × ((1 + G)^n × (1 + i)^n)] / (G - i) × C
    </Text>
    <Text style={styles.formula}>
      Para calcular el Pago (P): {"\n"}
      P = A × [(1 - ((1 + G) / (1 + i))^n) / (i - G)]
    </Text>
  </View>
);

// Sección 3: Cálculos
const CalculationSection = ({ tipoGradiente, calculo, setCalculo, setTipoGradiente }) => {
  const [A, setA] = useState("");
  const [i, setI] = useState("");
  const [n, setN] = useState("");
  const [G, setG] = useState("");
  const [C, setC] = useState("");
  const [resultado, setResultado] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCalcular = () => {
    // Validar que los campos requeridos no estén vacíos
    if (!A || !i || !n || !G || (tipoGradiente === "geometrico" && calculo === "Vf" && !C)) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      // Convertir valores a números, usando null si están vacíos
      const ANum = A === "" ? null : parseFloat(A);
      const iNum = i === "" ? null : parseFloat(i);
      const nNum = n === "" ? null : parseInt(n);
      const GNum = G === "" ? null : parseFloat(G);
      const CNum = C === "" ? null : parseFloat(C);

      let resultadoCalculo;
      if (tipoGradiente === "aritmetico") {
        resultadoCalculo = calcularGradienteAritmetico(
          ANum,
          iNum,
          nNum,
          GNum
        );
      } else {
        if (calculo === "Vf") {
          resultadoCalculo = calcularGradienteGeometrico(
            ANum,
            iNum,
            nNum,
            GNum,
            CNum
          );
        } else {
          resultadoCalculo = calcularPago(
            ANum,
            iNum,
            nNum,
            GNum
          );
        }
      }

      if (resultadoCalculo === null || isNaN(resultadoCalculo)) {
        Alert.alert("Error", "No se pudo calcular el resultado. Verifica los valores ingresados.");
        return;
      }

      setResultado(resultadoCalculo.toFixed(6));
      setShowConfirmation(true);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error en el cálculo: " + error.message);
    }
  };

  const handleResponse = async (response) => {
    if (response === "si") {
      try {
        const currentUser = await JSONStorageService.getCurrentUser();
        if (!currentUser) {
          Alert.alert("Error", "No hay usuario actual");
          return;
        }

        // Crear objeto de préstamo simplificado
        const loanData = {
          tipo: `Gradiente ${tipoGradiente.charAt(0).toUpperCase() + tipoGradiente.slice(1)}`,
          total: parseFloat(resultado),
          fechaCreacion: new Date().toISOString(),
          estado: 'por_aprobar'
        };

        // Guardar el préstamo
        const saved = await JSONStorageService.saveLoan(currentUser.cedula, loanData);
        if (saved) {
          Alert.alert("Éxito", "Préstamo guardado correctamente");
        } else {
          Alert.alert("Error", "No se pudo guardar el préstamo");
        }
      } catch (error) {
        console.error('Error al guardar préstamo:', error);
        Alert.alert("Error", "Ocurrió un error al guardar el préstamo");
      }
    } else {
      Alert.alert("Cancelado", "Préstamo cancelado.");
    }
    setShowConfirmation(false);
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Calculadora</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Tipo de Gradiente:</Text>
        <Picker
          selectedValue={tipoGradiente}
          onValueChange={(itemValue) => setTipoGradiente(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Aritmético" value="aritmetico" />
          <Picker.Item label="Geométrico" value="geometrico" />
        </Picker>
      </View>

      {tipoGradiente === "geometrico" && (
        <View style={styles.selectorContainer}>
          <TouchableOpacity
            style={[styles.selectorButton, calculo === "Vf" && styles.activeSelector]}
            onPress={() => setCalculo("Vf")}
          >
            <Text style={[styles.selectorText, calculo === "Vf" && styles.activeSelectorText]}>
              Calcular Vf
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectorButton, calculo === "P" && styles.activeSelector]}
            onPress={() => setCalculo("P")}
          >
            <Text style={[styles.selectorText, calculo === "P" && styles.activeSelectorText]}>
              Calcular P
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Primer Pago (A)"
        keyboardType="numeric"
        value={A}
        onChangeText={setA}
      />
      <TextInput
        style={styles.input}
        placeholder="Tasa de Interés (i)"
        keyboardType="numeric"
        value={i}
        onChangeText={setI}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de Períodos (n)"
        keyboardType="numeric"
        value={n}
        onChangeText={setN}
      />
      <TextInput
        style={styles.input}
        placeholder="Tasa de Crecimiento del Gradiente (G)"
        keyboardType="numeric"
        value={G}
        onChangeText={setG}
      />
      {tipoGradiente === "geometrico" && calculo === "Vf" && (
        <TextInput
          style={styles.input}
          placeholder="Factor de Conversión (C)"
          keyboardType="numeric"
          value={C}
          onChangeText={setC}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleCalcular}>
        <Text style={styles.buttonText}>Calcular</Text>
      </TouchableOpacity>
      {resultado !== "" && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {tipoGradiente === "aritmetico"
              ? "Valor Presente"
              : calculo === "Vf"
              ? "Valor Futuro"
              : "Pago"}: {resultado}
          </Text>
          {showConfirmation && (
            <View style={styles.confirmationButtons}>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.confirmButton]}
                onPress={() => handleResponse("si")}
              >
                <Text style={styles.confirmationButtonText}>Realizar Préstamo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={() => handleResponse("no")}
              >
                <Text style={styles.confirmationButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1B1D2A" },
  contentContainer: { padding: 20, paddingBottom: 100 },
  tabContainer: {
    position: "absolute",
    bottom: 2,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2A2D3E",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#444",
  },
  tabButton: { alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#E5A442" },
  tabText: { color: "#FFF", fontSize: 14, marginTop: 5 },
  activeTabText: { color: "#E5A442", fontWeight: "bold" },
  icon: { marginBottom: 5 },
  section: { marginBottom: 30, paddingBottom: 50 },
  title: { color: "#FFD700", fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  text: { color: "#FFF", fontSize: 16, lineHeight: 22 },
  formula: {
    color: "#FFF",
    fontSize: 16,
    backgroundColor: "#2A2D3E",
    padding: 15,
    borderRadius: 8,
    fontFamily: "monospace",
    borderWidth: 1,
    borderColor: "#E5A442",
    marginBottom: 10,
  },
  pickerContainer: {
    marginBottom: 15,
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5A442",
    overflow: 'hidden',
  },
  pickerLabel: {
    color: "#FFF",
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: "#2A2D3E",
  },
  picker: {
    color: "#FFF",
    height: 50,
    width: "100%",
    backgroundColor: "#2A2D3E",
  },
  input: {
    backgroundColor: "#2A2D3E",
    color: "#FFF",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5A442",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#E5A442",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2A2D3E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5A442',
  },
  resultText: {
    color: '#FFF',
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  confirmationButton: {
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  confirmationButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectorContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  selectorButton: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#2A2D3E",
    borderWidth: 1,
    borderColor: "#E5A442",
  },
  activeSelector: { backgroundColor: "#E5A442" },
  selectorText: { color: "#FFF", fontSize: 16 },
  activeSelectorText: { color: "#1B1D2A", fontWeight: "bold" },
  subtitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10
  },
});

export default GradienteScreen; 