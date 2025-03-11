import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const TasaDeInteres = () => {
    const [vp, setVp] = useState('');
    const [tasa, setTasa] = useState('');
    const [tiempo, setTiempo] = useState('');
    const [interes, setInteres] = useState('');
    const [monto, setMonto] = useState('');
    const [vf, setVf] = useState('');
    const [resultado, setResultado] = useState('');

    const calcularInteres = () => {
        if (!vp || !tasa || !tiempo) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const vpNum = parseFloat(vp);
        const tasaNum = parseFloat(tasa);
        const tiempoNum = parseFloat(tiempo);

        const interesCalculado = vpNum * tasaNum * tiempoNum;
        const montoCalculado = vpNum + interesCalculado;

        setInteres(interesCalculado.toFixed(2));
        setMonto(montoCalculado.toFixed(2));
        setResultado(`Interés Simple: $${interesCalculado.toFixed(2)}\nMonto Total: $${montoCalculado.toFixed(2)}`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Interés Simple</Text>
            <Text style={styles.descripcion}>
                El interés simple es una forma de calcular el rendimiento de una inversión o el costo de un préstamo
                sin considerar la acumulación de intereses en periodos anteriores.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Capital (P)"
                keyboardType="numeric"
                value={vp}
                onChangeText={setVp}
            />
            <TextInput
                style={styles.input}
                placeholder="Tasa de interés (r)"
                keyboardType="numeric"
                value={tasa}
                onChangeText={setTasa}
            />
            <TextInput
                style={styles.input}
                placeholder="Tiempo (t)"
                keyboardType="numeric"
                value={tiempo}
                onChangeText={setTiempo}
            />
            <TextInput
                style={styles.input}
                placeholder="Interés (I)"
                keyboardType="numeric"
                value={interes}
                onChangeText={setInteres}
            />
            <TextInput
                style={styles.input}
                placeholder="Monto Total (M)"
                keyboardType="numeric"
                value={monto}
                onChangeText={setMonto}
            />

            <TouchableOpacity style={styles.boton} onPress={calcularInteres}>
                <Text style={styles.textoBoton}>Calcular</Text>
            </TouchableOpacity>

            {resultado ? (
                <View>
                    <Text style={styles.resultado}>Interés (I): ${interes}</Text>
                    <Text style={styles.resultado}>Monto Total (M): ${monto}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1B1D2A',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 10,
        textAlign: 'center',
    },
    descripcion: {
        fontSize: 16,
        color: '#BBB',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#E5A442',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        marginBottom: 20,
        color: '#FFF',
        backgroundColor: '#2A2D3E',
    },
    boton: {
        backgroundColor: '#E5A442',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    textoBoton: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultado: {
        marginTop: 20,
        fontSize: 18,
        color: '#FFF',
        textAlign: 'center',
    },
});

export default TasaDeInteres;
