import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TIRScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [initialInvestment, setInitialInvestment] = useState('');
  const [cashFlows, setCashFlows] = useState(['', '', '']); // Para 3 años
  const [result, setResult] = useState(null);

  const calculateNPV = (rate, cashFlowArray) => {
    return cashFlowArray.reduce((acc, flow, index) => {
      return acc + flow / Math.pow(1 + rate, index);
    }, 0);
  };

  const calculateTIR = () => {
    const investment = parseFloat(initialInvestment) * -1;
    const flows = cashFlows.map(flow => parseFloat(flow) || 0);
    const allFlows = [investment, ...flows];

    let r = 0.1; // Comenzamos con una suposición del 10%
    let npv = 0;
    const maxIterations = 100;
    const tolerance = 0.0001;

    // Método de Newton-Raphson para encontrar la TIR
    for (let i = 0; i < maxIterations; i++) {
      const npv = calculateNPV(r, allFlows);
      
      if (Math.abs(npv) < tolerance) {
        setResult(r);
        return;
      }

      // Calculamos la derivada
      const derivative = allFlows.reduce((acc, flow, index) => {
        return acc - (index * flow) / Math.pow(1 + r, index + 1);
      }, 0);

      // Nueva aproximación
      const newR = r - npv / derivative;
      
      if (Math.abs(newR - r) < tolerance) {
        setResult(r);
        return;
      }

      r = newR;
    }

    setResult(r);
  };

  const renderInfoSection = () => (
    <ScrollView style={styles.sectionContainer}>
      <Text style={styles.title}>¿Qué es la TIR?</Text>
      <Text style={styles.text}>
        La Tasa Interna de Retorno (TIR) es un indicador financiero que permite medir la rentabilidad de una inversión o proyecto.
      </Text>
      <Text style={styles.text}>
        En otras palabras, representa el porcentaje de ganancia anual promedio que genera un proyecto durante su vida útil.
      </Text>
      <Text style={styles.text}>
        La TIR se interpreta como la tasa de interés que iguala el valor de lo que inviertes al inicio con el valor de los ingresos que recibirás en el futuro.
      </Text>
      <Text style={styles.text}>
        Si la TIR es mayor al costo de oportunidad (como un préstamo bancario o una inversión alternativa), entonces el proyecto es rentable y conveniente.
      </Text>

      <Text style={styles.subtitle}>¿Para qué sirve la TIR?</Text>
      <View style={styles.bulletContainer}>
        <Text style={styles.bullet}>• Para saber si un proyecto es rentable</Text>
        <Text style={styles.bullet}>• Para comparar varios proyectos</Text>
        <Text style={styles.bullet}>• Para tomar decisiones financieras</Text>
      </View>
    </ScrollView>
  );

  const renderFormulaSection = () => (
    <ScrollView style={styles.sectionContainer}>
      <Text style={styles.title}>Fórmula de la TIR</Text>
      <Text style={styles.formula}>VPN = Σ[Ft/(1+r)^t] - C₀ = 0</Text>
      <View style={styles.symbolsContainer}>
        <Text style={styles.symbolTitle}>Donde:</Text>
        <Text style={styles.symbol}>C₀: Inversión inicial (valor negativo)</Text>
        <Text style={styles.symbol}>Ft: Flujo de caja en el año t</Text>
        <Text style={styles.symbol}>r: Tasa interna de retorno (TIR)</Text>
        <Text style={styles.symbol}>t: Año específico (1, 2, 3...)</Text>
        <Text style={styles.symbol}>n: Número total de años</Text>
      </View>
    </ScrollView>
  );

  const renderCalculatorSection = () => (
    <ScrollView style={styles.sectionContainer}>
      <Text style={styles.title}>Calculadora TIR</Text>
      
      <Text style={styles.inputLabel}>Inversión Inicial</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={initialInvestment}
        onChangeText={setInitialInvestment}
        placeholder="Ej: 100000"
        placeholderTextColor="#666"
      />

      {cashFlows.map((flow, index) => (
        <View key={index}>
          <Text style={styles.inputLabel}>Flujo de Caja Año {index + 1}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={flow}
            onChangeText={(text) => {
              const newFlows = [...cashFlows];
              newFlows[index] = text;
              setCashFlows(newFlows);
            }}
            placeholder={`Ej: ${(index + 1) * 10000}`}
            placeholderTextColor="#666"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.calculateButton} onPress={calculateTIR}>
        <Text style={styles.buttonText}>Calcular TIR</Text>
      </TouchableOpacity>

      {result !== null && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>TIR = {(result * 100).toFixed(2)}%</Text>
          
          <Text style={styles.subtitle}>Flujo de Caja</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Año</Text>
              <Text style={styles.tableHeaderText}>Flujo de Caja</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>0</Text>
              <Text style={styles.tableCell}>-${initialInvestment}</Text>
            </View>
            {cashFlows.map((flow, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={styles.tableCell}>${flow}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.subtitle}>Visualización de Flujos</Text>
          <View style={styles.chartContainer}>
            <View style={styles.yAxisLabels}>
              <Text style={styles.axisLabel}>+$100k</Text>
              <Text style={styles.axisLabel}>+$50k</Text>
              <Text style={styles.axisLabel}>$0</Text>
              <Text style={styles.axisLabel}>-$50k</Text>
              <Text style={styles.axisLabel}>-$100k</Text>
            </View>
            <View style={styles.chartContent}>
              <View style={styles.horizontalLines}>
                <View style={styles.horizontalLine} />
                <View style={styles.horizontalLine} />
                <View style={styles.horizontalLine} />
                <View style={styles.horizontalLine} />
                <View style={styles.horizontalLine} />
              </View>
              <View style={styles.barChartContainer}>
                {[parseFloat(initialInvestment) * -1, ...cashFlows.map(f => parseFloat(f) || 0)].map((value, index) => {
                  const normalizedHeight = Math.min(Math.abs(value) / 1000, 100);
                  const isNegative = value < 0;
                  return (
                    <View key={index} style={styles.barWrapper}>
                      <View style={styles.barContainer}>
                        {isNegative ? (
                          <>
                            <View style={styles.barEmpty} />
                            <View style={[styles.bar, styles.negativeBar, { height: `${normalizedHeight}%` }]}>
                              <Text style={styles.barValue}>
                                ${Math.abs(value).toLocaleString()}
                              </Text>
                            </View>
                          </>
                        ) : (
                          <>
                            <View style={[styles.bar, styles.positiveBar, { height: `${normalizedHeight}%` }]}>
                              <Text style={styles.barValue}>
                                ${value.toLocaleString()}
                              </Text>
                            </View>
                            <View style={styles.barEmpty} />
                          </>
                        )}
                      </View>
                      <Text style={styles.barLabel}>Año {index}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === 0 && renderInfoSection()}
        {activeTab === 1 && renderFormulaSection()}
        {activeTab === 2 && renderCalculatorSection()}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 0 && styles.activeTab]}
          onPress={() => setActiveTab(0)}
        >
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={activeTab === 0 ? "#E5A442" : "#FFF"}
          />
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>
            Información
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 1 && styles.activeTab]}
          onPress={() => setActiveTab(1)}
        >
          <Ionicons
            name="calculator-outline"
            size={24}
            color={activeTab === 1 ? "#E5A442" : "#FFF"}
          />
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>
            Fórmula
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 2 && styles.activeTab]}
          onPress={() => setActiveTab(2)}
        >
          <Ionicons
            name="analytics-outline"
            size={24}
            color={activeTab === 2 ? "#E5A442" : "#FFF"}
          />
          <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>
            Calculadora
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B1D2A',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionContainer: {
    flex: 1,
  },
  title: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 24,
  },
  subtitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  bulletContainer: {
    marginLeft: 10,
  },
  bullet: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 10,
  },
  formula: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'monospace',
    textAlign: 'center',
    backgroundColor: '#2A2D3E',
    padding: 20,
    borderRadius: 10,
    marginVertical: 20,
  },
  symbolsContainer: {
    backgroundColor: '#2A2D3E',
    padding: 20,
    borderRadius: 10,
  },
  symbolTitle: {
    color: '#FFD700',
    fontSize: 18,
    marginBottom: 10,
  },
  symbol: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 8,
  },
  inputLabel: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#2A2D3E',
    color: '#FFF',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  calculateButton: {
    backgroundColor: '#E5A442',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#2A2D3E',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  resultText: {
    color: '#E5A442',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  tableContainer: {
    marginVertical: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#E5A442',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    color: '#FFF',
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#444',
    backgroundColor: '#1B1D2A',
  },
  tableCell: {
    color: '#FFF',
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 300,
    marginTop: 20,
    marginBottom: 20,
    paddingRight: 10,
  },
  yAxisLabels: {
    width: 50,
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  axisLabel: {
    color: '#FFF',
    fontSize: 10,
    textAlign: 'right',
  },
  chartContent: {
    flex: 1,
    position: 'relative',
  },
  horizontalLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  horizontalLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  barChartContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'relative',
  },
  barWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    height: '100%',
    width: 40,
    justifyContent: 'center',
  },
  barEmpty: {
    flex: 1,
  },
  bar: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  positiveBar: {
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  negativeBar: {
    backgroundColor: '#FF5252',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  barValue: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    position: 'absolute',
    transform: [{ rotate: '-90deg' }],
  },
  barLabel: {
    color: '#FFF',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2A2D3E',
    padding: 10,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  tab: {
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E5A442',
  },
  tabText: {
    color: '#FFF',
    marginTop: 5,
  },
  activeTabText: {
    color: '#E5A442',
  },
});

export default TIRScreen; 