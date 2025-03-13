import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const AnnuitiesScreen = () => {
    const [payment, setPayment] = useState('');
    const [rate, setRate] = useState('');
    const [time, setTime] = useState('');
    const [result, setResult] = useState(null);

    const calculateAnnuity = () => {
        const R = parseFloat(payment);
        const r = parseFloat(rate) / 100;
        const n = parseFloat(time);

        if (!isNaN(R) && !isNaN(r) && !isNaN(n)) {
            const A = R * ((1 - Math.pow(1 + r, -n)) / r);
            setResult(A.toFixed(2));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.description}>
                <Text style={styles.boldText}>Anualidades: </Text>
                Las anualidades son una serie de pagos periódicos durante un tiempo determinado.
            </Text>

            <TextInput 
                style={styles.input}
                placeholder="Pago periódico (COP)"
                keyboardType="numeric"
                onChangeText={setPayment}
                value={payment}
            />
            <TextInput 
                style={styles.input}
                placeholder="Tasa de interés (%)"
                keyboardType="numeric"
                onChangeText={setRate}
                value={rate}
            />
            <TextInput 
                style={styles.input}
                placeholder="Número de períodos"
                keyboardType="numeric"
                onChangeText={setTime}
                value={time}
            />

            <TouchableOpacity style={styles.button} onPress={calculateAnnuity}>
                <Text style={styles.buttonText}>Calcular</Text>
            </TouchableOpacity>

            {result && <Text style={styles.result}>Valor de la anualidad: COP {result}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#1B1D2A', justifyContent: 'center' },
    description: { color: '#FFF', fontSize: 16, marginBottom: 20 },
    boldText: { fontWeight: 'bold', fontSize: 18 },
    input: { backgroundColor: '#2A2D3E', color: '#FFF', padding: 10, marginBottom: 10, borderRadius: 5 },
    button: { backgroundColor: '#E5A442', padding: 10, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 16 },
    result: { color: '#FFD700', fontSize: 18, marginTop: 10 }
});

export default AnnuitiesScreen;
