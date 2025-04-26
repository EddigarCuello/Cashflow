import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { calcularCapitalizacion } from "../Logic/Capitalizacion";
import { JSONStorageService } from "../Logic/JSON_Storage_Service";

const CapitalizacionScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabIcons = ["info", "functions", "calculate"];

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
              style={[styles.tabText, activeTab === index && styles.activeTabText]}
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
    <Text style={styles.title}>Sistemas de Capitalización</Text>
    
    <Text style={styles.subtitle}>Capitalización Simple</Text>
    <Text style={styles.text}>
      En este sistema, los intereses se calculan siempre sobre el capital inicial. Los intereses generados no se acumulan al capital para generar nuevos intereses.
    </Text>

    <Text style={styles.subtitle}>Capitalización Compuesta</Text>
    <Text style={styles.text}>
      Los intereses se calculan sobre el capital inicial más los intereses acumulados. Los intereses generados se reinvierten y generan nuevos intereses.
    </Text>

    <Text style={styles.subtitle}>Capitalización Continua</Text>
    <Text style={styles.text}>
      En este sistema, la capitalización ocurre en todo momento de manera ininterrumpida. Los intereses se calculan y reinvierten continuamente.
    </Text>

    <Text style={styles.subtitle}>Capitalización Periódica</Text>
    <Text style={styles.text}>
      Se capitaliza en intervalos regulares por lo que la tasa de interés efectiva depende de la frecuencia de capitalización.
    </Text>

    <Text style={styles.subtitle}>Capitalización Anticipada</Text>
    <Text style={styles.text}>
      Los intereses se aplican al inicio del período en lugar de al final. Se usa en pagos adelantados y rentas.
    </Text>

    <Text style={styles.subtitle}>Capitalización Diferida</Text>
    <Text style={styles.text}>
      Los intereses comienzan a acumularse después de un período de gracia, lo que significa que hay un tiempo de espera antes de que el capital empiece a generar intereses.
    </Text>
  </View>
);

// Sección 2: Fórmulas
const FormulasSection = () => (
  <View style={styles.section}>
    <Text style={styles.title}>Fórmulas de Capitalización</Text>
    
    <Text style={styles.subtitle}>Capitalización Simple</Text>
    <Text style={styles.formula}>
      M = C × (1 + r × t)
    </Text>

    <Text style={styles.subtitle}>Capitalización Compuesta</Text>
    <Text style={styles.formula}>
      M = C × (1 + r)^t
    </Text>

    <Text style={styles.subtitle}>Capitalización Continua</Text>
    <Text style={styles.formula}>
      M = C × e^(r×t)
    </Text>
    <Text style={styles.text}>Donde e es la base del logaritmo natural</Text>

    <Text style={styles.subtitle}>Capitalización Periódica</Text>
    <Text style={styles.formula}>
      M = C × (1 + r/n)^(n×t)
    </Text>
    <Text style={styles.text}>Donde n es el número de capitalizaciones por año</Text>

    <Text style={styles.subtitle}>Capitalización Anticipada</Text>
    <Text style={styles.formula}>
      M = C × (1 + r)^(t+1)
    </Text>

    <Text style={styles.subtitle}>Capitalización Diferida</Text>
    <Text style={styles.formula}>
      M = C × (1 + r)^(t-t₀)
    </Text>
    <Text style={styles.text}>Donde t₀ es el tiempo de diferimiento</Text>
  </View>
);

