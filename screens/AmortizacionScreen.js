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
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  calcularAmortizacion,
  calcularAmortizacionAmericana,
  calcularAmortizacionAleman,
} from "../Logic/Amortizacion";
import { JSONStorageService } from "../Logic/JSON_Storage_Service";

// Definición de los íconos para las pestañas
const tabIcons = ["info", "functions", "calculate"];

const AmortizacionScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tipoAmortizacion, setTipoAmortizacion] = useState("francesa");
  const [plazo, setPlazo] = useState("mensual");
  const [plazoMaximo, setPlazoMaximo] = useState("anual");
  const [P, setP] = useState("");
  const [i, setI] = useState("");
  const [n, setN] = useState("");
  const [tabla, setTabla] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCalcular = async () => {
    if (!P || !i || !n) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      let resultados;
      const capital = parseFloat(P);
      const interes = parseFloat(i);
      const periodos = parseInt(n);

      switch (tipoAmortizacion) {
        case "francesa":
          resultados = calcularAmortizacion(capital, interes, periodos, plazoMaximo, plazo);
          break;
        case "americana":
          resultados = calcularAmortizacionAmericana(capital, interes, periodos, plazoMaximo, plazo);
          break;
        case "alemana":
          resultados = calcularAmortizacionAleman(capital, interes, periodos, plazoMaximo, plazo);
          break;
        default:
          throw new Error("Tipo de amortización no válido.");
      }

      setTabla(resultados);
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
          tipo: `Amortización ${tipoAmortizacion.charAt(0).toUpperCase() + tipoAmortizacion.slice(1)}`,
          total: tabla.reduce((acc, curr) => acc + curr.cuota, 0),
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <InfoSection />;
      case 1:
        return <FormulasSection />;
      case 2:
        return (
          <CalculationSection
            tipoAmortizacion={tipoAmortizacion}
            setTipoAmortizacion={setTipoAmortizacion}
            plazo={plazo}
            setPlazo={setPlazo}
            plazoMaximo={plazoMaximo}
            setPlazoMaximo={setPlazoMaximo}
            P={P}
            setP={setP}
            i={i}
            setI={setI}
            n={n}
            setN={setN}
            tabla={tabla}
            handleCalcular={handleCalcular}
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

      {tabla.length > 0 && (
        <>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Resumen de Amortización</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Pagado:</Text>
              <Text style={styles.summaryValue}>
                {tabla.reduce((acc, curr) => acc + curr.cuota, 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Intereses:</Text>
              <Text style={styles.summaryValue}>
                {tabla.reduce((acc, curr) => acc + curr.interes, 0).toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Capital:</Text>
              <Text style={styles.summaryValue}>
                {tabla.reduce((acc, curr) => acc + curr.abonoCapital, 0).toFixed(2)}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.tableContainer}>
            <ScrollView horizontal={true}>
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>Período</Text>
                  <Text style={styles.tableCell}>Cuota</Text>
                  <Text style={styles.tableCell}>Interés</Text>
                  <Text style={styles.tableCell}>Abono Capital</Text>
                  <Text style={styles.tableCell}>Saldo</Text>
                </View>
                {tabla.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.tableRow,
                      index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                    ]}
                  >
                    <Text style={styles.tableCell}>{item.periodo}</Text>
                    <Text style={styles.tableCell}>{item.cuota.toFixed(2)}</Text>
                    <Text style={styles.tableCell}>{item.interes.toFixed(2)}</Text>
                    <Text style={styles.tableCell}>{item.abonoCapital.toFixed(2)}</Text>
                    <Text style={styles.tableCell}>{item.saldo.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>

          {showConfirmation && (
            <View style={styles.confirmationContainer}>
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
            </View>
          )}
        </>
      )}
    </View>
  );
};

// Sección 1: Conceptos
const InfoSection = () => (
  <View style={styles.section}>
    <Text style={styles.title}>¿Qué es una Amortización?</Text>
    <Text style={styles.text}>
      La amortización es el proceso de pagar una deuda a través de pagos
      periódicos que incluyen tanto el capital como los intereses. Es común en
      préstamos como hipotecas, créditos personales y empresariales.
    </Text>
  </View>
);

// Sección 2: Fórmulas
const FormulasSection = () => (
  <View style={styles.section}>
    <Text style={styles.title}>Fórmula de Amortización</Text>
    <Text style={styles.formula}>
      Cuota = P × [(1 + i)^n × i] / [(1 + i)^n - 1]
    </Text>
    <Text style={styles.text}>
      Donde:
      {"\n"}• <Text style={styles.highlight}>P</Text>: Monto del préstamo
      {"\n"}• <Text style={styles.highlight}>i</Text>: Tasa de interés por
      período
      {"\n"}• <Text style={styles.highlight}>n</Text>: Número de períodos
    </Text>
  </View>
);

// Sección 3: Cálculos
const CalculationSection = ({
  tipoAmortizacion,
  setTipoAmortizacion,
  plazo,
  setPlazo,
  plazoMaximo,
  setPlazoMaximo,
  P,
  setP,
  i,
  setI,
  n,
  setN,
  tabla,
  handleCalcular,
}) => (
  <View style={styles.section}>
    <Text style={styles.title}>Calculadora</Text>

    <View style={styles.inputsContainer}>
      <TextInput
        style={styles.input}
        placeholder="Monto del préstamo (P)"
        keyboardType="numeric"
        value={P}
        onChangeText={setP}
      />
      <TextInput
        style={styles.input}
        placeholder="Tasa de interés (i)"
        keyboardType="numeric"
        value={i}
        onChangeText={setI}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de períodos (n)"
        keyboardType="numeric"
        value={n}
        onChangeText={setN}
      />
    </View>

    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>Tipo de Amortización:</Text>
      <Picker
        selectedValue={tipoAmortizacion}
        onValueChange={(itemValue) => setTipoAmortizacion(itemValue)}
        style={styles.picker}
        dropdownIconColor="#E5A442"
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Amortización Francesa" value="francesa" style={styles.pickerItem} />
        <Picker.Item label="Amortización Americana" value="americana" style={styles.pickerItem} />
        <Picker.Item label="Amortización Alemana" value="alemana" style={styles.pickerItem} />
      </Picker>
    </View>

    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>Plazo Máximo:</Text>
      <Picker
        selectedValue={plazoMaximo}
        onValueChange={(itemValue) => setPlazoMaximo(itemValue)}
        style={styles.picker}
        dropdownIconColor="#E5A442"
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Años" value="anual" style={styles.pickerItem} />
        <Picker.Item label="Meses" value="mensual" style={styles.pickerItem} />
        <Picker.Item label="Semanas" value="semanal" style={styles.pickerItem} />
        <Picker.Item label="Días" value="diario" style={styles.pickerItem} />
      </Picker>
    </View>

    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>Frecuencia de Pago:</Text>
      <Picker
        selectedValue={plazo}
        onValueChange={(itemValue) => setPlazo(itemValue)}
        style={styles.picker}
        dropdownIconColor="#E5A442"
        itemStyle={styles.pickerItem}
      >
        <Picker.Item label="Anual" value="anual" style={styles.pickerItem} />
        <Picker.Item label="Semestral" value="semestral" style={styles.pickerItem} />
        <Picker.Item label="Trimestral" value="trimestral" style={styles.pickerItem} />
        <Picker.Item label="Mensual" value="mensual" style={styles.pickerItem} />
        <Picker.Item label="Diario" value="diario" style={styles.pickerItem} />
      </Picker>
    </View>

    <TouchableOpacity style={styles.button} onPress={handleCalcular}>
      <Text style={styles.buttonText}>Calcular</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1D2A",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
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
  section: {
    marginBottom: 30,
    paddingBottom: 50,
  },
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
  highlight: { color: "#E5A442", fontWeight: "bold" },
  inputsContainer: {
    marginBottom: 20,
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
  pickerItem: {
    color: "#FFF",
    fontSize: 16,
    backgroundColor: "#2A2D3E",
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
  table: {
    borderWidth: 1,
    borderColor: "#E5A442",
    marginTop: 20,
    marginBottom: 50,
    minWidth: 600,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    minWidth: 600,
  },
  tableHeader: {
    backgroundColor: "#2A2D3E",
    borderBottomWidth: 2,
    borderBottomColor: "#E5A442",
  },
  tableRowEven: { backgroundColor: "#1B1D2A" },
  tableRowOdd: { backgroundColor: "#2A2D3E" },
  tableCell: {
    color: "#FFF",
    fontSize: 14,
    flex: 1,
    textAlign: "center",
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: "#444",
    minWidth: 120,
  },
  icon: { marginBottom: 5 },
  summaryContainer: {
    backgroundColor: "#2A2D3E",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5A442",
    marginBottom: 20,
    marginTop: 20,
  },
  summaryTitle: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    color: "#FFF",
    fontSize: 16,
  },
  summaryValue: {
    color: "#E5A442",
    fontSize: 16,
    fontWeight: "bold",
  },
  tableContainer: {
    maxHeight: 300,
    marginVertical: 10,
  },
  confirmationContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#2A2D3E',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5A442',
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

export default AmortizacionScreen;
