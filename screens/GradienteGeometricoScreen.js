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
import { calcularGradienteGeometrico, calcularPago } from "../Logic/GradienteGeometrico";

const GradienteGeometricoScreen = () => {
  const [activeTab, setActiveTab] = useState(0);

  // Definir íconos para cada pestaña
  const tabIcons = ["info", "functions", "calculate"]; // Íconos para Conceptos, Fórmulas y Cálculos

  // Contenido de las pestañas
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <InfoSection />;
      case 1:
        return <FormulasSection />;
      case 2:
        return <CalculationSection />;
      default:
        return <InfoSection />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Contenido de la pestaña actual */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {renderTabContent()}
      </ScrollView>

      {/* Navegación entre pestañas con íconos */}
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
    <Text style={styles.title}>¿Qué es el Gradiente Geométrico?</Text>
    <Text style={styles.text}>
      El gradiente geométrico es una serie de pagos periódicos que aumentan o
      disminuyen en una proporción constante (en lugar de una cantidad fija).
      Es útil para modelar situaciones donde los flujos de efectivo crecen o
      decrecen exponencialmente, como inversiones con rendimientos crecientes
      o costos que aumentan con el tiempo.
    </Text>
  </View>
);

// Sección 2: Fórmulas
const FormulasSection = () => (
  <View style={styles.section}>
    <Text style={styles.title}>Fórmulas del Gradiente Geométrico</Text>
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
const CalculationSection = () => {
  const [calculo, setCalculo] = useState("Vf"); // Alternar entre "Vf" y "P"
  const [A, setA] = useState("");
  const [i, setI] = useState("");
  const [n, setN] = useState("");
  const [G, setG] = useState("");
  const [C, setC] = useState("");
  const [resultado, setResultado] = useState("");

  const handleCalcular = () => {
    if (!A || !i || !n || !G || (calculo === "Vf" && !C)) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      let resultadoCalculo;
      if (calculo === "Vf") {
        resultadoCalculo = calcularGradienteGeometrico(
          parseFloat(A),
          parseFloat(i),
          parseInt(n),
          parseFloat(G),
          parseFloat(C)
        );
      } else {
        resultadoCalculo = calcularPago(
          parseFloat(A),
          parseFloat(i),
          parseInt(n),
          parseFloat(G)
        );
      }
      setResultado(resultadoCalculo.toFixed(6));
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error en el cálculo.");
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Calculadora</Text>

      {/* Selector para alternar entre Vf y P */}
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            calculo === "Vf" && styles.activeSelector,
          ]}
          onPress={() => setCalculo("Vf")}
        >
          <Text
            style={[
              styles.selectorText,
              calculo === "Vf" && styles.activeSelectorText,
            ]}
          >
            Calcular Vf
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectorButton,
            calculo === "P" && styles.activeSelector,
          ]}
          onPress={() => setCalculo("P")}
        >
          <Text
            style={[
              styles.selectorText,
              calculo === "P" && styles.activeSelectorText,
            ]}
          >
            Calcular P
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inputs dinámicos */}
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
      {calculo === "Vf" && (
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
        <Text style={styles.result}>
          {calculo === "Vf" ? "Valor Futuro" : "Pago"}: {resultado}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1B1D2A" },
  contentContainer: { padding: 20, paddingBottom: 80, marginTop: 30 },
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
  section: { marginBottom: 30 },
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
  },
  input: {
    backgroundColor: "#2A2D3E",
    color: "#FFF",
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5A442",
  },
  button: {
    backgroundColor: "#E5A442",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  result: { color: "#FFD700", fontSize: 18, marginTop: 20, textAlign: "center" },
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
});

export default GradienteGeometricoScreen;