// Sección 3: Cálculos
const CalculationSection = () => {
  const [tipoCapitalizacion, setTipoCapitalizacion] = useState("simple");
  const [C, setC] = useState("");
  const [i, setI] = useState("");
  const [t, setT] = useState("");
  const [M, setM] = useState("");
  const [n, setN] = useState("");
  const [t0, setT0] = useState("");
  const [resultado, setResultado] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCalcular = () => {
    // Obtener los campos requeridos según el tipo de capitalización
    let camposRequeridos = [
      { valor: C, etiqueta: "Capital Inicial" },
      { valor: i, etiqueta: "Tasa de Interés" },
      { valor: t, etiqueta: "Tiempo" },
      { valor: M, etiqueta: "Monto Final" }
    ];

    // Validar frecuencia solo para los tipos que la usan
    const requiereFrecuencia = ["compuesta", "periodica", "anticipada", "diferida"].includes(tipoCapitalizacion);
    if (requiereFrecuencia && !n) {
      Alert.alert("Error", "Debe especificar la frecuencia de capitalización");
      return;
    }

    if (tipoCapitalizacion === "diferida") {
      if (!t0) {
        Alert.alert("Error", "Debe especificar el tiempo de diferimiento (t₀)");
        return;
      }
    }

    // Contar campos vacíos
    const camposVacios = camposRequeridos.filter(campo => campo.valor === "");
    
    if (camposVacios.length !== 1) {
      Alert.alert(
        "Error",
        "Debe dejar exactamente un campo vacío entre Capital Inicial, Tasa de Interés, Tiempo y Monto Final para calcular."
      );
      return;
    }

    try {
      const resultado = calcularCapitalizacion(
        tipoCapitalizacion,
        C === "" ? null : parseFloat(C),
        i === "" ? null : parseFloat(i),
        t === "" ? null : parseFloat(t),
        M === "" ? null : parseFloat(M),
        n === "" ? null : parseInt(n),
        t0 === "" ? null : parseFloat(t0)
      );

      if (typeof resultado === "string") {
        Alert.alert("Error", resultado);
        return;
      }

      setResultado(resultado);
      setShowConfirmation(true);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error en el cálculo.");
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
          tipo: `Capitalización ${tipoCapitalizacion.charAt(0).toUpperCase() + tipoCapitalizacion.slice(1)}`,
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

  const limpiarCampos = () => {
    setC("");
    setI("");
    setT("");
    setM("");
    if (["compuesta", "periodica", "anticipada", "diferida"].includes(tipoCapitalizacion)) {
      setN("");
    }
    setT0("");
    setResultado("");
  };

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Calculadora</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Tipo de Capitalización:</Text>
        <Picker
          selectedValue={tipoCapitalizacion}
          onValueChange={(itemValue) => {
            setTipoCapitalizacion(itemValue);
            limpiarCampos();
          }}
          style={styles.picker}
        >
          <Picker.Item label="Capitalización Simple" value="simple" />
          <Picker.Item label="Capitalización Compuesta" value="compuesta" />
          <Picker.Item label="Capitalización Continua" value="continua" />
          <Picker.Item label="Capitalización Periódica" value="periodica" />
          <Picker.Item label="Capitalización Anticipada" value="anticipada" />
          <Picker.Item label="Capitalización Diferida" value="diferida" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Capital Inicial (C)"
        keyboardType="numeric"
        value={C}
        onChangeText={setC}
      />

      <TextInput
        style={styles.input}
        placeholder="Tasa de Interés Anual (%) (r)"
        keyboardType="numeric"
        value={i}
        onChangeText={setI}
      />

      <TextInput
        style={styles.input}
        placeholder="Tiempo en años (t)"
        keyboardType="numeric"
        value={t}
        onChangeText={setT}
      />

      {["compuesta", "periodica", "anticipada", "diferida"].includes(tipoCapitalizacion) && (
        <View>
          <Text style={styles.inputLabel}>Frecuencia de Capitalización:</Text>
          <Picker
            selectedValue={n}
            onValueChange={(itemValue) => setN(itemValue)}
            style={[styles.picker, styles.frecuenciaPicker]}
          >
            <Picker.Item label="Seleccione la frecuencia" value="" />
            <Picker.Item label="Anual (1 vez al año)" value="1" />
            <Picker.Item label="Semestral (2 veces al año)" value="2" />
            <Picker.Item label="Cuatrimestral (3 veces al año)" value="3" />
            <Picker.Item label="Trimestral (4 veces al año)" value="4" />
            <Picker.Item label="Bimestral (6 veces al año)" value="6" />
            <Picker.Item label="Mensual (12 veces al año)" value="12" />
            <Picker.Item label="Quincenal (24 veces al año)" value="24" />
            <Picker.Item label="Semanal (52 veces al año)" value="52" />
            <Picker.Item label="Diaria (360 veces al año)" value="360" />
          </Picker>
        </View>
      )}

      {tipoCapitalizacion === "diferida" && (
        <TextInput
          style={styles.input}
          placeholder="Tiempo de diferimiento (t₀)"
          keyboardType="numeric"
          value={t0}
          onChangeText={setT0}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Monto Final (M)"
        keyboardType="numeric"
        value={M}
        onChangeText={setM}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCalcular}>
          <Text style={styles.buttonText}>Calcular</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={limpiarCampos}>
          <Text style={styles.buttonText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {resultado !== "" && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Monto Final: ${parseFloat(resultado).toLocaleString('es-ES', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</Text>
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
  subtitle: { color: "#FFD700", fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  button: {
    flex: 1,
    backgroundColor: "#E5A442",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonSecondary: {
    backgroundColor: "#666",
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
  inputLabel: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  frecuenciaPicker: {
    backgroundColor: '#2A2D3E',
    color: '#FFF',
    marginBottom: 10,
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
});

export default CapitalizacionScreen; 