import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Importar íconos
import { interesSimple } from "../Logic/InteresSimple"; // Asegúrate de que la ruta sea correcta
import Svg, { Path, G, Circle } from "react-native-svg"; // Asegúrate de que la ruta sea correcta
import { JSONStorageService } from "../Logic/JSON_Storage_Service"; // Corregir la ruta de importación

const TasaDeInteres = () => {
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
        {["Conceptos", "Fórmulas", "Cálculos"].map((title, index) =>
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
                activeTab === index && styles.activeTabText
              ]}
            >
              {title}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Sección de Información

const InfoSection = () => (
    <View style={styles.section}>
      <Text style={styles.title}>¿Qué es el Interés Simple?</Text>
      <Text style={styles.text}>
        El interés simple es una forma de calcular el rendimiento de una inversión o
        el costo de un préstamo sin considerar la acumulación de intereses en
        periodos anteriores. Es uno de los métodos más básicos y utilizados en finanzas
        para calcular el interés generado sobre un capital inicial durante un período
        de tiempo determinado.
      </Text>
  
      {/* SVG de una gráfica de crecimiento suave */}
      <Svg height="150" width="100%" viewBox="0 0 100 100" style={styles.svg}>
        <G transform="translate(0, 100) scale(1, -1)">
          {/* Ejes */}
          <Path d="M10 10 V90 H90" stroke="#E5A442" strokeWidth="2" fill="none" />
          
          {/* Línea de crecimiento suave */}
          <Path
            d="M10 10 Q30 50, 50 30 T90 70"
            stroke="#FFD700"
            strokeWidth="3"
            fill="none"
          />
          
          {/* Puntos en la gráfica */}
          <Circle cx="10" cy="10" r="3" fill="#FFD700" />
          <Circle cx="30" cy="50" r="3" fill="#FFD700" />
          <Circle cx="50" cy="30" r="3" fill="#FFD700" />
          <Circle cx="70" cy="60" r="3" fill="#FFD700" />
          <Circle cx="90" cy="70" r="3" fill="#FFD700" />
        </G>
      </Svg>
  
      <Text style={styles.subtitle}>Características principales:</Text>
      <Text style={styles.text}>• Se calcula sobre el capital inicial.</Text>
      <Text style={styles.text}>• No se capitaliza (no hay interés sobre interés).</Text>
      <Text style={styles.text}>• Es lineal en el tiempo.</Text>
      <Text style={styles.text}>• Fácil de calcular y entender.</Text>
      <Text style={styles.text}>• Ideal para préstamos o inversiones a corto plazo.</Text>
  
      <Text style={styles.subtitle}>Ejemplo práctico:</Text>
      <Text style={styles.text}>
        Si inviertes $1,000 a una tasa de interés simple del 5% anual, después de un año
        habrás ganado $50 en intereses. Este cálculo no considera la reinversión de los
        intereses, lo que lo diferencia del interés compuesto.
      </Text>
    </View>
  );

// Sección de Fórmulas
const FormulasSection = () =>
  <View style={styles.section}>
    <Text style={styles.title}>Fórmulas Básicas</Text>

    <Text style={styles.subtitle}>Interés Simple (I):</Text>
    <Text style={styles.formula}>I = C × i × t</Text>

    <Text style={styles.subtitle}>Donde:</Text>
    <Text style={styles.text}>• C = Capital inicial</Text>
    <Text style={styles.text}>• i = Tasa de interés</Text>
    <Text style={styles.text}>• t = Tiempo</Text>
  </View>;

// Sección de Cálculos (lógica original con modal)
const CalculationSection = () => {
  const [C, setC] = useState("");
  const [i, setI] = useState("");
  const [seleccionados, setSeleccionados] = useState([]);
  const [tiempoAnos, setTiempoAnos] = useState("");
  const [tiempoMeses, setTiempoMeses] = useState("");
  const [tiempoDias, setTiempoDias] = useState("");
  const [I, setInteres] = useState("");
  const [resultado, setResultado] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleSeleccion = opcion => {
    if (seleccionados.includes(opcion)) {
      setSeleccionados(seleccionados.filter(item => item !== opcion));
    } else {
      setSeleccionados([...seleccionados, opcion]);
    }
  };

  const handleCalcular = async () => {
    if (!C || !i || (!tiempoAnos && !tiempoMeses && !tiempoDias) || !interes) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const capital = parseFloat(C);
      const tasaInteres = parseFloat(i);
      const interesTotal = parseFloat(interes);
      const tiempo = {
        y: tiempoAnos ? parseInt(tiempoAnos) : 0,
        m: tiempoMeses ? parseInt(tiempoMeses) : 0,
        d: tiempoDias ? parseInt(tiempoDias) : 0
      };

      const montoTotal = capital + interesTotal;
      setResultado(`Monto Total: ${montoTotal.toLocaleString()} COP`);

      // Guardar el préstamo automáticamente
      const currentUser = await JSONStorageService.getCurrentUser();
      if (!currentUser) {
        Alert.alert("Error", "No hay usuario actual");
        return;
      }

      // Crear objeto de préstamo simplificado
      const loanData = {
        tipo: "Interés Simple",
        total: montoTotal,
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

      // Limpiar los inputs
      setC("");
      setI("");
      setTiempoAnos("");
      setTiempoMeses("");
      setTiempoDias("");
      setInteres("");
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error en el cálculo.");
    }
  };

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
            seleccionados.includes("años") && styles.botonSeleccionado
          ]}
          onPress={() => toggleSeleccion("años")}
        >
          <Text style={styles.textoBotonTiempo}>Años</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.botonTiempo,
            seleccionados.includes("meses") && styles.botonSeleccionado
          ]}
          onPress={() => toggleSeleccion("meses")}
        >
          <Text style={styles.textoBotonTiempo}>Meses</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.botonTiempo,
            seleccionados.includes("dias") && styles.botonSeleccionado
          ]}
          onPress={() => toggleSeleccion("dias")}
        >
          <Text style={styles.textoBotonTiempo}>Días</Text>
        </TouchableOpacity>
      </View>

      {seleccionados.includes("años") &&
        <TextInput
          style={styles.input}
          placeholder="Tiempo en años"
          keyboardType="numeric"
          value={tiempoAnos}
          onChangeText={setTiempoAnos}
        />}

      {seleccionados.includes("meses") &&
        <TextInput
          style={styles.input}
          placeholder="Tiempo en meses"
          keyboardType="numeric"
          value={tiempoMeses}
          onChangeText={setTiempoMeses}
        />}

      {seleccionados.includes("dias") &&
        <TextInput
          style={styles.input}
          placeholder="Tiempo en días"
          keyboardType="numeric"
          value={tiempoDias}
          onChangeText={setTiempoDias}
        />}

      <TextInput
        style={styles.input}
        placeholder="Interés (I)"
        keyboardType="numeric"
        value={I}
        onChangeText={setInteres}
      />

      <TouchableOpacity style={styles.boton} onPress={handleCalcular}>
        <Text style={styles.textoBoton}>Calcular</Text>
      </TouchableOpacity>

      {/* Mostrar resultado y botones de confirmación */}
      {showConfirmation && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>Resultado: {resultado}</Text>
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
    </View>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1D2A"
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
    marginTop: 30
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
    elevation: 5
  },
  tabButton: {
    alignItems: "center"
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#E5A442"
  },
  tabText: {
    color: "#FFF",
    fontSize: 14,
    marginTop: 5
  },
  activeTabText: {
    color: "#E5A442",
    fontWeight: "bold"
  },
  icon: {
    marginBottom: 5
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  title: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15
  },
  subtitle: {
    color: "#E5A442",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 8
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 22
  },
  title: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15
  },
  text: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 5,
    lineHeight: 22
  },
  subtitle: {
    color: "#E5A442",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 8
  },
  svg: {
    marginVertical: 20,
    alignSelf: "center"
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5
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
    elevation: 5
  },
  botonesTiempo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },
  botonTiempo: {
    flex: 1,
    backgroundColor: "#2A2D3E",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5
  },
  botonSeleccionado: {
    backgroundColor: "#E5A442"
  },
  textoBotonTiempo: {
    color: "#FFF",
    fontSize: 16
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
    elevation: 5
  },
  textoBoton: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1B1D2A',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#E5A442',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TasaDeInteres;
