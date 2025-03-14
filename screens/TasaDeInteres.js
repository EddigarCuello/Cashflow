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
import { interesSimple } from "../Logic/Calculos";
import Svg, { Path, G, Circle } from "react-native-svg"; // Asegúrate de que la ruta sea correcta

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
  const [modalVisible, setModalVisible] = useState(false);

  const toggleSeleccion = opcion => {
    if (seleccionados.includes(opcion)) {
      setSeleccionados(seleccionados.filter(item => item !== opcion));
    } else {
      setSeleccionados([...seleccionados, opcion]);
    }
  };

  const calcularInteresSimple = async () => {
    // Validar que solo falte un campo
    const valores = [C, i, tiempoAnos || tiempoMeses || tiempoDias, I];
    const valoresNulos = valores.filter(v => v === "").length;

    if (valoresNulos !== 1) {
      Alert.alert("Error", "Debe dejar solo un campo vacío para calcular.");
      return;
    }

    // Inicializar variables
    let tiempo = {};
    let unidadTiempo = null;

    // Asignar unidad de tiempo y valores de tiempo sin hacer cálculos
    if (seleccionados.includes("años")) tiempo.y = parseFloat(tiempoAnos);
    if (seleccionados.includes("meses")) tiempo.m = parseFloat(tiempoMeses);
    if (seleccionados.includes("dias")) tiempo.d = parseFloat(tiempoDias);

    // Eliminar valores NaN del objeto tiempo
    Object.keys(tiempo).forEach(key => {
      if (isNaN(tiempo[key])) delete tiempo[key];
    });

    // Asignar la unidad de tiempo
    if (seleccionados.length === 1) {
      if (seleccionados.includes("años")) unidadTiempo = "y";
      else if (seleccionados.includes("meses")) unidadTiempo = "m";
      else if (seleccionados.includes("dias")) unidadTiempo = "d";
    } else if (seleccionados.length === 2) {
      if (seleccionados.includes("años") && seleccionados.includes("meses"))
        unidadTiempo = "ym";
      else if (seleccionados.includes("años") && seleccionados.includes("dias"))
        unidadTiempo = "yd";
      else if (
        seleccionados.includes("meses") &&
        seleccionados.includes("dias")
      )
        unidadTiempo = "md";
    } else if (seleccionados.length === 3) {
      unidadTiempo = "ymd";
    } else {
      Alert.alert("Error", "Selecciona al menos una unidad de tiempo.");
      return;
    }

    // Si solo hay una clave en `tiempo`, extraer su valor en lugar de enviarlo como objeto
    if (Object.keys(tiempo).length === 1) {
      tiempo = Object.values(tiempo)[0]; // Extrae el único valor
    } else if (Object.keys(tiempo).length === 0) {
      tiempo = null; // Si no hay valores, asignar null
    }

    // Convertir valores de entrada a números válidos o null si no lo son
    const capital = !isNaN(parseFloat(C)) ? parseFloat(C) : null;
    const tasaInteres = !isNaN(parseFloat(i)) ? parseFloat(i) : null;
    const interes = !isNaN(parseFloat(I)) ? parseFloat(I) : null;

    console.log("Llamando a interesSimple con:", {
      capital,
      tasaInteres,
      tiempo,
      interes,
      unidadTiempo
    });

    try {
      const resultadoCalculado = await interesSimple(
        capital,
        tasaInteres,
        tiempo,
        interes,
        unidadTiempo
      );
      setResultado(resultadoCalculado);
      setModalVisible(true); // Mostrar el modal con el resultado
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error en el cálculo.");
    }
  };

  const handleResponse = response => {
    setModalVisible(false); // Cerrar el modal
    if (response === "si") {
      // Aquí podrías agregar lógica adicional si el usuario acepta el préstamo
      Alert.alert("Éxito", "Préstamo realizado con éxito.");
    } else {
      Alert.alert("Cancelado", "Préstamo cancelado.");
    }
    // Limpiar los inputs
    setC("");
    setI("");
    setTiempoAnos("");
    setTiempoMeses("");
    setTiempoDias("");
    setInteres("");
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

      <TouchableOpacity style={styles.boton} onPress={calcularInteresSimple}>
        <Text style={styles.textoBoton}>Calcular</Text>
      </TouchableOpacity>

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
            <Text style={styles.modalText}>
              Capital: {C}
            </Text>
            <Text style={styles.modalText}>
              Tasa de interés: {i}
            </Text>
            <Text style={styles.modalText}>
              Resultado: {resultado}
            </Text>
            <Text style={styles.modalQuestion}>
              ¿Quieres realizar el préstamo?
            </Text>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)"
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
    elevation: 5
  },
  modalTitle: {
    color: "#FFD700",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  modalText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 8
  },
  modalQuestion: {
    color: "#E5A442",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center"
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around"
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "40%",
    alignItems: "center"
  },
  modalButtonYes: {
    backgroundColor: "#4CAF50"
  },
  modalButtonNo: {
    backgroundColor: "#F44336"
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  }
});

export default TasaDeInteres;
