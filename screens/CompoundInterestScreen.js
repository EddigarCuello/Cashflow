import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const CompoundInterestScreen = () => {
    const [principal, setPrincipal] = useState('');
    const [rate, setRate] = useState('');
    const [time, setTime] = useState('');
    const [result, setResult] = useState(null);

    const calculateInterest = () => {
        const P = parseFloat(principal);
        const r = parseFloat(rate) / 100;
        const t = parseFloat(time);

        if (!isNaN(P) && !isNaN(r) && !isNaN(t)) {
            const A = P * Math.pow((1 + r), t);
            setResult(A.toFixed(2));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Interés Compuesto</Text>
            <Text style={styles.description}>
                El interés compuesto se calcula sobre el monto inicial y los intereses acumulados.
            </Text>
            
            <TextInput 
                style={styles.input}
                placeholder="Capital inicial (COP)"
                keyboardType="numeric"
                onChangeText={setPrincipal}
                value={principal}
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
                placeholder="Tiempo (años)"
                keyboardType="numeric"
                onChangeText={setTime}
                value={time}
            />

            <TouchableOpacity style={styles.button} onPress={calculateInterest}>
                <Text style={styles.buttonText}>Calcular</Text>
            </TouchableOpacity>

            {result && <Text style={styles.result}>Monto final: COP {result}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#1B1D2A', justifyContent: 'center' },
    title: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    description: { color: '#FFF', fontSize: 16, marginBottom: 20 },
    input: { backgroundColor: '#2A2D3E', color: '#FFF', padding: 10, marginBottom: 10, borderRadius: 5 },
    button: { backgroundColor: '#E5A442', padding: 10, borderRadius: 5, alignItems: 'center' },
    buttonText: { color: '#FFF', fontSize: 16 },
    result: { color: '#FFD700', fontSize: 18, marginTop: 10 }
});

export default CompoundInterestScreen;
