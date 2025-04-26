export const calcularGradienteGeometrico = (A, i, n, G, C) => {
  console.log("Datos recibidos en calcularGradienteGeometrico:", { A, i, n, G, C });

  if (G === i) {
    throw new Error("La tasa de crecimiento (G) no puede ser igual a la tasa de interés (i).");
  }

  const factor1 = Math.pow(1 + G, n) * Math.pow(1 + i, n);
  const valorFuturo = (A * factor1) / (G - i) * C;
  return valorFuturo;
};

export const calcularPago = (A, i, n, G) => {
  console.log("Datos recibidos en calcularPago:", { A, i, n, G });

  if (i === G) {
    throw new Error("La tasa de interés (i) no puede ser igual a la tasa de crecimiento (G).");
  }

  // Verificar que los valores sean válidos
  if (i <= 0 || G <= 0 || n <= 0 || A <= 0) {
    throw new Error("Todos los valores deben ser mayores que cero.");
  }

  // Implementación de la fórmula
  const ratio = (1 + G) / (1 + i);
  const roundedRatio = parseFloat(ratio.toFixed(6)); // Redondear a 6 decimales
  console.log("Ratio (1 + G) / (1 + i):", roundedRatio);

  const ratioPow = Math.pow(roundedRatio, n);
  const roundedRatioPow = parseFloat(ratioPow.toFixed(6)); // Redondear a 6 decimales
  console.log("Ratio elevado a la n:", roundedRatioPow);

  const factor = (1 - roundedRatioPow) / (i - G);
  const roundedFactor = parseFloat(factor.toFixed(6)); // Redondear a 6 decimales
  console.log("Factor (1 - ratio^n) / (i - G):", roundedFactor);

  const pago = A * roundedFactor;
  const roundedPago = parseFloat(pago.toFixed(6)); // Redondear el resultado final
  console.log("Resultado del pago:", roundedPago);

  return roundedPago;
};