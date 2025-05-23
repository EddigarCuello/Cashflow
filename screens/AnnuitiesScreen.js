import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importar íconos
import Svg, { Path, G, Rect, Circle } from 'react-native-svg'; // Importar componentes de SVG
import { AnualidadesSimples } from '../Logic/AnualidadesSimples';
import { JSONStorageService } from '../Logic/JSON_Storage_Service';

const AnnuitiesScreen = () => {
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

// Sección de Información con SVG
const InfoSection = () => (
    <View style={styles.section}>
        <Text style={styles.title}>¿Qué son las Anualidades Simples?</Text>
        <Text style={styles.text}>
            Las anualidades son una serie de pagos periódicos iguales realizados a intervalos regulares durante un tiempo determinado.
        </Text>

        {/* SVG de una gráfica de crecimiento */}
        <Svg height="150" width="100%" viewBox="0 0 100 100" style={styles.svg}>
            <G transform="translate(0, 100) scale(1, -1)">
                {/* Ejes */}
                <Path d="M10 10 V90 H90" stroke="#E5A442" strokeWidth="2" fill="none" />
                {/* Línea de crecimiento */}
                <Path
                    d="M10 10 L30 40 L50 20 L70 60 L90 30"
                    stroke="#FFD700"
                    strokeWidth="3"
                    fill="none"
                />
                {/* Puntos en la gráfica */}
                <Circle cx="10" cy="10" r="3" fill="#FFD700" />
                <Circle cx="30" cy="40" r="3" fill="#FFD700" />
                <Circle cx="50" cy="20" r="3" fill="#FFD700" />
                <Circle cx="70" cy="60" r="3" fill="#FFD700" />
                <Circle cx="90" cy="30" r="3" fill="#FFD700" />
            </G>
        </Svg>

        <Text style={styles.subtitle}>Características principales:</Text>
        <Text style={styles.text}>• Pagos periódicos iguales (A)</Text>
        <Text style={styles.text}>• Intervalos de tiempo constantes</Text>
        <Text style={styles.text}>• Tasa de interés constante (j)</Text>
        <Text style={styles.text}>• Duración definida (t)</Text>

        <Text style={styles.subtitle}>Tipos de anualidades:</Text>
        <Text style={styles.text}>• Ordinarias (vencidas): Pagos al final del período</Text>
        <Text style={styles.text}>• Anticipadas: Pagos al inicio del período</Text>
    </View>
);

// Sección de Fórmulas
const FormulasSection = () => (
    <View style={styles.section}>
        <Text style={styles.title}>Fórmulas Básicas</Text>

        <Text style={styles.subtitle}>Valor Futuro (VF):</Text>
        <Text style={styles.formula}>VF = A × [(1 + i)ⁿ - 1] / i</Text>

        <Text style={styles.subtitle}>Valor Actual (VA):</Text>
        <Text style={styles.formula}>VA = A × [1 - (1 + i)⁻ⁿ] / i</Text>

        <Text style={styles.subtitle}>Donde:</Text>
        <Text style={styles.text}>• A = Pago periódico</Text>
        <Text style={styles.text}>• i = Tasa de interés por período (j/m)</Text>
        <Text style={styles.text}>• n = Número total de períodos (t × m)</Text>
        <Text style={styles.text}>• m = Períodos de capitalización por año</Text>
    </View>
);

// Sección de Cálculos con Modal
const CalculationSection = () => {
    const [A, setA] = useState('');
    const [j, setJ] = useState('');
    const [t, setT] = useState('');
    const [VF, setVF] = useState('');
    const [VA, setVA] = useState('');
    const [tipo, setTipo] = useState('VF');
    const [periodoCapitalizacion, setPeriodoCapitalizacion] = useState('mensual');
    const [result, setResult] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const periodoCapitalizacionOptions = {
        diaria: { p: 1, unidadTiempoPerido: 'd' },
        semanal: { p: 7, unidadTiempoPerido: 'd' },
        quincenal: { p: 0.5, unidadTiempoPerido: 'm' },
        mensual: { p: 1, unidadTiempoPerido: 'm' },
        bimensual: { p: 2, unidadTiempoPerido: 'm' },
        trimestral: { p: 3, unidadTiempoPerido: 'm' },
        cuatrimestral: { p: 4, unidadTiempoPerido: 'm' },
        semestral: { p: 6, unidadTiempoPerido: 'm' },
        anual: { p: 1, unidadTiempoPerido: 'y' },
    };

    const calculateAnnuity = async () => {
        const tiempo = t === '' ? null : parseFloat(t);
        const ANum = A === '' ? null : parseFloat(A);
        const jNum = j === '' ? null : parseFloat(j);
        const VFNum = VF === '' ? null : parseFloat(VF);
        const VANum = VA === '' ? null : parseFloat(VA);

        const { p, unidadTiempoPerido } = periodoCapitalizacionOptions[periodoCapitalizacion];

        try {
            const resultadoCalculado = await AnualidadesSimples(
                ANum,
                jNum,
                tiempo,
                p,
                VFNum,
                VANum,
                tipo,
                unidadTiempoPerido
            );

            // Si estamos calculando VF o VA, mostrar opción de préstamo
            if ((tipo === 'VF' && VF === '') || (tipo === 'VA' && VA === '')) {
                setResult(`Monto Total: ${resultadoCalculado.toLocaleString()} COP`);
                setShowConfirmation(true);
            } else {
                setResult(`Resultado: ${resultadoCalculado.toLocaleString()} COP`);
            }
        } catch (error) {
            Alert.alert('Error', error.message);
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

                // Extraer el monto total del resultado
                const montoTotal = parseFloat(result.split('Monto Total: ')[1].replace(' COP', '').replace(/,/g, ''));

                // Crear objeto de préstamo simplificado
                const loanData = {
                    tipo: tipo === 'VF' ? "Anualidad Valor Futuro" : "Anualidad Valor Actual",
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
            } catch (error) {
                console.error('Error al guardar préstamo:', error);
                Alert.alert("Error", "Ocurrió un error al guardar el préstamo");
            }
        } else {
            Alert.alert("Cancelado", "Préstamo cancelado.");
        }
        // Limpiar los inputs y ocultar confirmación
        setA("");
        setJ("");
        setT("");
        setVF("");
        setVA("");
        setShowConfirmation(false);
    };

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cálculo de Anualidades</Text>

            <Text style={styles.label}>Selecciona el tipo de cálculo:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={tipo}
                    style={styles.picker}
                    onValueChange={(itemValue) => setTipo(itemValue)}
                    dropdownIconColor="#E5A442"
                >
                    <Picker.Item label="Valor Futuro (VF)" value="VF" style={styles.pickerItem} />
                    <Picker.Item label="Valor Actual (VA)" value="VA" style={styles.pickerItem} />
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Pago periódico (A)"
                placeholderTextColor="#BBB"
                keyboardType="numeric"
                value={A}
                onChangeText={setA}
            />
            <TextInput
                style={styles.input}
                placeholder="Tasa de interés nominal (j)"
                placeholderTextColor="#BBB"
                keyboardType="numeric"
                value={j}
                onChangeText={setJ}
            />

            <Text style={styles.label}>Selecciona el período de capitalización:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={periodoCapitalizacion}
                    style={styles.picker}
                    onValueChange={(itemValue) => setPeriodoCapitalizacion(itemValue)}
                    dropdownIconColor="#E5A442"
                >
                    <Picker.Item label="Diaria" value="diaria" style={styles.pickerItem} />
                    <Picker.Item label="Semanal" value="semanal" style={styles.pickerItem} />
                    <Picker.Item label="Quincenal" value="quincenal" style={styles.pickerItem} />
                    <Picker.Item label="Mensual" value="mensual" style={styles.pickerItem} />
                    <Picker.Item label="Bimensual" value="bimensual" style={styles.pickerItem} />
                    <Picker.Item label="Trimestral" value="trimestral" style={styles.pickerItem} />
                    <Picker.Item label="Cuatrimestral" value="cuatrimestral" style={styles.pickerItem} />
                    <Picker.Item label="Semestral" value="semestral" style={styles.pickerItem} />
                    <Picker.Item label="Anual" value="anual" style={styles.pickerItem} />
                </Picker>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Tiempo en años (t)"
                placeholderTextColor="#BBB"
                keyboardType="numeric"
                value={t}
                onChangeText={setT}
            />

            {tipo === 'VF' && (
                <TextInput
                    style={styles.input}
                    placeholder="Valor Futuro (VF)"
                    placeholderTextColor="#BBB"
                    keyboardType="numeric"
                    value={VF}
                    onChangeText={setVF}
                />
            )}

            {tipo === 'VA' && (
                <TextInput
                    style={styles.input}
                    placeholder="Valor Actual (VA)"
                    placeholderTextColor="#BBB"
                    keyboardType="numeric"
                    value={VA}
                    onChangeText={setVA}
                />
            )}

            <TouchableOpacity style={styles.button} onPress={calculateAnnuity}>
                <Text style={styles.buttonText}>Calcular</Text>
            </TouchableOpacity>

            {result && <Text style={styles.result}>{result}</Text>}

            {/* Mostrar resultado y botones de confirmación */}
            {showConfirmation && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>{result}</Text>
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

// Estilos actualizados
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
    sectionTitle: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    title: { color: '#FFD700', fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
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
    label: {
        color: '#E5A442',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#2A2D3E',
        borderRadius: 1,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E5A442',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    picker: {
        color: '#FFF',
    },
    pickerItem: {
        color: '#FFF',
        backgroundColor: '#2A2D3E',
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
    svg: {
        marginVertical: 20,
        alignSelf: 'center',
    },
});

export default AnnuitiesScreen;