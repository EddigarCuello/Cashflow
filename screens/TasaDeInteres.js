import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { interesSimple } from "../Logic/Calculos"; // Asegúrate de que la ruta sea correcta

const TasaDeInteres = () => {
  const [C, setC] = useState("");
  const [i, setI] = useState("");
  const [seleccionados, setSeleccionados] = useState([]); // Array para almacenar las opciones seleccionadas
  const [tiempoAnos, setTiempoAnos] = useState("");
  const [tiempoMeses, setTiempoMeses] = useState("");
  const [tiempoDias, setTiempoDias] = useState("");
  const [I, setInteres] = useState("");
  const [resultado, setResultado] = useState("");

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
    const valoresNulos = valores.filter(v => v === '').length;

    if (valoresNulos !== 1) {
        Alert.alert('Error', 'Debe dejar solo un campo vacío para calcular.');
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
        if (seleccionados.includes("años") && seleccionados.includes("meses")) unidadTiempo = "ym";
        else if (seleccionados.includes("años") && seleccionados.includes("dias")) unidadTiempo = "yd";
        else if (seleccionados.includes("meses") && seleccionados.includes("dias")) unidadTiempo = "md";
    } else if (seleccionados.length === 3) {
        unidadTiempo = "ymd";
    } else {
        Alert.alert('Error', 'Selecciona al menos una unidad de tiempo.');
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

    console.log("Llamando a interesSimple con:", { capital, tasaInteres, tiempo, interes, unidadTiempo });

    try {
        const resultadoCalculado = await interesSimple(capital, tasaInteres, tiempo, interes, unidadTiempo);
        setResultado(`Resultado: ${resultadoCalculado}`);
    } catch (error) {
        Alert.alert('Error', 'Ocurrió un error en el cálculo.');
    }
};





  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Interés Simple</Text>
      <Text style={styles.descripcion}>
        El interés simple es una forma de calcular el rendimiento de una
        inversión o el costo de un préstamo sin considerar la acumulación de
        intereses en periodos anteriores.
      </Text>

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

      {resultado
        ? <View>
            <Text style={styles.resultado}>
              {resultado}
            </Text>
          </View>
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1B1D2A"
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    textAlign: "center"
  },
  descripcion: {
    fontSize: 16,
    color: "#BBB",
    textAlign: "center",
    marginBottom: 20
  },
  input: {
    height: 50,
    borderColor: "#E5A442",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "#FFF",
    backgroundColor: "#2A2D3E"
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
    alignItems: "center"
  },
  textoBoton: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold"
  },
  resultado: {
    marginTop: 20,
    fontSize: 18,
    color: "#FFF",
    textAlign: "center"
  }
});

export default TasaDeInteres;
