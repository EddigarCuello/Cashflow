import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // Importación corregida
import Icon from "react-native-vector-icons/MaterialIcons";
import { interesSimple } from "../Logic/InteresSimple";
import { interesCompuesto } from "../Logic/InteresCompuesto";
import { AnualidadesSimples } from "../Logic/AnualidadesSimples";
import { calcularTasaInteres } from "../Logic/Calculos";// Asegúrate de que la ruta sea correcta
import { JSONStorageService } from "../Logic/JSON_Storage_Service"; // Corregir la ruta de importación

const TotalInteres = () => {
  const [activeTab, setActiveTab] = useState(0); // Estado para la pestaña activa
  const [modalVisible, setModalVisible] = useState(false);
  const [resultado, setResultado] = useState("");

  // Estados para Interés Simple
  const [C, setC] = useState("");
  const [i, setI] = useState("");
  const [tiempoAnos, setTiempoAnos] = useState("");
  const [tiempoMeses, setTiempoMeses] = useState("");
  const [tiempoDias, setTiempoDias] = useState("");
  const [I, setInteres] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);

  // Estados para Interés Compuesto
  const [M, setM] = useState("");
  const [timeYears, setTimeYears] = useState("");
  const [timeMonths, setTimeMonths] = useState("");
  const [timeDays, setTimeDays] = useState("");
  const [selectedUnits, setSelectedUnits] = useState([]);

  // Estados para Anualidades
  const [tipo, setTipo] = useState("VF");
  const [A, setA] = useState("");
  const [j, setJ] = useState("");
  const [VF, setVF] = useState("");
  const [VA, setVA] = useState("");
  const [periodoCapitalizacion, setPeriodoCapitalizacion] = useState("mensual");
  const [t, setT] = useState("");
  const [tasaInteres, setTasaInteres] = useState(""); // Nuevo estado para la tasa de interés

  // Estado para la calculadora seleccionada
  const [selectedCalculator, setSelectedCalculator] = useState("simple"); // Estado para la calculadora seleccionada

  // Definir íconos para cada pestaña
  const tabIcons = ["info", "functions", "calculate"]; // Íconos para Conceptos, Fórmulas y Cálculos

  // Contenido de las pestañas
  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Pestaña de Información
        return <InfoSection />;
      case 1: // Pestaña de Fórmulas
        return <FormulasSection />;
      case 2: // Pestaña de Cálculos
        return <CalculationSection />;
      default:
        return <InfoSection />;
    }
  };

  // Sección de Información
  const InfoSection = () => (
    <View style={styles.section}>
      <Text style={styles.title}>¿Qué es la Tasa de Interés?</Text>
      <Text style={styles.text}>
        La tasa de interés es el porcentaje que se aplica al capital inicial para
        calcular el interés generado en un período de tiempo determinado. Es un
        concepto fundamental en finanzas que permite entender el costo de un
        préstamo o el rendimiento de una inversión.
      </Text>

      <Text style={styles.subtitle}>Características principales:</Text>
      <Text style={styles.text}>• Se expresa como un porcentaje.</Text>
      <Text style={styles.text}>• Puede ser fija o variable.</Text>
      <Text style={styles.text}>• Afecta directamente el costo de un préstamo.</Text>
      <Text style={styles.text}>• Determina el rendimiento de una inversión.</Text>

      <Text style={styles.subtitle}>Ejemplo práctico:</Text>
      <Text style={styles.text}>
        Si inviertes $1,000 a una tasa de interés del 5% anual, después de un año
        habrás ganado $50 en intereses.
      </Text>
    </View>
  );

  // Sección de Fórmulas
  const FormulasSection = () => (
    <View style={styles.section}>
      <Text style={styles.title}>Fórmulas Básicas</Text>

      <Text style={styles.subtitle}>Interés Simple:</Text>
      <Text style={styles.formula}>I = C × i × t</Text>

      <Text style={styles.subtitle}>Interés Compuesto:</Text>
      <Text style={styles.formula}>M = C × (1 + i)ⁿ</Text>

      <Text style={styles.subtitle}>Anualidades:</Text>
      <Text style={styles.formula}>
        Para Valor Futuro (VF): VF = A × ((1 + i)ⁿ - 1) / i
      </Text>
      <Text style={styles.formula}>
        Para Valor Actual (VA): VA = A × (1 - (1 + i)^(-n)) / i
      </Text>

      <Text style={styles.subtitle}>Donde:</Text>
      <Text style={styles.text}>• C = Capital inicial</Text>
      <Text style={styles.text}>• i = Tasa de interés</Text>
      <Text style={styles.text}>• t = Tiempo</Text>
      <Text style={styles.text}>• n = Número de períodos</Text>
      <Text style={styles.text}>• A = Pago periódico</Text>
    </View>
  );

  // Sección de Cálculos
  const CalculationSection = () => {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calculadora de Tasa de Interés</Text>

        {/* Desplegable para seleccionar la calculadora */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCalculator}
            onValueChange={(value) => setSelectedCalculator(value)}
            dropdownIconColor="#E5A442"
          >
            <Picker.Item label="Interés Simple" value="simple" />
            <Picker.Item label="Interés Compuesto" value="compuesto" />
            <Picker.Item label="Anualidades" value="anualidades" />
          </Picker>
        </View>

        {/* Renderizar la calculadora seleccionada */}
        {renderCalculator(selectedCalculator)}
      </View>
    );
  };

  // Función para manejar la selección de unidades de tiempo
  const toggleSeleccion = (opcion) => {
    if (seleccionados.includes(opcion)) {
      setSeleccionados(seleccionados.filter((item) => item !== opcion));
    } else {
      setSeleccionados([...seleccionados, opcion]);
    }
  };

  const toggleSelection = (unit) => {
    if (selectedUnits.includes(unit)) {
      setSelectedUnits(selectedUnits.filter((item) => item !== unit));
    } else {
      setSelectedUnits([...selectedUnits, unit]);
    }
  };

  // Función para calcular Interés Simple
  const calcularInteresSimple = async () => {
    const valores = [C, i, tiempoAnos || tiempoMeses || tiempoDias, I];
    const valoresNulos = valores.filter((v) => v === "").length;

    if (valoresNulos !== 1) {
      Alert.alert("Error", "Debe dejar solo un campo vacío para calcular.");
      return;
    }

    let tiempo = {};
    let unidadTiempo = null;

    if (seleccionados.includes("años")) tiempo.y = parseFloat(tiempoAnos);
    if (seleccionados.includes("meses")) tiempo.m = parseFloat(tiempoMeses);
    if (seleccionados.includes("dias")) tiempo.d = parseFloat(tiempoDias);

    Object.keys(tiempo).forEach((key) => {
      if (isNaN(tiempo[key])) delete tiempo[key];
    });

    if (seleccionados.length === 1) {
      if (seleccionados.includes("años")) unidadTiempo = "y";
      else if (seleccionados.includes("meses")) unidadTiempo = "m";
      else if (seleccionados.includes("dias")) unidadTiempo = "d";
    } else if (seleccionados.length === 2) {
      if (seleccionados.includes("años") && seleccionados.includes("meses"))
        unidadTiempo = "ym";
      else if (seleccionados.includes("años") && seleccionados.includes("dias"))
        unidadTiempo = "yd";
      else if (seleccionados.includes("meses") && seleccionados.includes("dias"))
        unidadTiempo = "md";
    } else if (seleccionados.length === 3) {
      unidadTiempo = "ymd";
    } else {
      Alert.alert("Error", "Selecciona al menos una unidad de tiempo.");
      return;
    }

    if (Object.keys(tiempo).length === 1) {
      tiempo = Object.values(tiempo)[0];
    } else if (Object.keys(tiempo).length === 0) {
      tiempo = null;
    }

    const capital = !isNaN(parseFloat(C)) ? parseFloat(C) : null;
    const tasaInteres = !isNaN(parseFloat(i)) ? parseFloat(i) : null;
    const interes = !isNaN(parseFloat(I)) ? parseFloat(I) : null;

    try {
      const resultadoCalculado = await interesSimple(
        capital,
        tasaInteres,
        tiempo,
        interes,
        unidadTiempo
      );
      setResultado(resultadoCalculado);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error en el cálculo.");
    }
  };

  // Función para calcular Interés Compuesto
  const handleCalcular = async () => {
    if (!C || !i || (!timeYears && !timeMonths && !timeDays) || !M) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const capital = parseFloat(C);
      const interes = parseFloat(i);
      const monto = parseFloat(M);
      const tiempo = {
        y: timeYears ? parseInt(timeYears) : 0,
        m: timeMonths ? parseInt(timeMonths) : 0,
        d: timeDays ? parseInt(timeDays) : 0
      };

      const resultado = await interesCompuesto(capital, interes, tiempo, monto, "ymd");
      setResultado(`Monto final: ${resultado}`);
      setModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error en el cálculo.");
    }
  };

  // Función para calcular la tasa de interés de las anualidades
  const calcularTasaAnualidades = async () => {
    if (!A || (!VF && !VA) || !t) {
      Alert.alert("Error", "Por favor, complete todos los campos.");
      return;
    }

    const n = parseFloat(t); // Número de períodos
    const resultadoTasa = calcularTasaInteres(
      parseFloat(A),
      VF ? parseFloat(VF) : null,
      VA ? parseFloat(VA) : null,
      n,
      tipo
    );

    if (resultadoTasa === null) {
      Alert.alert("Error", "No se pudo calcular la tasa de interés.");
      return;
    }

    setTasaInteres(resultadoTasa.toFixed(6)); // Mostrar la tasa con 6 decimales
    setModalVisible(true); // Mostrar el modal con el resultado
  };

  // Renderizar la calculadora seleccionada
  const renderCalculator = (selectedCalculator) => {
    switch (selectedCalculator) {
      case "simple":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cálculo de Interés Simple</Text>
            <TextInput
              style={styles.input}
              placeholder="Capital (C)"
              keyboardType="numeric"
              value={C}
              onChangeText={setC}
            />
            <TextInput
              style={styles.input}
              placeholder="Tasa de interés (i)"
              keyboardType="numeric"
              value={i}
              onChangeText={setI}
            />
            <View style={styles.botonesTiempo}>
              <TouchableOpacity
                style={[
                  styles.botonTiempo,
                  seleccionados.includes("años") && styles.botonSeleccionado,
                ]}
                onPress={() => toggleSeleccion("años")}
              >
                <Text style={styles.textoBotonTiempo}>Años</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.botonTiempo,
                  seleccionados.includes("meses") && styles.botonSeleccionado,
                ]}
                onPress={() => toggleSeleccion("meses")}
              >
                <Text style={styles.textoBotonTiempo}>Meses</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.botonTiempo,
                  seleccionados.includes("dias") && styles.botonSeleccionado,
                ]}
                onPress={() => toggleSeleccion("dias")}
              >
                <Text style={styles.textoBotonTiempo}>Días</Text>
              </TouchableOpacity>
            </View>
            {seleccionados.includes("años") && (
              <TextInput
                style={styles.input}
                placeholder="Tiempo en años"
                keyboardType="numeric"
                value={tiempoAnos}
                onChangeText={setTiempoAnos}
              />
            )}
            {seleccionados.includes("meses") && (
              <TextInput
                style={styles.input}
                placeholder="Tiempo en meses"
                keyboardType="numeric"
                value={tiempoMeses}
                onChangeText={setTiempoMeses}
              />
            )}
            {seleccionados.includes("dias") && (
              <TextInput
                style={styles.input}
                placeholder="Tiempo en días"
                keyboardType="numeric"
                value={tiempoDias}
                onChangeText={setTiempoDias}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Interés (I)"
              keyboardType="numeric"
              value={I}
              onChangeText={setInteres}
            />
            <TouchableOpacity style={styles.boton} onPress={calcularInteresSimple}>
              <Text style={styles.textoBoton}>Calcular</Text>
            </TouchableOpacity>
          </View>
        );
      case "compuesto":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cálculo de Interés Compuesto</Text>
            <TextInput
              style={styles.input}
              placeholder="Capital inicial (C)"
              keyboardType="numeric"
              value={C}
              onChangeText={setC}
            />
            <TextInput
              style={styles.input}
              placeholder="Tasa de interés (i)"
              keyboardType="numeric"
              value={i}
              onChangeText={setI}
            />
            <View style={styles.botonesTiempo}>
              <TouchableOpacity
                style={[
                  styles.botonTiempo,
                  selectedUnits.includes("años") && styles.botonSeleccionado,
                ]}
                onPress={() => toggleSelection("años")}
              >
                <Text style={styles.textoBotonTiempo}>Años</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.botonTiempo,
                  selectedUnits.includes("meses") && styles.botonSeleccionado,
                ]}
                onPress={() => toggleSelection("meses")}
              >
                <Text style={styles.textoBotonTiempo}>Meses</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.botonTiempo,
                  selectedUnits.includes("dias") && styles.botonSeleccionado,
                ]}
                onPress={() => toggleSelection("dias")}
              >
                <Text style={styles.textoBotonTiempo}>Días</Text>
              </TouchableOpacity>
            </View>
            {selectedUnits.includes("años") && (
              <TextInput
                style={styles.input}
                placeholder="Tiempo en años"
                keyboardType="numeric"
                value={timeYears}
                onChangeText={setTimeYears}
              />
            )}
            {selectedUnits.includes("meses") && (
              <TextInput
                style={styles.input}
                placeholder="Tiempo en meses"
                keyboardType="numeric"
                value={timeMonths}
                onChangeText={setTimeMonths}
              />
            )}
            {selectedUnits.includes("dias") && (
              <TextInput
                style={styles.input}
                placeholder="Tiempo en días"
                keyboardType="numeric"
                value={timeDays}
                onChangeText={setTimeDays}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Monto final (M)"
              keyboardType="numeric"
              value={M}
              onChangeText={setM}
            />
            <TouchableOpacity style={styles.boton} onPress={handleCalcular}>
              <Text style={styles.textoBoton}>Calcular</Text>
            </TouchableOpacity>
          </View>
        );
      case "anualidades":
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cálculo de Tasa de Interés</Text>
            <Text style={styles.label}>Selecciona el tipo de cálculo:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipo}
                style={styles.picker}
                onValueChange={(itemValue) => setTipo(itemValue)}
                dropdownIconColor="#E5A442"
              >
                <Picker.Item label="Valor Futuro (VF)" value="VF" />
                <Picker.Item label="Valor Actual (VA)" value="VA" />
              </Picker>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Pago periódico (A)"
              keyboardType="numeric"
              value={A}
              onChangeText={setA}
            />
            {tipo === "VF" && (
              <TextInput
                style={styles.input}
                placeholder="Valor Futuro (VF)"
                keyboardType="numeric"
                value={VF}
                onChangeText={setVF}
              />
            )}
            {tipo === "VA" && (
              <TextInput
                style={styles.input}
                placeholder="Valor Actual (VA)"
                keyboardType="numeric"
                value={VA}
                onChangeText={setVA}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Tiempo en años (t)"
              keyboardType="numeric"
              value={t}
              onChangeText={setT}
            />
            <TouchableOpacity style={styles.boton} onPress={calcularTasaAnualidades}>
              <Text style={styles.textoBoton}>Calcular Tasa de Interés</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  const handleResponse = async (response) => {
    setModalVisible(false);
    if (response === "si") {
      try {
        const currentUser = await JSONStorageService.getCurrentUser();
        if (!currentUser) {
          Alert.alert("Error", "No hay usuario actual");
          return;
        }

        // Crear objeto de préstamo simplificado
        const loanData = {
          tipo: "Interés Compuesto",
          total: parseFloat(resultado.replace('Monto final: ', '')),
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
    // Limpiar los inputs
    setC("");
    setI("");
    setTimeYears("");
    setTimeMonths("");
    setTimeDays("");
    setM("");
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
            {/* Ícono */}
            <Icon
              name={tabIcons[index]} // Nombre del ícono
              size={24} // Tamaño del ícono
              color={activeTab === index ? "#E5A442" : "#FFF"} // Color del ícono
              style={styles.icon}
            />
            {/* Texto */}
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

      {/* Modal para mostrar el resultado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Resultado del cálculo:</Text>
            <Text style={styles.modalText}>Tasa de interés: {tasaInteres}</Text>
            <Text style={styles.modalQuestion}>¿Desea realizar otra operación?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonYes]}
                onPress={() => handleResponse("si")}
              >
                <Text style={styles.modalButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonNo]}
                onPress={() => handleResponse("no")}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1D2A",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
    marginTop: 30,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  tabButton: {
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#E5A442",
  },
  tabText: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 5,
  },
  activeTabText: {
    color: "#E5A442",
    fontWeight: "bold",
  },
  icon: {
    marginBottom: 5,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  subtitle: {
    color: "#E5A442",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 8,
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 22,
  },
  formula: {
    color: "#FFF",
    fontSize: 16,
    backgroundColor: "#2A2D3E",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
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
    placeholderTextColor: "#BBB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  boton: {
    backgroundColor: "#E5A442",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  textoBoton: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1B1D2A",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    borderWidth: 1,
    borderColor: "#E5A442",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalTitle: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 8,
  },
  modalQuestion: {
    color: "#E5A442",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center",
  },
  modalButtonYes: {
    backgroundColor: "#4CAF50",
  },
  modalButtonNo: {
    backgroundColor: "#F44336",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  botonesTiempo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  botonTiempo: {
    flex: 1,
    backgroundColor: "#2A2D3E",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  botonSeleccionado: {
    backgroundColor: "#E5A442",
  },
  textoBotonTiempo: {
    color: "#FFF",
    fontSize: 16,
  },
  label: {
    color: "#E5A442",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    color: "#FFF",
  },
});

export default TotalInteres;