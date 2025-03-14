import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'; // Importar íconos
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importar íconos
import Svg, { Path, G, Rect, Circle } from 'react-native-svg';
import { interesCompuesto } from '../Logic/Calculos';

const CompoundInterestScreen = () => {
    const [activeTab, setActiveTab] = useState(0);

    // Definir íconos para cada pestaña
    const tabIcons = ['info', 'functions', 'calculate']; // Íconos para Conceptos, Fórmulas y Cálculos

    // Contenido de las pestañas
    const renderTabContent = () => {
        switch (activeTab) {
            case 0: return <InfoSection />;
            case 1: return <FormulasSection />;
            case 2: return <CalculationSection />;
            default: return <InfoSection />;
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
                {['Conceptos', 'Fórmulas', 'Cálculos'].map((title, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.tabButton, activeTab === index && styles.activeTab]}
                        onPress={() => setActiveTab(index)}
                    >
                        {/* Ícono */}
                        <Icon
                            name={tabIcons[index]} // Nombre del ícono
                            size={24} // Tamaño del ícono
                            color={activeTab === index ? '#E5A442' : '#FFF'} // Color del ícono
                            style={styles.icon}
                        />
                        {/* Texto */}
                        <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
                            {title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

// Sección de Información Extendida con SVG
const InfoSection = () => (
    <View style={styles.section}>
        <Text style={styles.title}>¿Qué es el Interés Compuesto?</Text>
        <Text style={styles.text}>
            El interés compuesto es el interés que se calcula sobre el capital inicial y también sobre los intereses acumulados de períodos anteriores. Es una de las herramientas más poderosas en las finanzas, ya que permite que el dinero crezca exponencialmente con el tiempo.
        </Text>

        {/* SVG de una gráfica de crecimiento exponencial */}
        <Svg height="200" width="100%" viewBox="0 0 100 100" style={styles.svg}>
            <G transform="translate(0, 100) scale(1, -1)">
                {/* Ejes */}
                <Path d="M10 10 V90 H90" stroke="#E5A442" strokeWidth="2" fill="none" />
                {/* Línea de crecimiento exponencial */}
                <Path
                    d="M10 10 Q30 40, 50 50 T90 90"
                    stroke="#FFD700"
                    strokeWidth="3"
                    fill="none"
                />
                {/* Puntos en la gráfica */}
                <Circle cx="10" cy="10" r="3" fill="#FFD700" />
                <Circle cx="30" cy="40" r="3" fill="#FFD700" />
                <Circle cx="50" cy="50" r="3" fill="#FFD700" />
                <Circle cx="70" cy="70" r="3" fill="#FFD700" />
                <Circle cx="90" cy="90" r="3" fill="#FFD700" />
                {/* Etiquetas de los ejes */}

            </G>
        </Svg>

        <Text style={styles.subtitle}>Características principales:</Text>
        <Text style={styles.text}>• <Text style={styles.highlight}>Capital inicial (C)</Text>: El monto inicial que se invierte o se ahorra.</Text>
        <Text style={styles.text}>• <Text style={styles.highlight}>Tasa de interés (i)</Text>: El porcentaje que se aplica al capital para calcular los intereses.</Text>
        <Text style={styles.text}>• <Text style={styles.highlight}>Tiempo (t)</Text>: El período durante el cual se acumulan los intereses.</Text>
        <Text style={styles.text}>• <Text style={styles.highlight}>Monto final (M)</Text>: El total acumulado después de aplicar el interés compuesto.</Text>

        <Text style={styles.subtitle}>Ejemplo práctico:</Text>
        <Text style={styles.text}>
            Si inviertes <Text style={styles.highlight}>$1,000</Text> a una tasa de interés anual del <Text style={styles.highlight}>5%</Text>, después de 10 años tendrás:
        </Text>
        <Text style={styles.formula}>M = 1000 * (1 + 0.05)^10 = $1,628.89</Text>
        <Text style={styles.text}>
            Esto significa que tu inversión habrá crecido en <Text style={styles.highlight}>$628.89</Text> gracias al interés compuesto.
        </Text>

        <Text style={styles.subtitle}>Beneficios del interés compuesto:</Text>
        <Text style={styles.text}>• Crecimiento exponencial del capital.</Text>
        <Text style={styles.text}>• Aprovecha el tiempo para maximizar los rendimientos.</Text>
        <Text style={styles.text}>• Ideal para inversiones a largo plazo.</Text>
    </View>
);

// Sección de Fórmulas
const FormulasSection = () => (
    <View style={styles.section}>
        <Text style={styles.title}>Fórmulas de Interés Compuesto</Text>

        <Text style={styles.subtitle}>Calcular Capital Inicial (C):</Text>
        <Text style={styles.formula}>C = M / (1 + i)^t</Text>

        <Text style={styles.subtitle}>Calcular Tasa de Interés (i):</Text>
        <Text style={styles.formula}>i = (M / C)^(1/t) - 1</Text>

        <Text style={styles.subtitle}>Calcular Tiempo (t):</Text>
        <Text style={styles.formula}>t = log(M / C) / log(1 + i)</Text>

        <Text style={styles.subtitle}>Calcular Monto Final (M):</Text>
        <Text style={styles.formula}>M = C * (1 + i)^t</Text>
    </View>
);

// Sección de Cálculos
const CalculationSection = () => {
    const [C, setC] = useState('');
    const [i, setI] = useState('');
    const [M, setM] = useState('');
    const [timeYears, setTimeYears] = useState('');
    const [timeMonths, setTimeMonths] = useState('');
    const [timeDays, setTimeDays] = useState('');
    const [selectedUnits, setSelectedUnits] = useState([]);
    const [result, setResult] = useState(null);

    const toggleSelection = (unit) => {
        if (selectedUnits.includes(unit)) {
            setSelectedUnits(selectedUnits.filter(item => item !== unit));
        } else {
            setSelectedUnits([...selectedUnits, unit]);
        }
    };

    const calculateCompoundInterest = async () => {
        const values = [C, i, timeYears || timeMonths || timeDays, M];
        const nullValues = values.filter(v => v === '').length;

        if (nullValues !== 1) {
            Alert.alert('Error', 'Debe dejar solo un campo vacío para calcular.');
            return;
        }

        let tiempo = {};
        let unidadTiempo = null;

        if (selectedUnits.includes("años")) tiempo.y = parseFloat(timeYears);
        if (selectedUnits.includes("meses")) tiempo.m = parseFloat(timeMonths);
        if (selectedUnits.includes("dias")) tiempo.d = parseFloat(timeDays);

        Object.keys(tiempo).forEach(key => {
            if (isNaN(tiempo[key])) delete tiempo[key];
        });

        if (selectedUnits.length === 1) {
            if (selectedUnits.includes("años")) unidadTiempo = "y";
            else if (selectedUnits.includes("meses")) unidadTiempo = "m";
            else if (selectedUnits.includes("dias")) unidadTiempo = "d";
        } else if (selectedUnits.length === 2) {
            if (selectedUnits.includes("años") && selectedUnits.includes("meses")) unidadTiempo = "ym";
            else if (selectedUnits.includes("años") && selectedUnits.includes("dias")) unidadTiempo = "yd";
            else if (selectedUnits.includes("meses") && selectedUnits.includes("dias")) unidadTiempo = "md";
        } else if (selectedUnits.length === 3) {
            unidadTiempo = "ymd";
        } else {
            Alert.alert('Error', 'Selecciona al menos una unidad de tiempo.');
            return;
        }

        if (Object.keys(tiempo).length === 1) {
            tiempo = Object.values(tiempo)[0];
        } else if (Object.keys(tiempo).length === 0) {
            tiempo = null;
        }

        const capital = !isNaN(parseFloat(C)) ? parseFloat(C) : null;
        const tasaInteres = !isNaN(parseFloat(i)) ? parseFloat(i) : null;
        const montoFinal = !isNaN(parseFloat(M)) ? parseFloat(M) : null;

        console.log("Llamando a interesCompuesto con:", { capital, tasaInteres, tiempo, montoFinal, unidadTiempo });

        try {
            const calculatedResult = await interesCompuesto(capital, tasaInteres, tiempo, montoFinal, unidadTiempo);
            setResult(`Monto final: COP ${calculatedResult}`); // Sin redondeo
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error en el cálculo.');
        }
    };

    return (
        <View style={styles.section}>
            <Text style={styles.title}>Calculadora de Interés Compuesto</Text>

            <TextInput style={styles.input} placeholder="Capital inicial (COP)" keyboardType="numeric" onChangeText={setC} value={C} />
            <TextInput
                style={styles.input}
                placeholder="Tasa de interés (i)"
                keyboardType="numeric"
                value={i}
                onChangeText={setI}
            />

            <Text style={styles.subtitle}>Selecciona la unidad de tiempo:</Text>

            <View style={styles.timeButtons}>
                {["años", "meses", "dias"].map((unit) => (
                    <TouchableOpacity
                        key={unit}
                        style={[styles.timeButton, selectedUnits.includes(unit) && styles.selectedButton]}
                        onPress={() => toggleSelection(unit)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.timeButtonText, selectedUnits.includes(unit) && styles.selectedText]}>
                            {unit.charAt(0).toUpperCase() + unit.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {selectedUnits.includes("años") && <TextInput style={styles.input} placeholder="Tiempo en años" keyboardType="numeric" value={timeYears} onChangeText={setTimeYears} />}
            {selectedUnits.includes("meses") && <TextInput style={styles.input} placeholder="Tiempo en meses" keyboardType="numeric" value={timeMonths} onChangeText={setTimeMonths} />}
            {selectedUnits.includes("dias") && <TextInput style={styles.input} placeholder="Tiempo en días" keyboardType="numeric" value={timeDays} onChangeText={setTimeDays} />}

            <TextInput style={styles.input} placeholder="Monto final (COP)" keyboardType="numeric" onChangeText={setM} value={M} />

            <TouchableOpacity style={styles.button} onPress={calculateCompoundInterest} activeOpacity={0.7}>
                <Text style={styles.buttonText}>Calcular</Text>
            </TouchableOpacity>

            {result && <Text style={styles.result}>{result}</Text>}
        </View>
    );
};


// Estilos
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1B1D2A' },
    contentContainer: { padding: 20, paddingBottom: 80, marginTop: 30 },
    tabContainer: {
        position: 'absolute',
        bottom: 2,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#2A2D3E',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: '#444',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    tabButton: {
        alignItems: 'center', // Centrar ícono y texto
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#E5A442',
    }, tabButton: {
        alignItems: 'center', // Centrar ícono y texto
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#E5A442',
    },
    tabText: {
        color: '#FFF',
        fontSize: 14,
        marginTop: 5, // Espacio entre ícono y texto
    },
    activeTabText: {
        color: '#E5A442',
        fontWeight: 'bold',
    },
    icon: {
        marginBottom: 5, // Espacio entre ícono y texto
    },
    tabText: {
        color: '#FFF',
        fontSize: 14,
        marginTop: 5, // Espacio entre ícono y texto
    },
    activeTabText: {
        color: '#E5A442',
        fontWeight: 'bold',
    },
    icon: {
        marginBottom: 5, // Espacio entre ícono y texto
    },
    section: { marginBottom: 30 },
    title: { color: '#FFD700', fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
    subtitle: { color: '#E5A442', fontSize: 18, marginTop: 10, marginBottom: 8 },
    text: { color: '#FFF', fontSize: 16, marginBottom: 5, lineHeight: 22 },
    formula: {
        color: '#FFF',
        fontSize: 16,
        backgroundColor: '#2A2D3E',
        padding: 15,
        borderRadius: 8,
        marginVertical: 10,
        fontFamily: 'monospace',
        borderWidth: 1,
        borderColor: '#E5A442',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    input: {
        backgroundColor: '#2A2D3E',
        color: '#FFF',
        padding: 12,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5A442',
        placeholderTextColor: '#BBB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    svg: {
        marginVertical: 20,
        alignSelf: 'center',
    },
    highlight: {
        color: '#FFD700',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#E5A442',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: '#1B1D2A',
        fontSize: 18,
        fontWeight: 'bold',
    },
    result: { color: '#FFD700', fontSize: 18, marginTop: 10, textAlign: 'center' },
    timeButtons: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
    timeButton: { flex: 1, backgroundColor: "#2A2D3E", padding: 12, borderRadius: 10, alignItems: "center", marginHorizontal: 5, borderWidth: 1, borderColor: "#E5A442" },
    selectedButton: { backgroundColor: "#FFD700", borderColor: "#FFF" },
    timeButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
    selectedText: { color: "#1B1D2A" },
});

export default CompoundInterestScreen;