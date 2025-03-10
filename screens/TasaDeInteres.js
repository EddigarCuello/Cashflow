import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const TasaDeInteres = () => {
    const [formula, setFormula] = useState('general');
    const [vp, setVp] = useState('');
    const [tasa, setTasa] = useState('');
    const [tiempo, setTiempo] = useState('');
    const [vf, setVf] = useState('');
    const [resultado, setResultado] = useState('');

    const calcularInteres = () => {
        if (!vp || !tasa || !tiempo || !vf) {
            alert('Por favor, completa todos los campos.');
            return;
        }

        const vpNum = parseFloat(vp);
        const tasaNum = parseFloat(tasa);
        const tiempoNum = parseFloat(tiempo);
        const vfNum = parseFloat(vf);

        if (formula === 'general') {
            const interes = vpNum * tasaNum * tiempoNum;
            setResultado(`Interés Simple: $${interes.toFixed(2)}`);
        } else if (formula === 'vp') {
            const vpCalculado = vfNum / (1 + tasaNum * tiempoNum);
            setResultado(`Valor Presente: $${vpCalculado.toFixed(2)}`);
        } else if (formula === 'tiempo') {
            const tiempoCalculado = (vfNum - vpNum) / (vpNum * tasaNum);
            setResultado(`Tiempo: ${tiempoCalculado.toFixed(2)} años`);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Interés Simple</Text>
            
            <Picker
                selectedValue={formula}
                style={styles.picker}
                onValueChange={(itemValue) => setFormula(itemValue)}
            >
                <Picker.Item label="Fórmula general del interés simple" value="general" />
                <Picker.Item label="Cálculo del Valor Presente (VP)" value="vp" />
                <Picker.Item label="Cálculo del tiempo (t)" value="tiempo" />
            </Picker>

            {formula === 'general' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Valor Presente (VP)"
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
                </>
            )}

            {formula === 'vp' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Valor Futuro (VF)"
                        keyboardType="numeric"
                        value={vf}
                        onChangeText={setVf}
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
                </>
            )}

            {formula === 'tiempo' && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Valor Presente (VP)"
                        keyboardType="numeric"
                        value={vp}
                        onChangeText={setVp}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Valor Futuro (VF)"
                        keyboardType="numeric"
                        value={vf}
                        onChangeText={setVf}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Tasa de interés (r)"
                        keyboardType="numeric"
                        value={tasa}
                        onChangeText={setTasa}
                    />
                </>
            )}

            <TouchableOpacity style={styles.boton} onPress={calcularInteres}>
                <Text style={styles.textoBoton}>Calcular</Text>
            </TouchableOpacity>

            {resultado ? <Text style={styles.resultado}>{resultado}</Text> : null}
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
        marginBottom: 20,
        textAlign: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
        color: '#FFF',
        backgroundColor: '#2A2D3E',
        borderRadius: 10,
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